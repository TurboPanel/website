import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  CheckIcon,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

const HIGH_AVAILABILITY_FEATURES = [
  'Fast, always-on control plane with worldwide reach',
  'No panel infrastructure, upgrades, backups, or TLS to manage',
  'First connected server included',
  'Add servers as your fleet grows',
  'Accounts, email, and team invites ready from day one',
] as const

const SELF_HOSTED = [
  'Same product experience — you operate the control plane',
  'Run on infrastructure you control and maintain',
  'Unlimited servers; you own uptime, upgrades, backups, and public access',
  'Ideal when your team wants full operational custody',
] as const

const COST_OF_OWN = [
  {
    label: 'Fast worldwide control plane',
    highAvailability: 'Ready by default',
    self: 'You build and operate it',
  },
  {
    label: 'Database backups & upgrades',
    highAvailability: 'Handled for you',
    self: 'Your runbook',
  },
  {
    label: 'HTTPS & public access',
    highAvailability: 'Managed for you',
    self: 'You configure it',
  },
] as const

const FAQ = [
  {
    q: 'What am I paying for on TurboPanel High Availability?',
    a: 'TurboPanel High Availability is in private early access. Request access to get a fast, always-on control plane, accounts, deployment tools, and your first connected server. Your workload servers stay completely yours.',
  },
  {
    q: 'When does self-hosted still make sense?',
    a: 'Choose self-hosted when your team wants to operate the control plane — same product, your infrastructure, your uptime and upgrade cadence. TurboPanel High Availability is the default when you prefer us to run the panel.',
  },
  {
    q: 'Is self-hosted free?',
    a: 'Yes. The self-hosted control plane is free and unlimited on servers you connect. You pay for the infrastructure you run it on.',
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
        eyebrow="TurboPanel High Availability"
        title="Fast everywhere. Online when it matters."
        description="TurboPanel High Availability is in private early access. Request access for a worldwide control plane — we run the panel, you connect servers and ship."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Request early access
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/getting-started/introduction">How it works</MarketingSecondaryCta>
        </div>
      </MarketingHero>

      <MarketingSection className="py-6 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="order-1 rounded-2xl border border-[var(--tp-green)]/40 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--tp-green)_10%,var(--tp-surface))_0%,var(--tp-surface)_55%)] p-6 shadow-[var(--tp-shadow-card)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
                turbopanel high availability
              </p>
              <span className="rounded-full border border-[var(--tp-green)]/40 bg-[var(--tp-green)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text)]">
                Private early access
              </span>
            </div>
            <p className="tp-display mt-4 text-4xl font-semibold tracking-tight text-[var(--tp-text)]">
              Request access
            </p>
            <p className="mt-1 text-sm text-[var(--tp-text-muted)]">
              Pricing details shared when your account is approved
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              The easiest way to run TurboPanel. Connect your servers to a fast worldwide control plane
              while we handle uptime, updates, security, and the infrastructure behind it.
            </p>
            <PlanFeatureList items={HIGH_AVAILABILITY_FEATURES} />
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
                Request early access
              </MarketingControlPlaneCta>
              <MarketingSecondaryCta href="/docs/api" className="px-5">
                API reference
              </MarketingSecondaryCta>
            </div>
          </article>

          <article className="order-2 rounded-2xl border border-[var(--tp-blue)]/40 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--tp-blue)_8%,var(--tp-surface))_0%,var(--tp-surface)_55%)] p-6 sm:p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-blue)]">
              self-hosted option
            </p>
            <p className="tp-display mt-4 text-4xl font-semibold tracking-tight text-[var(--tp-text)]">
              Free
            </p>
            <p className="mt-1 text-sm text-[var(--tp-text-muted)]">
              Unlimited servers — you operate the control plane
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              Run TurboPanel on infrastructure you control. Same console, same APIs, same deploy
              workflows — your team owns uptime, upgrades, backups, and public access.
            </p>
            <PlanFeatureList items={SELF_HOSTED} />
            <div className="mt-8">
              <MarketingSecondaryCta href="/docs/deployment/self-hosted" className="px-5">
                Self-hosted install guide
              </MarketingSecondaryCta>
            </div>
          </article>
        </div>
      </MarketingSection>

      <MarketingSection>
        <MarketingSectionHeader
          eyebrow="Total cost of ownership"
          title="Same product. Different operational responsibility."
          description="TurboPanel High Availability and self-hosted deliver the same experience — the split is who runs the control plane."
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Concern</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">TurboPanel High Availability</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text-muted)]">Self-hosted</th>
              </tr>
            </thead>
            <tbody>
              {COST_OF_OWN.map((row) => (
                <tr key={row.label} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4 text-[var(--tp-text)]">{row.label}</td>
                  <td className="px-5 py-4 font-medium text-[var(--tp-green)]">{row.highAvailability}</td>
                  <td className="px-5 py-4 text-[var(--tp-text-muted)]">{row.self}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MarketingSection>

      <MarketingSection variant="muted">
        <div className="rounded-2xl border border-[var(--tp-accent)]/30 bg-[var(--tp-surface)] px-6 py-8 sm:px-10 sm:py-10">
          <p className="tp-eyebrow">Default to TurboPanel High Availability</p>
          <h2 className="tp-section-title mt-4 max-w-2xl">
            Stop planning the panel. Start shipping with it.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--tp-text-muted)]">
            Request early access, connect your first server, and deploy in minutes. Prefer to operate
            the control plane yourself? Self-hosted is free and documented.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
              Request early access
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
