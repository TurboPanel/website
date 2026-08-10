import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import {
  MarketingPrimaryCta,
  MarketingSecondaryCta,
} from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  FeatureList,
  MarketingCard,
  MarketingInlineLink,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

const HERO_BENEFITS = [
  'Fast, always-on control plane',
  'One place for every server and app',
  'First server included',
] as const

const CAPABILITIES = [
  {
    mono: 'Deploy',
    title: 'Deploy without the busywork',
    body: 'Pick a server, choose staging or production, and ship. Websites, containers, and databases all live in one simple flow.',
  },
  {
    mono: 'Fleet',
    title: 'Know what is happening',
    body: 'See what is online, what needs attention, and what is using your resources — without opening a pile of terminals.',
  },
  {
    mono: 'Network',
    title: 'Connect everything safely',
    body: 'Link cloud, office, and datacenter servers over private networks. Keep private services private and publish only what should be public.',
  },
  {
    mono: 'Always on',
    title: 'Fast for teams everywhere',
    body: 'TurboPanel High Availability keeps your control plane close, quick, and online around the world. Nothing extra for you to run.',
  },
] as const

const SUGGESTED_SETUPS = [
  {
    stage: 'TurboPanel High Availability',
    pitch:
      'The easy choice. Create an account, connect a server, and deploy. We handle the control plane, updates, security, and uptime.',
  },
  {
    stage: 'Site-to-site VPN',
    pitch:
      'Connect cloud, datacenter, and office servers on one private network, then manage the whole fleet from anywhere.',
  },
  {
    stage: 'Tunnels and edge',
    pitch:
      'Put a fast public front door in front of private infrastructure. Your apps stay where they belong while users get a quick experience.',
  },
] as const

const PRODUCT_OS_ITEMS = [
  'Visual setup for websites, containers, and managed services',
  'One-click deploy, stop, restart, and update actions',
  'Clear CPU, memory, disk, and network charts',
  'Live server health and container status',
  'A complete API when you are ready to automate',
] as const

const WHY = [
  {
    title: 'Ready in minutes',
    body: 'Create an account, connect your first server, and start deploying. There is no control-plane infrastructure to design first.',
  },
  {
    title: 'Pricing that stays simple',
    body: 'TurboPanel High Availability and self-hosted are both in private alpha — not yet publicly available. Self-hosted stays free, unlimited servers once it ships.',
  },
  {
    title: 'Fast wherever your team works',
    body: 'A responsive worldwide control plane keeps everyday actions quick, whether your team is across town or across the globe.',
  },
  {
    title: 'Power without the clutter',
    body: 'Start with simple defaults, then go deeper when you need to. The full API and clear docs are there for serious automation.',
  },
] as const

export default function Home() {
  return (
    <MarketingPageShell active="overview">
      <MarketingHero
        eyebrow="TurboPanel"
        title="Your servers. One fast control plane."
        description="Connect a server and start shipping. TurboPanel High Availability gives you a quick, always-on control plane worldwide for websites, containers, databases, and day-to-day ops."
        plainBackground
        benefits={HERO_BENEFITS}
      >
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Join the waitlist
          </MarketingControlPlaneCta>
          <MarketingInlineLink href="/pricing">See pricing</MarketingInlineLink>
        </div>
      </MarketingHero>

      <MarketingSection>
        <MarketingSectionHeader
          eyebrow="What you get"
          title="Everything you need. Nothing you have to babysit."
          description="Deploy apps, watch your fleet, connect private networks, and manage daily operations from one clean control plane."
        />
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-9">
          {CAPABILITIES.map((item) => (
            <div key={item.title}>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--tp-accent)]">
                {item.mono}
              </p>
              <h3 className="tp-display mt-2 text-lg font-semibold tracking-tight text-[var(--tp-text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="band">
        <MarketingSectionHeader
          title="Start simple. Grow into anything."
          description="Begin with TurboPanel High Availability, then add private networking and custom traffic paths only when you need them."
        />
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {SUGGESTED_SETUPS.map((item, index) => (
            <div key={item.stage} className="relative border-t border-[var(--tp-border)] pt-6 md:border-t-0 md:pt-0">
              <p className="font-mono text-xs font-medium text-[var(--tp-accent)]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="tp-display mt-3 text-lg font-semibold tracking-tight text-[var(--tp-text)]">
                {item.stage}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
                {item.pitch}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <MarketingInlineLink href="/setups">Explore every architecture pattern</MarketingInlineLink>
        </div>
      </MarketingSection>

      <MarketingSection>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div>
            <MarketingSectionHeader
              eyebrow="One console"
              title="From idea to running app, faster"
              description="TurboPanel keeps the important work close: configure, deploy, monitor, and fix without bouncing between disconnected tools."
            />
            <FeatureList items={PRODUCT_OS_ITEMS} />
          </div>
          <MarketingCard className="bg-[var(--tp-surface-muted)]/50" accent>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
              built for real life
            </p>
            <h3 className="tp-display mt-3 text-xl font-semibold tracking-tight text-[var(--tp-text)]">
              Find the problem fast
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">
              Your dashboard stays quick and useful while servers reconnect, workloads change, and the
              pressure is on.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[var(--tp-text)]">
              <li className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-accent)]"
                  aria-hidden
                />
                <span>See which servers are healthy right now</span>
              </li>
              <li className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-accent)]"
                  aria-hidden
                />
                <span>Track performance without digging through logs</span>
              </li>
              <li className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-accent)]"
                  aria-hidden
                />
                <span>Catch deploy problems before they become outages</span>
              </li>
            </ul>
          </MarketingCard>
        </div>
      </MarketingSection>

      <MarketingSection variant="muted">
        <div className="overflow-hidden rounded-2xl border border-[var(--tp-accent)]/35 bg-[var(--tp-surface)] shadow-[var(--tp-shadow-card)]">
          <div className="tp-brand-stripe h-1" aria-hidden />
          <div className="flex flex-col gap-8 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
            <div className="max-w-2xl">
              <p className="tp-eyebrow">TurboPanel High Availability</p>
              <h2 className="tp-section-title mt-4">
                Private alpha — join the waitlist for early access.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--tp-text-muted)]">
                Prefer to operate the control plane yourself? Self-hosted will be free with unlimited
                servers — same product, your infrastructure. It's also in private alpha and not yet
                publicly available.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <MarketingPrimaryCta href="/pricing" emphasis={false} className="px-5">
                See simple pricing
              </MarketingPrimaryCta>
              <MarketingControlPlaneCta path="/sign-up" variant="secondary" emphasis={false} className="px-5">
                Join the waitlist
              </MarketingControlPlaneCta>
            </div>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection className="pb-20">
        <MarketingSectionHeader
          title="The control plane your team will actually enjoy using"
          description="TurboPanel High Availability is fast and affordable — and we're working hard to get it ready for you. Spend time on your apps and customers, not on the panel behind them."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {WHY.map((item) => (
            <div key={item.title} className="border-t border-[var(--tp-border)] pt-5">
              <h3 className="tp-display text-base font-semibold tracking-tight text-[var(--tp-text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3 border-t border-[var(--tp-border)] pt-10">
          <MarketingControlPlaneCta path="/sign-up" emphasis={false}>
            Join the waitlist
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/api">Explore the API</MarketingSecondaryCta>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
