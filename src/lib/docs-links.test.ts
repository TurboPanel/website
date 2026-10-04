import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Docs link check: every `/docs/...` link in a page lands on a page that
 * exists (and, when it names a heading, on a heading that exists), and every
 * folder's `meta.json` lists only pages that exist.
 */
const DOCS = join(__dirname, '..', '..', 'docs')
/** Routes the app serves itself under /docs (not MDX pages), e.g. the API reference. */
const APP_DOCS = join(__dirname, '..', 'app', 'docs')

function mdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return mdxFiles(full)
    return entry.name.endsWith('.mdx') ? [full] : []
  })
}

function isAppRoute(rel: string): boolean {
  return rel !== '' && existsSync(join(APP_DOCS, rel.split('/')[0] ?? ''))
}

function pageFile(route: string): string | null {
  const rel = route.replace(/^\/docs\/?/, '').replace(/\/$/, '')
  if (isAppRoute(rel)) return APP_DOCS
  const candidates =
    rel === ''
      ? [join(DOCS, 'index.mdx')]
      : [join(DOCS, `${rel}.mdx`), join(DOCS, rel, 'index.mdx')]
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

/** The anchor a heading gets: lower-cased, punctuation dropped, spaces to hyphens. */
export function slug(heading: string): string {
  return heading
    .replaceAll(/`/g, '')
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replaceAll(/\s/g, '-')
}

function headingSlugs(file: string): Set<string> {
  const lines = readFileSync(file, 'utf8').split('\n')
  const slugs = lines.flatMap((line) => {
    const match = /^#{1,6}\s+(.*?)(?:\s+\[#([\w-]+)\])?\s*$/.exec(line)
    if (!match) return []
    return [match[2] ?? slug(match[1] ?? '')]
  })
  return new Set(slugs)
}

const LINK = /\]\((\/docs[^)\s]*)\)/g

function brokenLinks(): string[] {
  const broken: string[] = []
  for (const file of mdxFiles(DOCS)) {
    const text = readFileSync(file, 'utf8')
    for (const match of text.matchAll(LINK)) {
      const [route, anchor] = (match[1] ?? '').split('#')
      const target = pageFile(route ?? '')
      const where = `${relative(DOCS, file)} -> ${match[1]}`
      if (!target) broken.push(`${where} (no such page)`)
      else if (
        anchor &&
        target !== APP_DOCS &&
        !headingSlugs(target).has(anchor)
      )
        broken.push(`${where} (no such heading)`)
    }
  }
  return broken
}

function brokenMeta(): string[] {
  const broken: string[] = []
  const walk = (dir: string) => {
    const meta = join(dir, 'meta.json')
    if (existsSync(meta)) {
      const pages =
        (JSON.parse(readFileSync(meta, 'utf8')) as { pages?: string[] })
          .pages ?? []
      for (const page of pages) {
        if (
          page.startsWith('---') ||
          page.startsWith('...') ||
          page.startsWith('!')
        )
          continue
        const linked = /^\[[^\]]+\]\((\/docs[^)]*)\)$/.exec(page)
        const found = linked
          ? pageFile(linked[1] ?? '') !== null
          : existsSync(join(dir, `${page}.mdx`)) || existsSync(join(dir, page))
        if (!found) broken.push(`${relative(DOCS, meta)} lists ${page}`)
      }
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name))
    }
  }
  walk(DOCS)
  return broken
}

describe('docs links', () => {
  it('every /docs link lands on a page and heading that exist', () => {
    expect(brokenLinks()).toEqual([])
  })

  it('every meta.json lists only pages that exist', () => {
    expect(brokenMeta()).toEqual([])
  })

  it('reads real links: the scan finds docs links, and slugs follow the heading text', () => {
    const count = mdxFiles(DOCS).reduce(
      (n, file) => n + [...readFileSync(file, 'utf8').matchAll(LINK)].length,
      0,
    )
    expect(count).toBeGreaterThan(50)
    expect(slug('Past-due payment')).toBe('past-due-payment')
    expect(slug('Servers not covered')).toBe('servers-not-covered')
    expect(slug('DuckDB + Parquet schema (self-hosted)')).toBe(
      'duckdb--parquet-schema-self-hosted',
    )
    expect(pageFile('/docs/using/billing')).not.toBeNull()
    expect(pageFile('/docs/using/no-such-page')).toBeNull()
  })
})
