import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  LICENSE_TIER_CLEAR_SHEET_TITLE,
  LICENSE_TIER_CONFIRM_SHEET_TITLE,
  LICENSE_TIER_PUT_FORBIDDEN,
  LICENSE_TIER_PUT_REFUSALS,
} from './license-tier-pick-contract'

const DOCS = join(__dirname, '..', '..', 'docs')
const PRICING_PAGE = join(__dirname, '..', 'app', 'pricing', 'page.tsx')

function readDoc(...parts: string[]): string {
  return readFileSync(join(DOCS, ...parts), 'utf8')
}

function tableRow(doc: string, code: string): string | undefined {
  const line = doc
    .split('\n')
    .find((row) => row.includes(`\`${code}\``) && row.includes('|'))
  return line
}

describe('license tier pick docs (PR #150 review contract)', () => {
  const tiers = readDoc('deployment', 'tiers.mdx')
  const billing = readDoc('using', 'billing.mdx')
  const servers = readDoc('using', 'servers.mdx')
  const errors = readDoc('using', 'reference', 'errors.mdx')
  const pricing = readFileSync(PRICING_PAGE, 'utf8')

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

  it('billing.mdx and errors.mdx list PUT license-tier refusals with control-plane statuses', () => {
    for (const { code, status } of LICENSE_TIER_PUT_REFUSALS) {
      const billingRow = tableRow(billing, code)
      const errorsRow = tableRow(errors, code)
      expect(billingRow, `billing missing ${code}`).toBeDefined()
      expect(errorsRow, `errors missing ${code}`).toBeDefined()
      expect(billingRow).toContain(String(status))
      expect(errorsRow).toContain(String(status))
    }
  })

  it('billing.mdx and errors.mdx document owner-only Forbidden (403)', () => {
    const { error, status } = LICENSE_TIER_PUT_FORBIDDEN
    expect(billing).toMatch(new RegExp(`\`${error}\`.*${status}|${status}.*\`${error}\``))
    expect(errors).toMatch(new RegExp(`\`${error}\`.*${status}|${status}.*\`${error}\``))
    expect(tableRow(billing, error)).toContain(String(status))
    expect(tableRow(errors, error)).toContain(String(status))
  })

  it('servers.mdx documents License tier UI labels from the product console', () => {
    expect(servers).toMatch(/License tier/i)
    expect(servers).toContain(LICENSE_TIER_CONFIRM_SHEET_TITLE)
    expect(servers).toContain(LICENSE_TIER_CLEAR_SHEET_TITLE)
    expect(servers).toMatch(/Buy one/i)
    expect(servers).toMatch(/Use the smallest that fits/i)
    expect(servers).toMatch(/organization owner/i)
    expect(servers).not.toMatch(/same sheet for \*\*Use the smallest that fits\*\*/i)
  })

  it('/pricing placement copy matches tiers docs (default bind order + owner pick)', () => {
    expect(pricing).toMatch(/smallest purchased tier that fits/i)
    expect(pricing).toMatch(/bind order/i)
    expect(pricing).toMatch(/organization owners can pick/i)
    expect(pricing).toMatch(/at or above what the hardware requires/i)
  })
})
