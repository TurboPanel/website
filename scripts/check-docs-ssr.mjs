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

export const INTRODUCTION_HTML_REL = path.join(
  '.next/server/app/docs/getting-started/introduction.html',
)

/**
 * @param {string} [argv1]
 * @param {string} [href]
 * @returns {boolean}
 */
export function isCliEntry(argv1 = process.argv[1], href = import.meta.url) {
  if (!argv1) return false
  return path.resolve(argv1) === fileURLToPath(href)
}

/**
 * @param {{
 *   root?: string
 *   existsSync?: (target: string) => boolean
 *   readFileSync?: (target: string, encoding: string) => string
 *   error?: (...args: unknown[]) => void
 *   log?: (...args: unknown[]) => void
 * }} [opts]
 * @returns {number}
 */
export function run(opts = {}) {
  const rootDir = opts.root ?? root
  const exists = opts.existsSync ?? existsSync
  const readFile = opts.readFileSync ?? readFileSync
  const error = opts.error ?? console.error
  const log = opts.log ?? console.log
  const htmlPath = path.join(rootDir, INTRODUCTION_HTML_REL)

  if (!exists(htmlPath)) {
    error(
      `check-docs-ssr: missing ${path.relative(rootDir, htmlPath)} — run \`pnpm build\` first`,
    )
    return 1
  }

  const html = readFile(htmlPath, 'utf8')
  const result = evaluateDocsSsrHtml(html)
  if (!result.ok) {
    error(docsSsrFailureMessage(result.reason))
    return 1
  }

  log('check-docs-ssr: introduction HTML includes server-rendered docs content')
  return 0
}

/**
 * @param {{
 *   root?: string
 *   existsSync?: (target: string) => boolean
 *   readFileSync?: (target: string, encoding: string) => string
 *   error?: (...args: unknown[]) => void
 *   log?: (...args: unknown[]) => void
 * }} [opts]
 * @param {(code?: number) => void} [exit]
 */
export function main(opts = {}, exit = process.exit) {
  exit(run(opts))
}

/**
 * @param {() => boolean} [entry]
 * @param {() => unknown} [invoke]
 */
export function startCli(entry = isCliEntry, invoke = main) {
  if (entry()) invoke()
}

startCli()
