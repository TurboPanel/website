import Link from 'next/link'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader } from '@/components/marketing/SiteHeader'

const EDGE_PRICE_ROWS = [
  {
    item: 'Edge plan (includes 1 server)',
    monthly: '$6 / month',
  },
  {
    item: 'Each extra server',
    monthly: '$4 / month per server',
  },
  {
    item: 'Annual billing',
    monthly: 'Pay for 10 months, get 12 months',
  },
] as const

const FAQ = [
  {
    q: 'Is self-hosted really free?',
    a: 'Yes. Self-hosted is free and open source. You can add as many servers as your own system can handle.',
  },
  {
    q: 'When should I pick Edge-hosted?',
    a: 'Pick Edge-hosted if you want us to run the control plane for you, especially if you care about high availability.',
  },
  {
    q: 'Is there a confusing pricing formula?',
    a: 'No. It is just $6/month for the first server, then $4/month for each additional server.',
  },
] as const

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(860px_circle_at_18%_-12%,var(--tp-hero-a),transparent_56%),radial-gradient(620px_circle_at_88%_7%,var(--tp-hero-b),transparent_58%)]" />
      <div className="mx-auto w-full max-w-6xl tp-fade-up">
        <p className="inline-flex rounded-full border border-[var(--tp-border)] bg-[var(--tp-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
          Pricing
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[var(--tp-text)] sm:text-5xl">
          Simple pricing. No surprises.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--tp-text-muted)]">
          Self-hosted is free. Edge-hosted is paid per server. Annual billing gives you two months
          free.
        </p>
      </div>
    </section>
  )
}

function OfferingsSection() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-2">
        <article className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
            Self-hosted
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tp-text)]">$0</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">
            Host TurboPanel on your own setup for free. Great if you want full control and no
            monthly platform bill.
          </p>
          <div className="mt-5">
            <Link
              href="/docs/deployment/control-plane"
              className="rounded-lg border border-[var(--tp-border)] bg-[var(--tp-surface)] px-5 py-3 text-sm font-semibold text-[var(--tp-text)] transition-colors hover:bg-[var(--tp-surface-muted)]"
            >
              Deploy self-hosted
            </Link>
          </div>
        </article>

        <article
          className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface-muted)] p-6"
          style={{ animationDelay: '90ms' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
            Edge-hosted
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--tp-text)]">
            $6/mo + $4/server
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">
            We run the control plane for you. This is the easy choice if you want managed high
            availability.
          </p>
          <div className="mt-5">
            <Link
              href="/docs/getting-started/introduction"
              className="rounded-lg bg-[var(--tp-accent)] px-5 py-3 text-sm font-semibold text-[var(--tp-accent-contrast)] transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

function PricingBreakdownSection() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] tp-fade-up">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[var(--tp-surface-muted)]">
            <tr>
              <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Edge pricing</th>
              <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Rate</th>
            </tr>
          </thead>
          <tbody>
            {EDGE_PRICE_ROWS.map((row) => (
              <tr key={row.item} className="border-t border-[var(--tp-border)]">
                <td className="px-5 py-4 text-[var(--tp-text)]">{row.item}</td>
                <td className="px-5 py-4 text-[var(--tp-text-muted)]">{row.monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function LaunchOfferSection() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto w-full max-w-6xl tp-fade-up rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
          Good to know
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
          Start free. Upgrade only if you want managed hosting.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--tp-text-muted)]">
          Many teams begin with self-hosted, then move to Edge-hosted when they want less
          infrastructure to manage themselves.
        </p>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="border-t border-[var(--tp-border)] px-4 py-14 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="tp-fade-up text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
          Pricing FAQ
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FAQ.map((item, index) => (
            <article
              key={item.q}
              className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <h3 className="text-sm font-semibold text-[var(--tp-text)]">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--tp-bg)] text-[var(--tp-text)]">
      <SiteHeader active="pricing" />
      <main>
        <HeroSection />
        <OfferingsSection />
        <PricingBreakdownSection />
        <LaunchOfferSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}
