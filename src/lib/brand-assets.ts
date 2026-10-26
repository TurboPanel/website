/**
 * Canonical TurboPanel logo download paths under `/public/brand/`.
 * Keep filenames in sync with files on disk — the /about/logo page lists these.
 */

import { TURBOPANEL_WORDMARK_STYLE } from '@/lib/wordmark-lockup'

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

export type BrandFontAsset = Readonly<{
  label: string
  href: string
  format: 'WOFF2' | 'TTF' | 'TXT'
}>

/** The wordmark face: “urboPanel” under the T is set in this font. */
export const BRAND_WORDMARK_FONT = {
  family: 'Exo 2',
  styleName: 'Black Italic',
  weight: 900,
  /** CSS skew added to the font's own 8° italic so the letters lean with the T stem. */
  extraSkewDeg: -Number.parseFloat(TURBOPANEL_WORDMARK_STYLE.skew),
  license: 'SIL Open Font License 1.1',
  assets: [
    {
      label: 'WOFF2 (web, Black Italic, latin)',
      href: '/brand/fonts/exo-2-latin-900-italic.woff2',
      format: 'WOFF2',
    },
    {
      label: 'TTF (variable italic, desktop and print)',
      href: '/brand/fonts/Exo2-Italic-VariableFont_wght.ttf',
      format: 'TTF',
    },
    { label: 'License (OFL 1.1)', href: '/brand/fonts/OFL-Exo-2.txt', format: 'TXT' },
  ] as ReadonlyArray<BrandFontAsset>,
} as const

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
    name: 'Blue',
    hex: '#3366CC',
    role: 'Primary brand — links, CTAs, docs chrome, T stem and bar',
    token: '--tp-blue / --tp-accent / colors.blue',
  },
  {
    name: 'Green',
    hex: '#3DD68C',
    role: 'Secondary accent — HA / live / acceleration bars',
    token: '--tp-green / colors.green',
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
