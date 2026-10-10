import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const DOCS = join(__dirname, '..', '..', 'docs')

function readDoc(...parts: string[]): string {
  return readFileSync(join(DOCS, ...parts), 'utf8')
}

describe('invitation access docs (no default organization manager grant)', () => {
  const access = readDoc('using', 'access.mdx')
  const index = readDoc('using', 'index.mdx')
  const accounts = readDoc('getting-started', 'accounts-and-access.mdx')

  it('access.mdx does not describe a default manager grant on accept', () => {
    expect(access).not.toMatch(/by default, an \*\*organization manager\*\* grant/i)
    expect(access).not.toMatch(/Default invitation grant/i)
    expect(access).not.toMatch(/default grant an invitation gives/i)
  })

  it('access.mdx documents team-only console invites and explicit grants', () => {
    expect(access).toMatch(/no grants/i)
    expect(access).toMatch(/grants_require_owner/)
    expect(access).toMatch(/Invalid invitation grants/)
    expect(access).toMatch(/empty `grants: \[\]`/i)
    expect(access).toMatch(/grants` is an empty array/i)
  })

  it('using index and accounts-and-access align with membership without implicit manage', () => {
    expect(index).not.toMatch(/default grant an invitation gives/i)
    expect(index).toMatch(/team membership only/i)
    expect(accounts).not.toMatch(/organization access follows from team membership/i)
    expect(accounts).toMatch(/does not grant \*\*Manage\*\*/i)
  })
})
