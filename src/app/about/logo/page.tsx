import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'
import { BRAND_COLORS, BRAND_LOGO_VARIANTS, BRAND_WORDMARK_FONT } from '@/lib/brand-assets'
import { TURBOPANEL_WORDMARK_STYLE, websiteWordmarkLockup } from '@/lib/wordmark-lockup'

/** The header lockup's geometry; the previews enlarge exactly this box. */
const FULL_LOCKUP = websiteWordmarkLockup(false)

export const metadata: Metadata = {
  title: 'Graphics & Logos',
  description:
    'Official TurboPanel logo, wordmark and wordmark font (Figtree, with its license) downloads and usage guidelines for websites, publications, and product UI.',
}

const DO_NOT = [
  'Do not stretch, skew, or rotate the mark.',
  'Do not recolor the dual-brand mark except by using the provided white or mono variants.',
  'Do not add outlines, drop shadows, gradients, or glow effects to the mark.',
  'Do not place the color mark on busy photography without a clear solid or soft backing.',
  'Do not lock up the mark with other logos closer than the clear-space rule below.',
  'Do not set the full word “TurboPanel” next to the T mark — the mark is the T; visible wordmark letters are “urboPanel”.',
  'Do not use outdated “TP” letter tiles as the product logo.',
] as const

/** The real header lockup, enlarged with a transform so its geometry is untouched. */
function WordmarkTile({
  label,
  background,
  ink,
}: Readonly<{ label: string; background: string; ink: string }>) {
  return (
    <figure
      className="flex min-h-[14rem] flex-col justify-between gap-6 overflow-hidden rounded-xl border border-[var(--tp-border)] p-6"
      style={{ background, '--tp-wordmark-ink': ink } as CSSProperties}
    >
      <figcaption
        className="text-xs font-semibold uppercase tracking-[0.12em]"
        style={{ color: ink, opacity: 0.6 }}
      >
        {label}
      </figcaption>
      <div className="flex flex-1 items-center justify-center">
        <span
          role="img"
          aria-label={`TurboPanel wordmark on ${label.toLowerCase()}`}
          className="relative inline-block [--s:1.25] min-[400px]:[--s:1.5] sm:[--s:2.5] md:[--s:3] lg:[--s:4]"
          style={{
            width: `calc(var(--s) * ${FULL_LOCKUP.lockupWidth}px)`,
            height: `calc(var(--s) * ${FULL_LOCKUP.lockupHeight}px)`,
          }}
        >
          <span
            className="absolute left-0 top-0 block origin-top-left"
            style={{ transform: 'scale(var(--s))' }}
          >
            <Logo />
          </span>
        </span>
      </div>
    </figure>
  )
}

function WordmarkSpec({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <>
      <dt className="text-[var(--tp-text-muted)]">{label}</dt>
      <dd className="text-[var(--tp-text)]">{children}</dd>
    </>
  )
}

function DownloadLink({ href, children }: Readonly<{ href: string; children: ReactNode }>) {
  return (
    <Link
      href={href}
      download
      className="inline-flex items-center rounded-md border border-[var(--tp-border)] bg-[var(--tp-surface)] px-2.5 py-1.5 text-sm text-[var(--tp-text)] transition-colors hover:border-[var(--tp-accent)] hover:text-[var(--tp-text)]"
    >
      {children}
    </Link>
  )
}

