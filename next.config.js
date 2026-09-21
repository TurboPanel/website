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
    output: 'standalone',
    poweredByHeader: false,
    // CI already typechecks. The 1 GiB VPS OOMs during `next build`'s tsc
    // pass; deploy.sh sets TURBOPANEL_SKIP_TS_CHECK=1.
    typescript: {
      ignoreBuildErrors: process.env.TURBOPANEL_SKIP_TS_CHECK === '1',
    },
    async headers() {
      // turbopanel.io hosts /security, the legal pages, the docs and the
      // waitlist form, and documents this very header set as a property of
      // the product — so the site sends it too.
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
    // Next.js 16: Turbopack is the default bundler.
    turbopack: {
      resolveAlias: {
        'fumadocs-mdx:collections': './.source',
      },
    },
  }

  const withMDX = createMDX()
  return withMDX(config)
}

module.exports = createNextConfig
