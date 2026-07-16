type MarketingHeroProps = Readonly<{
  eyebrow: string
  title: string
  description: string
  gradientClassName?: string
}>

const DEFAULT_GRADIENT =
  'bg-[radial-gradient(900px_circle_at_12%_-12%,var(--tp-hero-a),transparent_56%),radial-gradient(620px_circle_at_90%_4%,var(--tp-hero-b),transparent_58%)]'

export function MarketingHero({
  eyebrow,
  title,
  description,
  gradientClassName = DEFAULT_GRADIENT,
}: MarketingHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 sm:pt-24">
      <div className={`pointer-events-none absolute inset-0 -z-10 ${gradientClassName}`} />
      <div className="mx-auto w-full max-w-6xl tp-fade-up">
        <p className="inline-flex rounded-full border border-[var(--tp-border)] bg-[var(--tp-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[var(--tp-text)] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--tp-text-muted)]">
          {description}
        </p>
      </div>
    </section>
  )
}
