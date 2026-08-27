import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DOCS_SSR_INTRODUCTION_SNIPPET,
  DOCS_SSR_LAYOUT_MARKER,
  docsSsrFailureMessage,
} from '../src/lib/docs-ssr'
import {
  INTRODUCTION_HTML_REL,
  isCliEntry,
  main,
  run,
} from './check-docs-ssr.mjs'

const SCRIPT_PATH = fileURLToPath(new URL('./check-docs-ssr.mjs', import.meta.url))

const tempRoots: string[] = []

function tempRoot(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-docs-ssr-'))
  tempRoots.push(dir)
  return dir
}

function writeIntroductionHtml(rootDir: string, html: string): string {
  const htmlPath = path.join(rootDir, INTRODUCTION_HTML_REL)
  mkdirSync(path.dirname(htmlPath), { recursive: true })
  writeFileSync(htmlPath, html)
  return htmlPath
}

function okHtml(): string {
  return `<main ${DOCS_SSR_LAYOUT_MARKER}><p>${DOCS_SSR_INTRODUCTION_SNIPPET}</p></main>`
}

afterEach(() => {
  vi.restoreAllMocks()
  for (const dir of tempRoots.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

describe('isCliEntry', () => {
  it('is false under Vitest and for empty argv', () => {
    expect(isCliEntry()).toBe(false)
    expect(isCliEntry('')).toBe(false)
    expect(isCliEntry('/tmp/vitest-runner')).toBe(false)
  })

  it('is true when argv points at this script', () => {
    expect(isCliEntry(SCRIPT_PATH)).toBe(true)
  })
})

describe('run', () => {
  it('returns 1 and explains a missing build', () => {
    const error = vi.fn()
    const rootDir = tempRoot()
    expect(run({ root: rootDir, error })).toBe(1)
    expect(error).toHaveBeenCalledWith(
      `check-docs-ssr: missing ${INTRODUCTION_HTML_REL} — run \`pnpm build\` first`,
    )
  })

  it('returns 1 when evaluateDocsSsrHtml rejects the HTML', () => {
    const error = vi.fn()
    const rootDir = tempRoot()
    writeIntroductionHtml(rootDir, '<html><p>client shell only</p></html>')
    expect(run({ root: rootDir, error })).toBe(1)
    expect(error).toHaveBeenCalledWith(docsSsrFailureMessage('missing_body'))
  })

  it('returns 0 and logs success for valid introduction HTML', () => {
    const log = vi.fn()
    const rootDir = tempRoot()
    writeIntroductionHtml(rootDir, okHtml())
    expect(run({ root: rootDir, log })).toBe(0)
    expect(log).toHaveBeenCalledWith(
      'check-docs-ssr: introduction HTML includes server-rendered docs content',
    )
  })

  it('uses injected existsSync / readFileSync', () => {
    const error = vi.fn()
    const existsSync = vi.fn((_target: string) => false)
    const readFileSync = vi.fn((_target: string, _encoding: string) => {
      throw new TypeError('readFileSync should not run when the build is missing')
    })
    expect(run({ existsSync, readFileSync, error })).toBe(1)
    expect(existsSync).toHaveBeenCalledOnce()
    const checked = existsSync.mock.calls[0]?.[0]
    if (typeof checked !== 'string') {
      throw new TypeError('existsSync path must be a string')
    }
    expect(checked.endsWith(INTRODUCTION_HTML_REL)).toBe(true)
    expect(readFileSync).not.toHaveBeenCalled()
  })

  it('reads injected HTML on the success path', () => {
    const log = vi.fn()
    const htmlPath = path.join('/virtual', INTRODUCTION_HTML_REL)
    const existsSync = vi.fn((candidate: string) => candidate === htmlPath)
    const readFileSync = vi.fn((_target: string, _encoding: string) => okHtml())
    expect(
      run({
        root: '/virtual',
        existsSync,
        readFileSync,
        log,
      }),
    ).toBe(0)
    expect(readFileSync).toHaveBeenCalledWith(htmlPath, 'utf8')
    expect(log).toHaveBeenCalledOnce()
  })
})

describe('main', () => {
  it('forwards a failure status to process.exit', () => {
    const exit = vi.fn()
    const error = vi.fn()
    main({ root: tempRoot(), error }, exit)
    expect(exit).toHaveBeenCalledWith(1)
  })

  it('forwards a success status to process.exit', () => {
    const exit = vi.fn()
    const log = vi.fn()
    const rootDir = tempRoot()
    writeIntroductionHtml(rootDir, okHtml())
    main({ root: rootDir, log }, exit)
    expect(exit).toHaveBeenCalledWith(0)
  })
})
