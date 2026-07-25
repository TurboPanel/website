import type { ReactNode } from 'react'
import {
  MarketingPrimaryCta,
  MarketingSecondaryCta,
} from '@/components/marketing/MarketingPrimaryCta'
import { TerminalPreview } from '@/components/marketing/marketing-primitives'

type HeroAction = Readonly<{
  href: string
  label: string
}>

type MarketingHeroProps = Readonly<{
  eyebrow: string
  title: string
  description: string
  gradientClassName?: string
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
  primaryAction,
  secondaryAction,
  showTerminal = false,
  aside,
  children,
}: MarketingHeroProps) {
  const hasActions = Boolean(primaryAction || secondaryAction)
  const right = aside ?? (showTerminal ? <TerminalPreview /> : null)
  const wide = Boolean(right)

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
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
          {hasActions ? (
            <div className="mt-8 flex flex-wrap gap-3">
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
