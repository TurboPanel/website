import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

function findFumadocsMdxRoot(): string {
  const appPath = path.join(
    __dirname,
    '..',
    'node_modules',
    'fumadocs-mdx',
    'dist',
    'config',
    'index.js'
  )
  if (existsSync(appPath)) {
    return path.join(__dirname, '..', 'node_modules', 'fumadocs-mdx')
  }
  return path.join(__dirname, '..', 'node_modules', 'fumadocs-mdx')
}
const mdxRootResolved = findFumadocsMdxRoot()

const { defineDocs, defineConfig, frontmatterSchema } = require(
  path.join(mdxRootResolved, 'dist', 'config', 'index.js')
)
const lastModified = require(
  path.join(mdxRootResolved, 'dist', 'plugins', 'last-modified.js')
).default

export const docs = defineDocs({
  dir: 'docs',
  docs: {
    schema: frontmatterSchema.extend({
      title: z.string(),
      description: z.string(),
      lastUpdated: z.coerce.date().optional(),
    }),
  },
})

export default defineConfig({
  plugins: [lastModified()],
})
