// Next.js 16: eslint-config-next uses ESLint 9 flat config format.
import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    ignores: ['.tamagui/**', 'cloudflare-env.d.ts'],
  },
]

export default config
