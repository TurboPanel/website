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
      // Ratchet. SonarCloud only gates coverage on *new* code (80%), so
      // repo-wide coverage could erode indefinitely without any gate
      // noticing. These are the measured levels minus ~1pt of headroom, so
      // ordinary churn passes and a real regression fails. Raise them when
      // coverage rises; do not lower them to make a red run go green.
      thresholds: {
        statements: 97,
        branches: 84,
        functions: 95,
        lines: 97,
      },
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
