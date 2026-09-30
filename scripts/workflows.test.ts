import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Shape rules for .github/workflows: a red X on a pull request only ever
// means "this change is broken", every workflow says what its token may do,
// and every workflow reads as a title in the Actions list.

const WORKFLOWS = fileURLToPath(new URL('../.github/workflows/', import.meta.url))
const files = readdirSync(WORKFLOWS).filter((name) => name.endsWith('.yml'))
const read = (name: string) => readFileSync(path.join(WORKFLOWS, name), 'utf8')

// Words that stay lower case inside a Title Case name.
const SMALL_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'by'])

function isTitleCase(name: string): boolean {
  return name.split(/\s+/).every((word, index) => {
    const bare = word.replace(/^\(/, '')
    if (index > 0 && SMALL_WORDS.has(bare)) return true
    return !/^[a-z]/.test(bare)
  })
}

describe('isTitleCase', () => {
  it('accepts titles and small words after the first', () => {
    expect(isTitleCase('Keep the RC PR Open')).toBe(true)
    expect(isTitleCase('Promote (Prepare)')).toBe(true)
  })

  it('refuses a lower-case word or a lower-case first word', () => {
    expect(isTitleCase('Publish rc')).toBe(false)
    expect(isTitleCase('Promote (prepare)')).toBe(false)
    expect(isTitleCase('the Next Version')).toBe(false)
  })
})

describe('.github/workflows', () => {
  it('has workflows to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s declares top-level permissions', (file) => {
    expect(read(file)).toMatch(/^permissions:/m)
  })

  it.each(files)('%s has a Title Case name', (file) => {
    const name = /^name: (.+)$/m.exec(read(file))?.[1]
    expect(name, `${file} has no top-level name`).toBeDefined()
    expect(isTitleCase(name ?? ''), `${file}: "${name}"`).toBe(true)
  })

  // Another repo's staging/live move on that repo's own release schedule, so
  // a comparison against them would go red for reasons outside this change.
  it.each(files)('%s checks sibling repositories out at trunk or a pinned commit', (file) => {
    const blocks = read(file).split(/\n\s*- name: /)
    for (const block of blocks) {
      const repo = /repository: (TurboPanel\/[\w-]+)/.exec(block)?.[1]
      if (!repo) continue
      const ref = /\n\s+ref: (\S+)/.exec(block)?.[1]
      expect(ref, `${file}: ${repo} checkout has no ref`).toBeDefined()
      expect(ref, `${file}: ${repo} at ${ref}`).toMatch(/^(trunk|[\da-f]{40})$/)
    }
  })

  it('ci-ok is red on a cancelled pull request but not on a cancelled push', () => {
    const text = read('verify.yml')
    expect(text).toMatch(
      /^ {2}ci-ok:\n {4}name: ci-ok\n {4}needs: \[[^\]]+\]\n {4}if: \$\{\{ \(github\.event_name == 'pull_request' && always\(\)\) \|\| \(!cancelled\(\) && !contains\(needs\.\*\.result, 'cancelled'\)\) \}\}$/m,
    )
    expect(text).not.toMatch(/^ {4}if: always\(\)$/m)
  })
})
