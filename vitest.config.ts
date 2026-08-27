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
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/lib/**/*.ts', 'scripts/**/*.mjs'],
      exclude: [
        'src/**/*.test.ts',
        'src/lib/**/*.d.ts',
        'scripts/**/*.test.ts',
        // Fumadocs loader wiring — integration-only (no extractable helpers)
        'src/lib/source.ts',
      ],
    },
  },
})
