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

interface RemarkNode {
  type?: string
  lang?: string
  meta?: string | null
  value?: string
  children?: RemarkNode[]
}

type MermaidFenceMeta = Readonly<{
  title?: string
  ariaLabel?: string
}>

function parseMermaidFenceMeta(meta: string | null | undefined): MermaidFenceMeta {
  if (!meta?.trim()) return {}

  const result: { title?: string; ariaLabel?: string } = {}
  const titleMatch = /\btitle=(?:"([^"]*)"|'([^']*)')/.exec(meta)
  if (titleMatch) {
    result.title = titleMatch[1] ?? titleMatch[2]
  }

  const ariaMatch = /\baria-label=(?:"([^"]*)"|'([^']*)')/.exec(meta)
  if (ariaMatch) {
    result.ariaLabel = ariaMatch[1] ?? ariaMatch[2]
  }

  return result
}

function stripMermaidDirectives(code: string): Readonly<{ chart: string } & MermaidFenceMeta> {
  const lines = code.trim().split('\n')
  let title: string | undefined
  let ariaLabel: string | undefined
  const kept: string[] = []

  for (const line of lines) {
    const titleDirective = /^\s*%%\s*title:\s*(.+)$/.exec(line)
    if (titleDirective) {
      title = titleDirective[1].trim()
      continue
    }

    const ariaDirective = /^\s*%%\s*aria-label:\s*(.+)$/.exec(line)
    if (ariaDirective) {
      ariaLabel = ariaDirective[1].trim()
      continue
    }

    kept.push(line)
  }

  return {
    chart: kept.join('\n').trim(),
    title,
    ariaLabel,
  }
}

function mdxStringAttribute(name: string, value: string) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(value),
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value,
              },
            },
          ],
          sourceType: 'module',
        },
      },
    },
  }
}

/**
 * Transform ```mermaid fences into the client `<Mermaid>` component.
 *
 * Optional fence meta: `title="..."` and/or `aria-label="..."`.
 * Optional chart directives (first lines): `%% title: ...` / `%% aria-label: ...`.
 *
 * Build-time SVG (rehype-mermaid / mermaid CLI) is deferred: light/dark theme
 * switching needs either dual SVGs or a runtime re-render, which complicates
 * the MDX pipeline for little gain while diagrams are sparse. The client
 * component lazy-loads the Mermaid runtime only when a diagram nears the
 * viewport — see `src/components/mdx/Mermaid.tsx` and AGENTS.md.
 */
function toMermaidMdx(code: string, fenceMeta: MermaidFenceMeta = {}) {
  const parsed = stripMermaidDirectives(code)
  const chart = parsed.chart
  const title = fenceMeta.title ?? parsed.title
  const ariaLabel = fenceMeta.ariaLabel ?? parsed.ariaLabel

  const attributes = [
    {
      type: 'mdxJsxAttribute',
      name: 'chart',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: JSON.stringify(chart),
        data: {
          estree: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: chart,
                },
              },
            ],
            sourceType: 'module',
          },
        },
      },
    },
  ]

  if (title) {
    attributes.push(mdxStringAttribute('title', title))
  }
  if (ariaLabel) {
    attributes.push(mdxStringAttribute('ariaLabel', ariaLabel))
  }

  return {
    type: 'mdxJsxFlowElement',
    name: 'Mermaid',
    attributes,
    children: [],
  }
}

function remarkMdxMermaid() {
  return (tree: RemarkNode) => {
    function walk(node: RemarkNode) {
      if (!node?.children) return
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.type === 'code' && child.lang === 'mermaid' && child.value) {
          node.children[i] = toMermaidMdx(child.value, parseMermaidFenceMeta(child.meta))
        } else {
          walk(child)
        }
      }
    }
    walk(tree)
  }
}

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
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    rehypeCodeOptions: {
      // Keeps `language-<lang>` on the inner <code> after Shiki highlighting so
      // `mdx-components.tsx` can label each block ("Terminal", "TypeScript", …).
      addLanguageClass: true,
    },
  },
})
