import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/lib/**/*.d.ts',
        // Fumadocs loader wiring — integration-only
        'src/lib/source.ts',
        // next/font/google — no meaningful unit surface
        'src/lib/wordmark-font.ts',
        // React hook — chrome-only
        'src/lib/use-client-mounted.ts',
        // localStorage external store — browser-only
        'src/lib/predev-banner-dismissed.ts',
        // shared marketing date constants
        'src/lib/site-dates.ts',
      ],
    },
  },
})