function LogoVariantBlock({
  variant,
}: Readonly<{ variant: (typeof BRAND_LOGO_VARIANTS)[number] }>) {
  const previewBox =
    variant.previewAspect === 'square'
      ? 'aspect-square max-w-[200px]'
      : 'aspect-[628/370] max-w-[280px]'

  return (
    <article
      id={variant.id}
      className="border-t border-[var(--tp-border)] pt-10 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--tp-text)]">
            {variant.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
            {variant.description}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {variant.assets.map((asset) => (
              <li key={asset.href}>
                <DownloadLink href={asset.href}>{asset.label}</DownloadLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-4">
          <div
            className={`flex w-full items-center justify-center rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-8 ${previewBox}`}
          >
            <img src={variant.previewSrc} alt="" className="h-full w-full object-contain" />
          </div>
          <div
            className={`flex w-full items-center justify-center rounded-xl border border-[var(--tp-border)] bg-[#0b1220] p-8 ${previewBox}`}
          >
            <img
              src={
                variant.id === 'square'
                  ? '/brand/turbopanel-logo-square-white.svg'
                  : '/brand/turbopanel-logo-white.svg'
              }
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AboutLogoPage() {
  return (
    <MarketingPageShell active="overview">
      <MarketingHero
        eyebrow="Brand"
        title="Graphics & Logos"
        description="When you need the official TurboPanel logo for a website or publication, use one of the downloads below. Please use logos in accordance with these guidelines."
      />

      <MarketingSection id="downloads">
        <MarketingSectionHeader
          eyebrow="Downloads"
          title="TurboPanel logos"
          description="Vector SVG is preferred. PNG sizes are provided for places that need a raster file. White and mono SVGs are for dark and single-color contexts."
        />
        <div className="space-y-10">
          {BRAND_LOGO_VARIANTS.map((variant) => (
            <LogoVariantBlock key={variant.id} variant={variant} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="wordmark">
        <MarketingSectionHeader
          eyebrow="Wordmark"
          title="The T and the word"
          description="The T is always the SVG mark. The letters that continue it are live text, set so the word starts at the T’s stem and its lowest point sits on the base of the T."
        />
        <div className="grid gap-4">
          <WordmarkTile label="On light" background="#f5f7fa" ink={BRAND_WORDMARK_FONT.inkLight} />
          <WordmarkTile label="On dark" background="#0b1220" ink={BRAND_WORDMARK_FONT.inkDark} />
        </div>
        <p className="mt-3 text-sm text-[var(--tp-text-muted)]">
          Shown enlarged. It is the same lockup the site header uses, so the proportions never
          change.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <article
            id="font"
            className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
              Typeface
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--tp-text)]">
              {BRAND_WORDMARK_FONT.family} {BRAND_WORDMARK_FONT.styleName}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
              Figtree is an open-source geometric sans-serif designed by{' '}
              {BRAND_WORDMARK_FONT.designer}. It has true italics, so the slant is drawn by the
              designer rather than faked by skewing an upright face. TurboPanel uses the ExtraBold
              cut.
            </p>
            <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
              <WordmarkSpec label="Weight">{BRAND_WORDMARK_FONT.weight} (ExtraBold)</WordmarkSpec>
              <WordmarkSpec label="Lean">
                The font’s own {BRAND_WORDMARK_FONT.italicAngleDeg}° italic plus{' '}
                {BRAND_WORDMARK_FONT.extraSkewDeg}°, just past the T’s 22° stem
              </WordmarkSpec>
              <WordmarkSpec label="Letter spacing">
                +{TURBOPANEL_WORDMARK_STYLE.letterSpacingEm} em
              </WordmarkSpec>
              <WordmarkSpec label="Position">
                First letter against the T’s stem, lowest point of the letters on the base of the T
              </WordmarkSpec>
              <WordmarkSpec label="Text color">
                <span className="font-mono">{BRAND_WORDMARK_FONT.inkLight}</span> on light,{' '}
                <span className="font-mono">{BRAND_WORDMARK_FONT.inkDark}</span> on dark
              </WordmarkSpec>
              <WordmarkSpec label="Designer">
                <a
                  href={BRAND_WORDMARK_FONT.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--tp-accent)] hover:underline"
                >
                  {BRAND_WORDMARK_FONT.designer}
                </a>
              </WordmarkSpec>
            </dl>
          </article>

          <article
            id="font-license"
            className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
              Font license
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--tp-text)]">
              {BRAND_WORDMARK_FONT.license}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
              {BRAND_WORDMARK_FONT.copyright}. You may use, embed, study and share the font,
              including in print and commercial work. Keep the copyright notice and license text
              with any copy you share, keep modified versions under the same license, and do not
              sell the font on its own. This is a summary; the license text is what applies.
              TurboPanel’s trademark covers the lockup, not the typeface.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li>
                <a
                  href={BRAND_WORDMARK_FONT.licenseFileHref}
                  className="text-[var(--tp-accent)] hover:underline"
                >
                  Read the license text
                </a>
              </li>
              <li>
                <a
                  href={BRAND_WORDMARK_FONT.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--tp-accent)] hover:underline"
                >
                  SIL Open Font License home page, with the FAQ
                </a>
              </li>
              <li>
                <a
                  href={BRAND_WORDMARK_FONT.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--tp-accent)] hover:underline"
                >
                  Figtree project
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
              Font files
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {BRAND_WORDMARK_FONT.assets.map((asset) => (
                <li key={asset.href}>
                  <DownloadLink href={asset.href}>{asset.label}</DownloadLink>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </MarketingSection>

      <MarketingSection id="colors" variant="band">
        <MarketingSectionHeader
          eyebrow="Color"
          title="Brand colors"
          description="The mark pairs TurboPanel green (acceleration) with blue (the T). Keep both when using the color logo."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {BRAND_COLORS.map((color) => (
            <li
              key={color.hex}
              className="flex gap-4 rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-4"
            >
              <span
                className="h-14 w-14 shrink-0 rounded-lg border border-[var(--tp-border)]"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <div>
                <p className="font-semibold text-[var(--tp-text)]">{color.name}</p>
                <p className="mt-0.5 font-mono text-sm text-[var(--tp-text-muted)]">{color.hex}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
                  {color.role}
                </p>
                <p className="mt-1 font-mono text-xs text-[var(--tp-text-muted)]">{color.token}</p>
              </div>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="usage">
        <MarketingSectionHeader
          eyebrow="Usage"
          title="Clear space & sizing"
          description="Give the mark room to breathe and keep it legible at small sizes."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-[var(--tp-text)]">Clear space</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
              Downloadable SVGs are ink-tight (no embedded pad). Keep empty space around the mark at
              least as tall as the green acceleration bars — apply that margin in layout, not by
              editing the file. Do not let other logos, type, or UI chrome collide with that margin.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--tp-text)]">Minimum size</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
              Standard mark: at least <span className="font-mono">24px</span> tall on screen,{' '}
              <span className="font-mono">0.5&quot;</span> in print. Square mark: at least{' '}
              <span className="font-mono">24×24px</span> on screen. Prefer SVG whenever possible.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-base font-semibold text-[var(--tp-text)]">Wordmark</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
            In prose the product name is one word with a capital T and P:{' '}
            <strong className="font-semibold text-[var(--tp-text)]">TurboPanel</strong> — never
            “Turbo Panel”, “turboPanel”, or “TP Panel”. In site chrome, the T mark supplies the
            leading T and the wordmark above continues it, tucked under the blue crossbar. Never
            render “TurboPanel” beside the mark. The mark may appear alone when space is tight.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection id="do-not" variant="muted">
        <MarketingSectionHeader
          eyebrow="Don't"
          title="Incorrect use"
          description="These patterns weaken recognition and break the dual-brand system."
        />
        <ul className="space-y-3">
          {DO_NOT.map((rule) => (
            <li
              key={rule}
              className="flex gap-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-text-muted)]"
                aria-hidden
              />
              {rule}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--tp-text-muted)]">
          Open-source licenses do not grant trademark rights. Questions about trademark use or
          partnership lockups can go through the usual TurboPanel contact channels. Policy:{' '}
          <Link href="/open-source" className="text-[var(--tp-accent)] hover:underline">
            Open source
          </Link>
          . Product UI tokens stay in <span className="font-mono">ui/src/lib/theme.ts</span>;
          marketing tokens in <span className="font-mono">website/src/app/globals.css</span>.
        </p>
      </MarketingSection>
    </MarketingPageShell>
  )
}
