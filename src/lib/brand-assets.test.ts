import { describe, expect, it } from 'vitest'
import { BRAND_COLORS, BRAND_LOGO_VARIANTS } from '@/lib/brand-assets'

describe('BRAND_LOGO_VARIANTS', () => {
  it('lists downloadable assets for each logo variant', () => {
    expect(BRAND_LOGO_VARIANTS.length).toBeGreaterThanOrEqual(2)
    const ids = BRAND_LOGO_VARIANTS.map((variant) => variant.id)
    expect(new Set(ids).size).toBe(ids.length)

    const hrefs: string[] = []
    for (const variant of BRAND_LOGO_VARIANTS) {
      expect(variant.previewSrc.startsWith('/brand/')).toBe(true)
      expect(['landscape', 'square']).toContain(variant.previewAspect)
      expect(variant.assets.length).toBeGreaterThan(0)
      for (const asset of variant.assets) {
        expect(asset.href.startsWith('/brand/')).toBe(true)
        expect(['SVG', 'PNG']).toContain(asset.format)
        hrefs.push(asset.href)
      }
    }
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})

describe('BRAND_COLORS', () => {
  it('documents the primary brand palette tokens', () => {
    const names = BRAND_COLORS.map((entry) => entry.name)
    expect(names).toContain('Blue')
    expect(names).toContain('Green')
    for (const entry of BRAND_COLORS) {
      expect(entry.hex).toMatch(/^#[0-9A-F]{6}$/)
      expect(entry.role.length).toBeGreaterThan(0)
    }
  })
})
