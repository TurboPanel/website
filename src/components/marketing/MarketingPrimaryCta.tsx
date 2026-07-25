import Link from 'next/link'
import type { ReactNode } from 'react'

type MarketingCtaProps = Readonly<{
  href: string
  children: ReactNode
  className?: string
}>

const PRIMARY_BASE =
  'inline-flex cursor-pointer items-center justify-center rounded-lg bg-[var(--tp-accent)] px-6 py-3 text-sm font-semibold text-[var(--tp-accent-contrast)] shadow-sm transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tp-bg)] motion-reduce:transition-none motion-reduce:active:scale-100'

const SECONDARY_BASE =
  'inline-flex cursor-pointer items-center justify-center rounded-lg border border-[var(--tp-border)] bg-[var(--tp-surface)] px-6 py-3 text-sm font-semibold text-[var(--tp-text)] transition-colors duration-200 hover:bg-[var(--tp-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tp-bg)] motion-reduce:transition-none'

type MarketingPrimaryCtaProps = MarketingCtaProps &
  Readonly<{
    /** Subtle glow pulse — use on at most one CTA per marketing page. */
    emphasis?: boolean
  }>

function isExternalHref(href: string): boolean {
  return href.startsWith('https://') || href.startsWith('http://')
}

export function MarketingPrimaryCta({
  href,
  children,
  emphasis = true,
  className = '',
}: MarketingPrimaryCtaProps) {
  const classes = [PRIMARY_BASE, emphasis ? 'tp-cta-emphasis' : '', className]
    .filter(Boolean)
    .join(' ')

  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export function MarketingSecondaryCta({ href, children, className = '' }: MarketingCtaProps) {
  const classes = [SECONDARY_BASE, className].filter(Boolean).join(' ')

  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
