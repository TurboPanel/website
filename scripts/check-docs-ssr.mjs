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
import {
  docsSsrFailureMessage,
  evaluateDocsSsrHtml,
} from '../src/lib/docs-ssr.ts'

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
const result = evaluateDocsSsrHtml(html)
if (!result.ok) {
  console.error(docsSsrFailureMessage(result.reason))
  process.exit(1)
}

console.log('check-docs-ssr: introduction HTML includes server-rendered docs content')
