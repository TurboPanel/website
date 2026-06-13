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
  const { browserDebugInfoInTerminal, ...experimentalConfig } = experimental ?? {}

  const config = {
    ...restDefaultConfig,
    async redirects() {
      return [
        {
          source: '/docs/architecture/monorepo',
          destination: '/docs/architecture/development-architecture',
          permanent: true,
        },
        {
          source: '/docs/getting-started/migration-troubleshooting',
          destination: '/docs/getting-started/database-troubleshooting',
          permanent: true,
        },
      ]
    },
    experimental: experimentalConfig,
    logging: {
      ...logging,
      browserToTerminal: logging?.browserToTerminal ?? browserDebugInfoInTerminal,
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
