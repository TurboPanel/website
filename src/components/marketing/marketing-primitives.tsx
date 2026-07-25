import type { ReactNode } from 'react'
import Link from 'next/link'

type MarketingSectionProps = Readonly<{
  children: ReactNode
  className?: string
  /** Full-bleed band with alternate surface */
  variant?: 'default' | 'band' | 'muted'
  id?: string
}>

export function MarketingSection({
  children,
  className = '',
  variant = 'default',
  id,
}: MarketingSectionProps) {
  let band = ''
  if (variant === 'band') {
    band = 'border-y border-[var(--tp-border)] bg-[var(--tp-surface)]'
  } else if (variant === 'muted') {
    band = 'bg-[var(--tp-surface-muted)]/60'
  }

  return (
    <section id={id} className={`px-4 py-14 sm:px-6 sm:py-16 ${band} ${className}`.trim()}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

type SectionHeaderProps = Readonly<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}>

export function MarketingSectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'mx-auto text-center max-w-2xl' : 'max-w-2xl'

  return (
    <header className={`mb-8 sm:mb-10 ${alignClass}`}>
      {eyebrow ? (
        <p className="tp-eyebrow">{eyebrow}</p>
      ) : null}
      <h2 className="tp-section-title mt-3">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-[var(--tp-text-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  )
}

type MarketingCardProps = Readonly<{
  children: ReactNode
  className?: string
  accent?: boolean
  as?: 'article' | 'div'
  id?: string
}>

export function MarketingCard({
  children,
  className = '',
  accent = false,
  as: Tag = 'article',
  id,
}: MarketingCardProps) {
  return (
    <Tag
      id={id}
      className={`tp-card ${accent ? 'tp-card-accent' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}

export function CheckIcon({ className = '' }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-[var(--tp-accent)] ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type FeatureListProps = Readonly<{
  items: ReadonlyArray<string>
}>

export function FeatureList({ items }: FeatureListProps) {
  return (
    <ul className="space-y-2.5 text-sm leading-relaxed text-[var(--tp-text-muted)]">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-0.5">
            <CheckIcon />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

type MetricStripItem = Readonly<{
  label: string
  value: string
  hint: string
}>

export function MarketingMetricStrip({ items }: Readonly<{ items: ReadonlyArray<MetricStripItem> }>) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-border)] sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="tp-metric bg-[var(--tp-surface)]">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
            {item.label}
          </p>
          <p className="tp-display mt-2 text-2xl font-semibold tracking-tight text-[var(--tp-text)]">
            {item.value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--tp-text-muted)]">{item.hint}</p>
        </div>
      ))}
    </div>
  )
}

/** Static console preview — no animation; paints on first paint. */
export function TerminalPreview() {
  return (
    <div
      className="tp-terminal overflow-hidden rounded-xl border border-[var(--tp-border)] shadow-[var(--tp-shadow-card)]"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-[var(--tp-border)] bg-[var(--tp-surface-muted)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--tp-text-muted)]/35" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--tp-text-muted)]/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--tp-text-muted)]/25" />
        <span className="ml-2 font-mono text-[11px] text-[var(--tp-text-muted)]">
          control-plane · high availability
        </span>
      </div>
      <div className="space-y-2.5 bg-[var(--tp-terminal-bg)] p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
        <p className="text-[var(--tp-text-muted)]">
          <span className="text-[var(--tp-accent)]">GET</span>
          {' /api/client/v1/servers'}
          <span className="text-[var(--tp-text-muted)]/70"> · cached read model</span>
        </p>
        <div className="flex items-center justify-between gap-4 border-y border-[var(--tp-border)]/50 py-2.5">
          <span className="text-[var(--tp-text-muted)]">DAEMON</span>
          <span className="text-[var(--tp-text-muted)]">WS /ws/daemon/v1</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--tp-text)]">prod-us-east-01</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--tp-accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tp-accent)]" />
            <span>connected</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--tp-text)]">dc-compose-02</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--tp-accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tp-accent)]" />
            <span>connected</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 opacity-85">
          <span className="text-[var(--tp-text-muted)]">staging-api</span>
          <span className="text-[var(--tp-text-muted)]">cmd environment.deploy</span>
        </div>
        <p className="pt-1 text-[var(--tp-text-muted)]">
          <span className="text-[var(--tp-accent)]">$</span> POST /environments/…/deploy
        </p>
        <p className="text-[var(--tp-accent)]/90">→ compose validated · queue ack · 38s</p>
      </div>
    </div>
  )
}

type InlineLinkProps = Readonly<{
  href: string
  children: ReactNode
}>

export function MarketingInlineLink({ href, children }: InlineLinkProps) {
  return (
    <Link
      href={href}
      className="cursor-pointer font-medium text-[var(--tp-text)] underline decoration-[var(--tp-border)] underline-offset-[3px] transition-colors duration-200 hover:text-[var(--tp-accent)] hover:decoration-[var(--tp-accent)]/40"
    >
      {children}
    </Link>
  )
}
