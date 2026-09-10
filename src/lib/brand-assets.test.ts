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
        expect(asset.note).toBeUndefined()
        hrefs.push(asset.href)
      }
    }
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('ships a landscape standard lockup and a square mark', () => {
    const byId = new Map(BRAND_LOGO_VARIANTS.map((variant) => [variant.id, variant]))
    const standard = byId.get('standard')
    const square = byId.get('square')
    if (!standard) {
      throw new TypeError('expected standard brand logo variant')
    }
    if (!square) {
      throw new TypeError('expected square brand logo variant')
    }

    expect(standard.previewAspect).toBe('landscape')
    expect(standard.previewSrc).toBe('/brand/turbopanel-logo.svg')
    expect(square.previewAspect).toBe('square')
    expect(square.previewSrc).toBe('/brand/turbopanel-logo-square.svg')

    const formats = (variant: (typeof BRAND_LOGO_VARIANTS)[number]) =>
      new Set(variant.assets.map((asset) => asset.format))
    expect(formats(standard).has('SVG')).toBe(true)
    expect(formats(standard).has('PNG')).toBe(true)
    expect(formats(square).has('SVG')).toBe(true)
    expect(formats(square).has('PNG')).toBe(true)
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
      expect(entry.token.length).toBeGreaterThan(0)
    }

    const byName = new Map(BRAND_COLORS.map((entry) => [entry.name, entry]))
    expect(byName.get('Blue')?.hex).toBe('#3366CC')
    expect(byName.get('Green')?.hex).toBe('#3DD68C')
    expect(byName.get('Slate (mono)')?.hex).toBe('#0F172A')
    expect(byName.get('White')?.hex).toBe('#FFFFFF')
  })
})
