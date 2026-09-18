// Enable calling `getCloudflareContext()` in `next dev` when NEXT_DEV_CLOUDFLARE=1.
// Skip by default to avoid heavy Wrangler/Minflare startup during normal docs development.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
const path = require('node:path')
const webpack = require('webpack')
if (process.env.NEXT_DEV_CLOUDFLARE === '1') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare')
  initOpenNextCloudflareForDev()
}

const { createMDX } = require('fumadocs-mdx/next')

/**
 * @param {string} phase
 * @param {{ defaultConfig: import('next').NextConfig }} options
 * @returns {import('next').NextConfig}
 */
function createNextConfig(phase, { defaultConfig }) {
  const { experimental, logging, ...restDefaultConfig } = defaultConfig
  // Strip deprecated experimental.browserDebugInfoInTerminal (use logging.browserToTerminal).
  const experimentalConfig = { ...experimental }
  Reflect.deleteProperty(experimentalConfig, 'browserDebugInfoInTerminal')

  const config = {
    ...restDefaultConfig,
    experimental: experimentalConfig,
    logging: {
      ...logging,
    },
    async headers() {
      // turbopanel.io hosts /security, the legal pages, the docs and the
      // waitlist form, and documents this very header set as a property of
      // the product — so the site sends it too. Cloudflare serves static
      // assets without invoking the worker, so `public/_headers` carries the
      // same set for those paths; keep the two in step.
      //
      // The CSP is Report-Only on purpose: the API reference page loads
      // Scalar from jsDelivr and fetches specs from the control-plane origin,
      // and a wrong enforced policy breaks the docs silently. Promote it to
      // Content-Security-Policy once reports from a real deploy are clean.
      const csp = [
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        // Next injects inline bootstrap scripts; Scalar loads from jsDelivr.
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' https://turbopanel.app https://cdn.jsdelivr.net",
      ].join('; ')
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
            },
            { key: 'Content-Security-Policy-Report-Only', value: csp },
          ],
        },
      ]
    },
    async redirects() {
      return [
        {
          source: '/discord',
          destination: 'https://discord.com/invite/vGDQaTXPQw',
          permanent: false,
        },
        {
          source: '/docs/getting-started/tilt-troubleshooting',
          destination: '/docs/getting-started/console-troubleshooting',
          permanent: true,
        },
      ]
    },
    // Next.js 16: Turbopack is the default bundler. Aliases must be in turbopack for dev + default build.
    turbopack: {
      resolveAlias: {
        'fumadocs-mdx:collections': './.source',
      },
    },
    // Kept for `next build --webpack` / `next dev --webpack` fallback (e.g. if a plugin injects webpack).
    webpack: (config) => {
      // Suppress "Critical dependency: the request of a dependency is an expression" from
      // @scalar/snippetz → stringify-object → web-worker. The code works at runtime.
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { message: /Critical dependency: the request of a dependency is an expression/ },
      ]
      config.resolve.alias = {
        ...config.resolve.alias,
        'fumadocs-mdx:collections': path.join(__dirname, '.source'),
      }
      // Webpack treats fumadocs-mdx: as a URI scheme and fails before alias resolution.
      // Replace the request so Webpack resolves .source/*.ts instead.
      config.plugins = config.plugins || []
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^fumadocs-mdx:collections\/(.*)$/,
          (resource) => {
            const subpath = resource.request.match(/^fumadocs-mdx:collections\/(.*)$/)[1]
            resource.request = path.join(__dirname, '.source', `${subpath}.ts`)
          }
        )
      )
      return config
    },
  }

  const withMDX = createMDX()
  return withMDX(config)
}

module.exports = createNextConfig
