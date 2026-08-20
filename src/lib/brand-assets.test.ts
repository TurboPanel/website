import { describe, expect, it } from 'vitest'
import { BRAND_COLORS, BRAND_LOGO_VARIANTS } from '@/lib/brand-assets'

describe('BRAND_LOGO_VARIANTS', () => {
  it('lists downloadable assets for each logo variant', () => {
    expect(BRAND_LOGO_VARIANTS.length).toBeGreaterThanOrEqual(2)
    for (const variant of BRAND_LOGO_VARIANTS) {
      expect(variant.assets.length).toBeGreaterThan(0)
      for (const asset of variant.assets) {
        expect(asset.href.startsWith('/brand/')).toBe(true)
      }
    }
  })
})

describe('BRAND_COLORS', () => {
  it('documents the primary brand palette tokens', () => {
    const names = BRAND_COLORS.map((entry) => entry.name)
    expect(names).toContain('Blue')
    expect(names).toContain('Green')
  })
})
