/**
 * Canonical TurboPanel logo download paths under `/public/brand/`.
 * Keep filenames in sync with files on disk — the /about/logo page lists these.
 */

export type BrandAsset = Readonly<{
  label: string
  href: string
  format: 'SVG' | 'PNG'
  note?: string
}>

export type BrandLogoVariant = Readonly<{
  id: string
  title: string
  description: string
  /** Preview image (always color SVG/PNG for recognition). */
  previewSrc: string
  previewAspect: 'landscape' | 'square'
  assets: ReadonlyArray<BrandAsset>
}>

export const BRAND_LOGO_VARIANTS: ReadonlyArray<BrandLogoVariant> = [
  {
    id: 'standard',
    title: 'TurboPanel logo',
    description: 'Standard arrangement — preferred for websites, docs, and publications.',
    previewSrc: '/brand/turbopanel-logo.svg',
    previewAspect: 'landscape',
    assets: [
      { label: 'SVG (vector, color)', href: '/brand/turbopanel-logo.svg', format: 'SVG' },
      { label: 'SVG (white / transparent)', href: '/brand/turbopanel-logo-white.svg', format: 'SVG' },
      { label: 'SVG (mono / transparent)', href: '/brand/turbopanel-logo-mono.svg', format: 'SVG' },
      { label: 'PNG 64', href: '/brand/turbopanel-logo-64.png', format: 'PNG' },
      { label: 'PNG 256', href: '/brand/turbopanel-logo-256.png', format: 'PNG' },
      { label: 'PNG 512', href: '/brand/turbopanel-logo-512.png', format: 'PNG' },
      { label: 'PNG 1024', href: '/brand/turbopanel-logo-1024.png', format: 'PNG' },
    ],
  },
  {
    id: 'square',
    title: 'TurboPanel logo — square',
    description:
      'Square canvas for avatars, app icons, and places that need a 1:1 mark.',
    previewSrc: '/brand/turbopanel-logo-square.svg',
    previewAspect: 'square',
    assets: [
      {
        label: 'SVG (vector, color)',
        href: '/brand/turbopanel-logo-square.svg',
        format: 'SVG',
      },
      {
        label: 'SVG (white / transparent)',
        href: '/brand/turbopanel-logo-square-white.svg',
        format: 'SVG',
      },
      {
        label: 'SVG (mono / transparent)',
        href: '/brand/turbopanel-logo-square-mono.svg',
        format: 'SVG',
      },
      { label: 'PNG 32', href: '/brand/turbopanel-logo-square-32.png', format: 'PNG' },
      { label: 'PNG 192', href: '/brand/turbopanel-logo-square-192.png', format: 'PNG' },
      { label: 'PNG 512', href: '/brand/turbopanel-logo-square-512.png', format: 'PNG' },
    ],
  },
] as const

export const BRAND_COLORS = [
  {
    name: 'Green',
    hex: '#3DD68C',
    role: 'Acceleration bars, HA / run accent, primary CTAs',
    token: '--tp-green / colors.green',
  },
  {
    name: 'Blue',
    hex: '#3366CC',
    role: 'T stem and bar, self-hosted / HA chrome pairing',
    token: '--tp-blue / colors.blue',
  },
  {
    name: 'Slate (mono)',
    hex: '#0F172A',
    role: 'Single-color mark on light backgrounds',
    token: 'near --tp-text (light)',
  },
  {
    name: 'White',
    hex: '#FFFFFF',
    role: 'Single-color mark on dark or photographic backgrounds',
    token: '—',
  },
] as const
