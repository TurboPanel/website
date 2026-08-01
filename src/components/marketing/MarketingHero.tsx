import type { ReactNode } from 'react'
import {
  MarketingPrimaryCta,
  MarketingSecondaryCta,
} from '@/components/marketing/MarketingPrimaryCta'
import { CheckIcon, TerminalPreview } from '@/components/marketing/marketing-primitives'

type HeroAction = Readonly<{
  href: string
  label: string
}>

type MarketingHeroProps = Readonly<{
  eyebrow: string
  title: string
  description: string
  gradientClassName?: string
  /**
   * Solid page background under the hero wash so the marketing canvas grid
   * does not show through the first viewport.
   */
  plainBackground?: boolean
  /** Optional commercial line above the CTA (omit during private early access). */
  priceLine?: string
  /** Up to three short benefit lines — keep plain-language, not jargon. */
  benefits?: ReadonlyArray<string>
  /** Emphasized primary CTA — at most one pulsing CTA per page. */
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Show static fleet terminal on large viewports. */
  showTerminal?: boolean
  /** Custom aside (wins over terminal when both are set). */
  aside?: ReactNode
  children?: ReactNode
}>

const DEFAULT_GRADIENT =
  'bg-[radial-gradient(920px_circle_at_8%_-15%,var(--tp-hero-a),transparent_52%),radial-gradient(680px_circle_at_95%_0%,var(--tp-hero-b),transparent_55%)]'

export function MarketingHero({
  eyebrow,
  title,
  description,
  gradientClassName = DEFAULT_GRADIENT,
  plainBackground = false,
  priceLine,
  benefits,
  primaryAction,
  secondaryAction,
  showTerminal = false,
  aside,
  children,
}: MarketingHeroProps) {
  const hasActions = Boolean(primaryAction || secondaryAction)
  const right = aside ?? (showTerminal ? <TerminalPreview /> : null)
  const wide = Boolean(right)
  const benefitItems = benefits?.slice(0, 3) ?? []

  return (
    <section
      className={`relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 ${
        plainBackground ? 'bg-[var(--tp-bg)]' : ''
      }`}
    >
      <div className={`pointer-events-none absolute inset-0 -z-10 ${gradientClassName}`} />
      <div
        className={`mx-auto grid w-full max-w-6xl gap-10 ${
          wide ? 'lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14' : ''
        }`}
      >
        <div className={wide ? '' : 'max-w-3xl'}>
          <p className="tp-eyebrow">{eyebrow}</p>
          <h1 className="tp-display mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--tp-text)] sm:text-5xl lg:text-[3.35rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--tp-text-muted)] sm:text-xl">
            {description}
          </p>
          {benefitItems.length > 0 ? (
            <ul className="mt-6 max-w-xl space-y-2.5">
              {benefitItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-base leading-snug text-[var(--tp-text)] sm:text-[17px]"
                >
                  <CheckIcon className="mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {priceLine ? (
            <p className="mt-7 font-mono text-sm font-medium tracking-tight text-[var(--tp-text)] sm:text-base">
              <span className="text-[var(--tp-accent)]">{priceLine}</span>
            </p>
          ) : null}
          {hasActions ? (
            <div className={`flex flex-wrap gap-3 ${priceLine ? 'mt-4' : 'mt-8'}`}>
              {primaryAction ? (
                <MarketingPrimaryCta href={primaryAction.href} emphasis>
                  {primaryAction.label}
                </MarketingPrimaryCta>
              ) : null}
              {secondaryAction ? (
                <MarketingSecondaryCta href={secondaryAction.href}>
                  {secondaryAction.label}
                </MarketingSecondaryCta>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
        {right ? <div className="hidden min-w-0 lg:block">{right}</div> : null}
      </div>
    </section>
  )
}
