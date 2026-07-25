import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  CheckIcon,
  MarketingMetricStrip,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

const EDGE_HOSTED = [
  'Managed control plane on Cloudflare Workers (High Availability)',
  'Hyperdrive-backed Postgres — no self-managed panel database',
  'First enrolled server included in the base plan',
  'Same client API, daemon JWT, and compose deploy pipeline as self-hosted',
  'Email delivery and sign-up flows wired for Edge tenants',
] as const

const SELF_HOSTED = [
  'Run the instance on your own Linux host (Deno + Caddy + Docker stack)',
  'Unlimited enrolled servers — you supply compute and backups',
  'Full data residency for the control-plane database',
  'Identical product UI — you operate upgrades and TLS',
] as const

const EDGE_PRICE_ROWS = [
  {
    item: 'Edge base (includes 1 server)',
    monthly: '$X / month',
  },
  {
    item: 'Each additional enrolled server',
    monthly: '$X / month',
  },
  {
    item: 'Annual billing',
    monthly: 'Pay X months, get X months',
  },
] as const

const COST_OF_OWN = [
  {
    label: 'Panel HA',
    edge: 'Included',
    self: 'You design it',
  },
  {
    label: 'Postgres + migrations',
    edge: 'Operated',
    self: 'Your runbook',
  },
  {
    label: 'TLS + public URLs',
    edge: 'Managed SAN flow',
    self: 'Cert apply on host',
  },
] as const

const FAQ = [
  {
    q: 'What am I paying for on Edge?',
    a: 'The always-on control plane — API, sessions, command queue, and HA runtime on Workers — plus the first server seat. Workload hosts remain yours; you still install turbopaneld on each machine.',
  },
  {
    q: 'When does self-hosted still make sense?',
    a: 'Strict air-gap, custom compliance, or you already run a 24/7 ops stack and want the panel colocated with it. Everyone else usually moves faster starting on Edge.',
  },
  {
    q: 'Is pricing actually linear?',
    a: 'Yes. $X/month covers the panel and one server, then $X/month per additional enrolled server. Annual prepay uses pay-X-get-X months.',
  },
] as const

