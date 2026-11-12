import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  diffDir,
  main,
  mdxText,
  parseGroups,
  renderAll,
  renderGroupPage,
  titleCase,
} from './sync-schema-docs.mjs'

const GROUPS = [
  {
    key: 'alpha',
    title: 'Servers, runtime and metrics',
    blurb: 'First group.',
    tables: [
      {
        name: 'thing',
        summary: 'One thing.',
        columns: [
          { name: 'id', type: 'uuid', notNull: true, text: 'Primary key.' },
          { name: 'note', type: 'text', notNull: false, text: 'A | pipe <b> {x} `<ok>`' },
        ],
      },
      { name: 'bare', summary: '', columns: [] },
    ],
  },
  { key: 'beta', title: 'Solo', blurb: 'Second.', tables: [] },
]

let dir: string
let out: string[]
let err: string[]
const io = () => ({
  dir,
  readStdin: () => '[]',
  log: (line: string) => out.push(line),
  error: (line: string) => err.push(line),
})

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'schema-sync-'))
  out = []
  err = []
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('sync-schema-docs', () => {
  it('title-cases group titles and keeps small words', () => {
    expect(titleCase('Servers, runtime and metrics')).toBe('Servers, Runtime and Metrics')
    expect(titleCase('the git')).toBe('The Git')
  })

  it('escapes MDX and table characters outside code spans only', () => {
    expect(mdxText('a | b <c> {d}\n`<e>|`')).toBe('a \\| b \\<c\\> \\{d\\} `<e>\\|`')
  })

  it('validates the input shape', () => {
    expect(parseGroups(JSON.stringify(GROUPS))).toHaveLength(2)
    expect(() => parseGroups('[]')).toThrow(TypeError)
    expect(() => parseGroups('[{"key":"A"}]')).toThrow(TypeError)
    expect(() => parseGroups('{"a":1}')).toThrow(TypeError)
  })

  it('renders a group page with a section per table', () => {
    const page = renderGroupPage(GROUPS[0])
    expect(page).toContain('title: "Servers, Runtime and Metrics"')
    expect(page).toContain('2 tables and 2 columns')
    expect(page).toContain('## `thing` [#thing]')
    expect(page).toContain('| `id` | `uuid` | yes | Primary key. |')
    expect(page).toContain('| `note` | `text` | no | A \\| pipe \\<b\\> \\{x\\} `<ok>` |')
    expect(renderGroupPage(GROUPS[1])).toContain('0 tables and 0 columns')
    expect(renderGroupPage({ ...GROUPS[1], tables: [GROUPS[0].tables[0]] })).toContain(
      '1 table and'
    )
  })

  it('renders index, meta and one page per group', () => {
    const files = renderAll(GROUPS)
    expect(Object.keys(files).sort()).toEqual(['alpha.mdx', 'beta.mdx', 'index.mdx', 'meta.json'])
    expect(files['index.mdx']).toContain('2 tables and 2 columns, in 2 groups')
    expect(files['index.mdx']).toContain('[Solo](/docs/database/beta)')
    expect(JSON.parse(files['meta.json'])).toEqual({
      title: 'Database',
      pages: ['index', 'alpha', 'beta'],
    })
  })

  it('writes, checks and removes stale pages', () => {
    const input = path.join(tmpdir(), `schema-in-${process.pid}.json`)
    writeFileSync(input, JSON.stringify(GROUPS))
    try {
      expect(main(['--check', input], io())).toBe(1)
      expect(err[0]).toContain('out of date')
      writeFileSync(path.join(dir, 'old.mdx'), 'stale')
      expect(main([input], io())).toBe(0)
      expect(main([input], io())).toBe(0)
      expect(diffDir(dir, renderAll(GROUPS))).toEqual([])
      expect(() => readFileSync(path.join(dir, 'old.mdx'))).toThrow()
      expect(main(['--check', input], io())).toBe(0)
      writeFileSync(path.join(dir, 'alpha.mdx'), 'edited')
      writeFileSync(path.join(dir, 'extra.mdx'), 'extra')
      expect(diffDir(dir, renderAll(GROUPS))).toEqual(['alpha.mdx', 'extra.mdx'])
    } finally {
      rmSync(input, { force: true })
    }
  })

  it('reads standard input and reports bad input', () => {
    expect(main([], { ...io(), readStdin: () => JSON.stringify(GROUPS) })).toBe(0)
    expect(main([], { ...io(), readStdin: () => '[]' })).toBe(1)
    expect(err.at(-1)).toContain('not the schema-docs JSON')
    expect(
      main(['--check'], {
        ...io(),
        dir: path.join(dir, 'missing'),
        readStdin: () => JSON.stringify(GROUPS),
      })
    ).toBe(1)
  })
})
