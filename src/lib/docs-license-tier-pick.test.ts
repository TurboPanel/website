import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const DOCS = join(__dirname, '..', '..', 'docs')

function readDoc(...parts: string[]): string {
  return readFileSync(join(DOCS, ...parts), 'utf8')
}

describe('license tier pick docs (PR #150 review contract)', () => {
  const tiers = readDoc('deployment', 'tiers.mdx')
  const billing = readDoc('using', 'billing.mdx')
  const servers = readDoc('using', 'servers.mdx')
  const errors = readDoc('using', 'reference', 'errors.mdx')

  it('tiers.mdx allows owner picks and describes preferred-tier assignment', () => {
    expect(tiers).not.toMatch(/nobody assigns a tier/i)
    expect(tiers).not.toMatch(/by hand/i)
    expect(tiers).toMatch(/owner/i)
    expect(tiers).toMatch(/preferred|picked/i)
    expect(tiers).toMatch(/wanted, none free/i)
  })

  it('tiers.mdx documents license-tier UI without “higher rung only”', () => {
    expect(tiers).not.toMatch(/pick a higher rung/i)
    expect(tiers).toMatch(/at or above.*required/i)
  })

  it('billing.mdx frontmatter and intro match billed quantities and owner picks', () => {
    expect(billing).not.toMatch(/moving a license up or down the ladder/i)
    expect(billing).not.toMatch(
      /which license it gets is decided by the platform;/i,
    )
    expect(billing).toMatch(/owner/i)
    expect(billing).toMatch(/at or above/i)
  })

  it('billing.mdx lists PUT license-tier refusal codes', () => {
    expect(billing).toMatch(/`tier_below_required`/)
    expect(billing).toMatch(/`invalid_body`/)
    expect(billing).toMatch(/license-tier/i)
  })

  it('servers.mdx documents the License tier pick flow on Overview', () => {
    expect(servers).toMatch(/License tier/i)
    expect(servers).toMatch(/Confirm license tier|confirm/i)
    expect(servers).toMatch(/Buy one/i)
    expect(servers).toMatch(/Use the smallest that fits/i)
    expect(servers).toMatch(/organization owner/i)
  })

  it('errors.mdx appendix includes server license-tier codes', () => {
    expect(errors).toMatch(/`tier_below_required`/)
    expect(errors).toMatch(/`invalid_body`/)
  })
})