function PlanFeatureList({ items }: Readonly<{ items: ReadonlyArray<string> }>) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-[var(--tp-text-muted)]">
          <span className="mt-0.5">
            <CheckIcon />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PricingPage() {
  return (
    <MarketingPageShell active="pricing">
      <MarketingHero
        eyebrow="Edge · High availability"
        title="Host the control plane with us. Enroll your servers."
        description="Edge is the production default: managed Workers runtime, operated Postgres, and predictable per-server pricing. Self-hosted stays available at $0 when you need full panel custody."
        secondaryAction={{ href: '/docs/deployment/control-plane', label: 'Self-hosted reference' }}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Start on Edge
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/getting-started/introduction">Technical overview</MarketingSecondaryCta>
        </div>
      </MarketingHero>

      <MarketingSection className="pt-0 sm:pt-2">
        <MarketingMetricStrip
          items={[
            {
              label: 'Base plan',
              value: '$X / mo',
              hint: 'Includes one enrolled server and the managed control plane.',
            },
            {
              label: 'Add-on server',
              value: '+ $X / mo',
              hint: 'Each additional daemon license maps to one line item.',
            },
            {
              label: 'Self-hosted',
              value: '$0',
              hint: 'You operate the instance stack — Edge is still the faster path to prod.',
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection className="py-6 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="order-1 rounded-2xl border border-[var(--tp-accent)]/40 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--tp-accent)_10%,var(--tp-surface))_0%,var(--tp-surface)_55%)] p-6 shadow-[var(--tp-shadow-card)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
                edge-hosted
              </p>
              <span className="rounded-full border border-[var(--tp-accent)]/40 bg-[var(--tp-accent)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text)]">
                Recommended
              </span>
            </div>
            <p className="tp-display mt-4 text-4xl font-semibold tracking-tight text-[var(--tp-text)]">
              $X<span className="text-2xl text-[var(--tp-text-muted)]">/mo</span>
            </p>
            <p className="mt-1 font-mono text-sm text-[var(--tp-text-muted)]">+ $X / server · annual pay-X-get-X</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              Production teams use Edge so the panel survives the same incidents they are trying to fix. You
              connect daemons; we run the API.
            </p>
            <PlanFeatureList items={EDGE_HOSTED} />
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
                Create Edge account
              </MarketingControlPlaneCta>
              <MarketingSecondaryCta href="/docs/api" className="px-5">
                API reference
              </MarketingSecondaryCta>
            </div>
          </article>

          <article className="order-2 rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]/90 p-6 sm:p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
              self-hosted
            </p>
            <p className="tp-display mt-4 text-4xl font-semibold tracking-tight text-[var(--tp-text)]">
              $0
            </p>
            <p className="mt-1 text-sm text-[var(--tp-text-muted)]">Platform subscription · you operate the stack</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              Bring-your-own control plane for regulated or offline environments. Same compose deploy semantics
              — different ops burden.
            </p>
            <PlanFeatureList items={SELF_HOSTED} />
            <div className="mt-8">
              <MarketingSecondaryCta href="/docs/deployment/control-plane" className="px-5">
                Self-hosted install guide
              </MarketingSecondaryCta>
            </div>
          </article>
        </div>
      </MarketingSection>

      <MarketingSection variant="band" className="py-10 sm:py-12">
        <MarketingSectionHeader
          eyebrow="Edge breakdown"
          title="Line items you can paste into a finance ticket"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Edge pricing</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Rate</th>
              </tr>
            </thead>
            <tbody>
              {EDGE_PRICE_ROWS.map((row) => (
                <tr key={row.item} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4 text-[var(--tp-text)]">{row.item}</td>
                  <td className="px-5 py-4 font-mono text-[var(--tp-text-muted)]">{row.monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MarketingSection>

      <MarketingSection>
        <MarketingSectionHeader
          eyebrow="Total cost of ownership"
          title="What Edge removes from your runbook"
          description="Self-hosted is free to license — not free to operate at 3 a.m."
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Concern</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Edge</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text-muted)]">Self-hosted</th>
              </tr>
            </thead>
            <tbody>
              {COST_OF_OWN.map((row) => (
                <tr key={row.label} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4 text-[var(--tp-text)]">{row.label}</td>
                  <td className="px-5 py-4 font-medium text-[var(--tp-accent)]">{row.edge}</td>
                  <td className="px-5 py-4 text-[var(--tp-text-muted)]">{row.self}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MarketingSection>

      <MarketingSection variant="muted">
        <div className="rounded-2xl border border-[var(--tp-accent)]/30 bg-[var(--tp-surface)] px-6 py-8 sm:px-10 sm:py-10">
          <p className="tp-eyebrow">Default to Edge</p>
          <h2 className="tp-section-title mt-4 max-w-2xl">
            Ship this quarter — defer building panel HA until it is actually your differentiator.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--tp-text-muted)]">
            Create an Edge org, enroll a daemon with a registration key, and deploy a Compose environment.
            Migrate to self-hosted later if policy requires it — the API contract stays the same.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
              Start on Edge
            </MarketingControlPlaneCta>
            <MarketingSecondaryCta href="/roadmap" className="px-5">
              See the roadmap
            </MarketingSecondaryCta>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection variant="muted" className="border-t border-[var(--tp-border)]">
        <MarketingSectionHeader title="Pricing FAQ" />
        <div className="divide-y divide-[var(--tp-border)] border-t border-[var(--tp-border)]">
          {FAQ.map((item) => (
            <div key={item.q} className="grid gap-2 py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
              <h3 className="tp-display text-base font-semibold tracking-tight text-[var(--tp-text)]">
                {item.q}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
