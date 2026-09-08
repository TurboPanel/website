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
  'Runs on a global edge network — fast and always on, wherever you and your servers are',
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
    label: 'Control plane on a global edge network',
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

/**
 * Planned per-server tier ladder for TurboPanel High Availability. Values
 * mirror the control-plane catalogue (`turbopanel/src/lib/billing/catalogue.ts`
 * + `src/lib/tiers/tier-placement.ts`). Informational only — see
 * `AGENTS.md` → Pricing: the CTA stays the waitlist, never a purchase path.
 */
const TIERS = [
  { tier: 'S1', machine: 'Up to 4 cores / 16 GB', price: '$5.00', example: 'A small VM, 4 cores and 16 GB' },
  { tier: 'S2', machine: 'Up to 10 cores / 32 GB', price: '$7.50', example: 'A mid-size VM or an 8-core mini PC' },
  { tier: 'S3', machine: 'Up to 16 cores / 64 GB', price: '$10.00', example: 'A 16-core workstation-class box' },
  { tier: 'S4', machine: 'Up to 32 cores / 128 GB', price: '$15.00', example: 'A single-socket rack server' },
  { tier: 'S5', machine: 'Up to 64 cores / 256 GB', price: '$20.00', example: 'A dual-socket rack server' },
  { tier: 'S6', machine: 'Up to 128 cores / 512 GB', price: '$35.00', example: 'A large dual-socket server' },
  { tier: 'S7', machine: 'Up to 256 cores / 1 TB', price: '$50.00', example: 'A high-core-count server' },
  { tier: 'SX', machine: 'More than 256 cores or 1 TB', price: 'Contact us', example: 'Anything beyond the ladder' },
] as const

const PLACEMENT_RULES = [
  {
    title: 'Cores and RAM are a hard floor.',
    detail:
      'A server needs the tier its physical cores and RAM land in. Only physical cores count — an 8-core, 16-thread CPU counts as 8 cores.',
  },
  {
    title: 'NICs, drives, and GPUs only raise the recommended tier.',
    detail:
      'Extra devices never block access. Each tier watches a set number of NICs, drives, and GPUs; anything beyond that goes unwatched and you get a daily note saying which devices, and which tier would cover them.',
  },
] as const

const FAQ = [
  {
    q: 'What am I paying for on TurboPanel High Availability?',
    a: 'TurboPanel High Availability is in private alpha and not yet publicly available. Join the waitlist and we will reach out as access opens, with a control plane that runs on a global edge network — fast and always on — plus accounts, deployment tools, and your first connected server. Your workload servers stay completely yours.',
  },
  {
    q: 'How is a server placed on the S1–S7 ladder?',
    a: 'By the machine, not by a feature list. Physical cores and RAM set the tier a server needs — that part is a hard floor, and a license below it cannot enroll that server. NICs, drives, and GPUs only raise the recommended tier: a server with more devices than its tier watches still connects, and you get a daily note listing what is unwatched. Prices are planned; nothing is purchasable during the private alpha.',
  },
  {
    q: 'When does self-hosted still make sense?',
    a: 'Choose self-hosted when your team wants to operate the control plane — same product, your infrastructure, your uptime and upgrade cadence. Self-hosted is also in private alpha today; TurboPanel High Availability will be the default when you prefer us to run the panel.',
  },
  {
    q: 'Is self-hosted free?',
    a: 'It will be. The self-hosted control plane is planned to be free and unlimited on servers you connect — you pay only for the infrastructure you run it on. Self-hosted is currently in private alpha and not yet publicly available; the docs describe where we are headed.',
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
        eyebrow="Pricing · Private alpha"
        title="We run the panel. You run what matters."
        description="TurboPanel High Availability and self-hosted are both in private alpha and not yet publicly available. Join the waitlist for a control plane that lives on a global edge network — we run the panel, you connect servers and ship."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Join the waitlist
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
                Private alpha · Not yet available
              </span>
            </div>
            <p className="tp-display mt-4 text-4xl font-semibold tracking-tight text-[var(--tp-text)]">
              Join the waitlist
            </p>
            <p className="mt-1 text-sm text-[var(--tp-text-muted)]">
              Planned S1–S7 pricing is published below. Nothing is purchasable during the private alpha.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              The easiest TurboPanel is the one you never have to run. Your panel lives on a global
              edge network — close to you and your servers anywhere in the world — while we handle
              uptime, updates, security, and the infrastructure behind it.
            </p>
            <PlanFeatureList items={HIGH_AVAILABILITY_FEATURES} />
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
                Join the waitlist
              </MarketingControlPlaneCta>
              <MarketingSecondaryCta href="/docs/api" className="px-5">
                API reference
              </MarketingSecondaryCta>
            </div>
          </article>

          <article className="order-2 rounded-2xl border border-[var(--tp-blue)]/40 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--tp-blue)_8%,var(--tp-surface))_0%,var(--tp-surface)_55%)] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-blue)]">
                self-hosted option
              </p>
              <span className="rounded-full border border-[var(--tp-blue)]/40 bg-[var(--tp-blue)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text)]">
                Private alpha · Not yet available
              </span>
            </div>
            <p className="tp-display mt-4 text-4xl font-semibold tracking-tight text-[var(--tp-text)]">
              Free
            </p>
            <p className="mt-1 text-sm text-[var(--tp-text-muted)]">
              Planned: unlimited servers — you operate the control plane
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              Run TurboPanel on infrastructure you control, once it is ready. Same console, same APIs,
              same deploy workflows — your team owns uptime, upgrades, backups, and public access.
            </p>
            <PlanFeatureList items={SELF_HOSTED} />
            <div className="mt-8">
              <MarketingSecondaryCta href="/docs/deployment/self-hosted" className="px-5">
                Preview self-hosted docs
              </MarketingSecondaryCta>
            </div>
          </article>
        </div>
      </MarketingSection>

      <MarketingSection>
        <header className="mb-8 max-w-2xl sm:mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="tp-eyebrow">TurboPanel High Availability · Planned pricing</p>
            <span className="rounded-full border border-[var(--tp-green)]/40 bg-[var(--tp-green)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text)]">
              Private alpha · Not yet available
            </span>
          </div>
          <h2 className="tp-section-title mt-3">One price per server, set by the machine.</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--tp-text-muted)] sm:text-lg">
            Every connected server sits on one tier, S1 to S7, by its cores and RAM. Larger
            machines get more watched devices. Self-hosted stays free with unlimited servers —
            this ladder is for the panel we run for you.
          </p>
        </header>
        <div className="overflow-x-auto rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Tier</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Machine</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Per server / month</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text-muted)]">For example</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((row) => (
                <tr key={row.tier} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4 font-mono font-semibold text-[var(--tp-green)]">{row.tier}</td>
                  <td className="px-5 py-4 text-[var(--tp-text)]">{row.machine}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-[var(--tp-text)]">{row.price}</td>
                  <td className="px-5 py-4 text-[var(--tp-text-muted)]">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {PLACEMENT_RULES.map((rule) => (
            <li key={rule.title} className="text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
              <span className="font-semibold text-[var(--tp-text)]">{rule.title}</span> {rule.detail}
            </li>
          ))}
        </ul>
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
            Join us before general availability.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--tp-text-muted)]">
            Join the waitlist to hear when access opens, connect your first server, and deploy in
            minutes. Self-host it when you need to; let us run it when you don&apos;t. Self-hosted is
            coming too — free with unlimited servers, also in private alpha.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
              Join the waitlist
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
