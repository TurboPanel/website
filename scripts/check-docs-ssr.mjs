#!/usr/bin/env node
/**
 * Regression: built docs HTML must include visible page content, not only the
 * client "Loading…" shell (see DocsLayoutClient).
 *
 * Run after `pnpm build`.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const htmlPath = path.join(
  root,
  '.next/server/app/docs/getting-started/introduction.html',
)

if (!existsSync(htmlPath)) {
  console.error(
    `check-docs-ssr: missing ${path.relative(root, htmlPath)} — run \`pnpm build\` first`,
  )
  process.exit(1)
}

const html = readFileSync(htmlPath, 'utf8')
const contentSnippet =
  'TurboPanel is a platform for managing dockerized applications and infrastructure'

if (!html.includes(contentSnippet)) {
  console.error(
    'check-docs-ssr: introduction HTML is missing visible page body content',
  )
  process.exit(1)
}

const layoutIdx = html.indexOf('id="nd-docs-layout"')
if (layoutIdx === -1) {
  console.error('check-docs-ssr: docs layout root (#nd-docs-layout) not found')
  process.exit(1)
}

const layoutWindow = html.slice(layoutIdx, layoutIdx + 800)
if (layoutWindow.includes('Loading…') && !layoutWindow.includes(contentSnippet)) {
  console.error(
    'check-docs-ssr: docs layout still renders only the Loading… shell in initial HTML',
  )
  process.exit(1)
}

console.log('check-docs-ssr: introduction HTML includes server-rendered docs content')
