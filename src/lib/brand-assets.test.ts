import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  BRAND_COLORS,
  BRAND_LOGO_VARIANTS,
  BRAND_WORDMARK_FONT,
} from '@/lib/brand-assets'

describe('BRAND_WORDMARK_FONT', () => {
  it('describes the self-hosted Figtree ExtraBold Italic wordmark face', () => {
    expect(BRAND_WORDMARK_FONT.family).toBe('Figtree')
    expect(BRAND_WORDMARK_FONT.weight).toBe(800)
    expect(BRAND_WORDMARK_FONT.italicAngleDeg).toBe(9.5)
    expect(BRAND_WORDMARK_FONT.extraSkewDeg).toBe(14)
    expect(BRAND_WORDMARK_FONT.designer).toBe('Erik D. Kennedy')
    expect(BRAND_WORDMARK_FONT.license).toBe('SIL Open Font License 1.1')
    expect(BRAND_WORDMARK_FONT.licenseUrl.startsWith('https://')).toBe(true)
    expect(BRAND_WORDMARK_FONT.sourceUrl.startsWith('https://')).toBe(true)
    expect(BRAND_WORDMARK_FONT.inkLight).toBe('#0f172a')
    expect(BRAND_WORDMARK_FONT.inkDark).toBe('#ffffff')
    const formats = BRAND_WORDMARK_FONT.assets.map((asset) => asset.format)
    expect(formats).toEqual(['WOFF2', 'TTF', 'TXT'])
  })

  it('hosts the license file the page links to', () => {
    expect(BRAND_WORDMARK_FONT.assets.map((asset) => asset.href)).toContain(
      BRAND_WORDMARK_FONT.licenseFileHref,
    )
  })

  it('links only to font files that ship under public/brand/fonts', () => {
    for (const asset of BRAND_WORDMARK_FONT.assets) {
      expect(asset.href.startsWith('/brand/fonts/')).toBe(true)
      expect(existsSync(path.join(process.cwd(), 'public', asset.href))).toBe(
        true,
      )
    }
  })
})

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
    const byId = new Map(
      BRAND_LOGO_VARIANTS.map((variant) => [variant.id, variant]),
    )
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
