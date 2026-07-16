import Link from 'next/link'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'

const STAGE_SOLUTIONS = [
  {
    stage: 'Just getting started',
    pitch: 'Launch your first apps without learning five different tools first.',
  },
  {
    stage: 'Growing team',
    pitch: 'Keep everyone on the same page with one place to manage servers and apps.',
  },
  {
    stage: 'Busy setup',
    pitch: 'Handle more apps and more servers without turning daily ops into a fire drill.',
  },
] as const

const PRODUCT_OS_ITEMS = [
  'Start, stop, and restart apps',
  'Watch logs in real time',
  'Add new servers in minutes',
  'Manage team access safely',
  'Use the API when you want automation',
] as const

const DATA_CONTEXT_ITEMS = [
  'What is running right now',
  'Which server needs attention',
  'Recent changes and activity',
] as const

const WHY_TURBOPANEL = [
  'Easy enough for small projects, solid enough for bigger teams',
  'Self-hosted is free, so you can start without budget drama',
  'Edge-hosted is available if you want managed high availability',
  'Docs are written to be useful, not impressive',
] as const

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-20 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(880px_circle_at_16%_-10%,var(--tp-hero-a),transparent_55%),radial-gradient(640px_circle_at_90%_8%,var(--tp-hero-b),transparent_58%)]" />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl tp-fade-up">
          <p className="inline-flex rounded-full border border-[var(--tp-border)] bg-[var(--tp-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
            Website and container management
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--tp-text)] sm:text-6xl">
            Host in the cloud, in your datacenter, or a mix of both.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--tp-text-muted)] sm:text-xl">
            Deploy your apps, blogs, databases, or any of our [X+] application templates, anywhere.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started/introduction"
              className="rounded-lg bg-[var(--tp-accent)] px-6 py-3 text-sm font-semibold text-[var(--tp-accent-contrast)] transition-opacity hover:opacity-90"
            >
              Start with docs
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-[var(--tp-border)] bg-[var(--tp-surface)] px-6 py-3 text-sm font-semibold text-[var(--tp-text)] transition-colors hover:bg-[var(--tp-surface-muted)]"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--tp-text-muted)]">
            Questions?{' '}
            <Link href="/docs" className="underline">
              Read the docs
            </Link>{' '}
            or{' '}
            <Link href="/roadmap" className="underline">
              see what&apos;s coming next
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

function StageSection() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 tp-fade-up">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
            Pick what sounds like you
          </h2>
          <p className="mt-2 text-base text-[var(--tp-text-muted)]">
            TurboPanel works whether you are solo or running a larger setup.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {STAGE_SOLUTIONS.map((item, index) => (
            <article
              key={item.stage}
              className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)]"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <h3 className="text-lg font-semibold text-[var(--tp-text)]">{item.stage}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
                {item.pitch}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductOsSection() {
  return (
    <section className="border-y border-[var(--tp-border)] bg-[var(--tp-surface)] px-4 py-14 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2">
        <div className="tp-fade-up">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
            One place, not ten tabs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--tp-text-muted)]">
            Start with the basics today, then grow into advanced workflows later. You don&apos;t
            need to be an infrastructure expert to get value.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--tp-text-muted)]">
            {PRODUCT_OS_ITEMS.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-text-muted)]/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface-muted)] p-6"
          style={{ animationDelay: '120ms' }}
        >
          <h3 className="text-xl font-semibold text-[var(--tp-text)]">See what matters fast</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">
            You can quickly spot problems and fix them before they become "why is the site down?"
            messages.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--tp-text-muted)]">
            {DATA_CONTEXT_ITEMS.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-text-muted)]/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function PricingStrip() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto w-full max-w-6xl tp-fade-up rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
          Simple pricing
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
          Self-hosted is free. Edge-hosted starts at $6/month.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--tp-text-muted)]">
          Edge-hosted includes one server for $6/month, then $4/month for each extra server. Annual
          billing gives you 12 months for the price of 10.
        </p>
        <div className="mt-6">
          <Link
            href="/pricing"
            className="rounded-lg bg-[var(--tp-accent)] px-5 py-3 text-sm font-semibold text-[var(--tp-accent-contrast)] transition-opacity hover:opacity-90"
          >
            Open pricing
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 tp-fade-up">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
            Why people choose TurboPanel
          </h2>
          <p className="mt-2 text-base text-[var(--tp-text-muted)]">
            It keeps day-to-day server work simple.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {WHY_TURBOPANEL.map((item, index) => (
            <article
              key={item}
              className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-5"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <p className="text-sm leading-relaxed text-[var(--tp-text-muted)]">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <MarketingPageShell active="overview">
      <HeroSection />
      <StageSection />
      <ProductOsSection />
      <PricingStrip />
      <WhySection />
    </MarketingPageShell>
  )
}
