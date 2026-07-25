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
  MarketingMetricStrip,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

const PLATFORM_STATS = [
  {
    label: 'Control plane',
    value: 'Workers + Postgres',
    hint: 'Hyperdrive-backed API, globally distributed, no VM to patch for the panel itself.',
  },
  {
    label: 'Fleet path',
    value: 'Daemon WSS',
    hint: 'Ed25519 JWT auth, correlated commands, Postgres-projected presence — not per-host polling.',
  },
  {
    label: 'Deploy unit',
    value: 'Compose-native',
    hint: 'Environment overlays, placement pins, linted YAML — one click when the target server is set.',
  },
] as const

const CAPABILITIES = [
  {
    mono: 'deploy',
    title: 'Environment-scoped Compose',
    body: 'Merge project base + environment overlay, validate before enqueue, and ship to the pinned server with daemon-side Traefik ingress.',
  },
  {
    mono: 'fleet',
    title: 'O(1) status at scale',
    body: 'Fleet tables read from Postgres projections — online state, metrics series, and command lifecycle without opening a tab per host.',
  },
  {
    mono: 'net',
    title: 'Datacenter-aware networking',
    body: 'Org VPC meshes, IP pools, and bind modes (public / datacenter / local) for hostings that need more than a single public interface.',
  },
  {
    mono: 'ha',
    title: 'TurboPanel High Availability by default',
    body: 'We operate the control plane on Cloudflare Workers so your team logs in — you focus on the nodes running your workloads.',
  },
] as const

const OPERATING_PROFILES = [
  {
    stage: 'Production on day one',
    pitch:
      'Spin up TurboPanel High Availability, enroll your first daemon with a registration key, and deploy Compose without standing up Postgres, Caddy, and RabbitMQ for the panel.',
  },
  {
    stage: 'Hybrid fleets',
    pitch:
      'Pin environments to specific servers — cloud VMs, colo metal, or Raspberry Pi at the edge — from one API and one console.',
  },
  {
    stage: 'Platform engineering',
    pitch:
      'Variables, access grants, OpenAPI surfaces, and command polling hooks that fit CI/CD once the basics are stable.',
  },
] as const

const PRODUCT_OS_ITEMS = [
  'Compose editor + visual service kinds (container / traditional-web)',
  'Deploy, stop, and container status from Postgres — not live DO reads',
  'Host metrics (CPU, memory, disk, network) with gap-aware charts',
  'Server commands: ping, hostname, reboot, timezone, NTP, trunk update',
  'Client + daemon OpenAPI — cookie session and bearer JWT respectively',
] as const

const WHY = [
  {
    title: 'TurboPanel High Availability is the default product surface',
    body: 'Same UI and API as self-hosted, but the control plane runs on our hosted stack — you add servers, not another always-on VM pair.',
  },
  {
    title: 'Honest per-server economics',
    body: 'One included server on TurboPanel High Availability, then linear add-ons. No hidden seat math — fleet size maps directly to line items.',
  },
  {
    title: 'Self-hosted when you must',
    body: 'Open-source path remains available for air-gapped or compliance-bound installs; most teams still start on TurboPanel High Availability for speed.',
  },
  {
    title: 'Docs that match the architecture',
    body: 'Dual-runtime instance, daemon cell, command pipeline, and deployment guides — written for operators who read RFCs.',
  },
] as const

export default function Home() {
  return (
    <MarketingPageShell active="overview">
      <MarketingHero
        eyebrow="DevOps control plane · TurboPanel High Availability"
        title="Run your fleet from a managed Workers control plane."
        description="TurboPanel is Compose-native infrastructure software: enroll Linux hosts, deploy environments with placement pins, and operate everything through a fast ops console — we host the panel with TurboPanel High Availability so you do not babysit it."
        showTerminal
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Start on TurboPanel High Availability
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/getting-started/introduction">
            Read the architecture
          </MarketingSecondaryCta>
          <MarketingSecondaryCta href="/pricing">TurboPanel High Availability pricing</MarketingSecondaryCta>
        </div>
        <p className="mt-6 text-sm text-[var(--tp-text-muted)]">
          Already running the panel yourself?{' '}
          <MarketingInlineLink href="/docs/deployment/control-plane">
            Self-hosted install
          </MarketingInlineLink>{' '}
          ·{' '}
          <MarketingInlineLink href="/roadmap">Roadmap</MarketingInlineLink>
        </p>
      </MarketingHero>

      <MarketingSection className="pt-0 sm:pt-2">
        <MarketingMetricStrip items={PLATFORM_STATS} />
      </MarketingSection>

      <MarketingSection>
        <MarketingSectionHeader
          eyebrow="Platform"
          title="Built for operators who ship Compose every week"
          description="Modular client API, daemon WebSocket cell, and Ansible-driven node agents — one product surface whether you connect one server or fifty."
        />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-border)] sm:grid-cols-2">
          {CAPABILITIES.map((item) => (
            <div key={item.title} className="bg-[var(--tp-surface)] p-6 sm:p-7">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--tp-accent)]">
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
          title="Where TurboPanel High Availability fits your stack"
          description="Most teams want a control plane that is online when they are — not another service to restore during an incident."
        />
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {OPERATING_PROFILES.map((item, index) => (
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
      </MarketingSection>

      <MarketingSection>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div>
            <MarketingSectionHeader
              eyebrow="Console"
              title="One API for fleet, deploy, and access"
              description="The org console is dense on purpose: fewer clicks from compose edit to live containers, with permissions that mirror the authz catalog on the wire."
            />
            <FeatureList items={PRODUCT_OS_ITEMS} />
          </div>
          <MarketingCard className="bg-[var(--tp-surface-muted)]/50" accent>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
              incident-ready
            </p>
            <h3 className="tp-display mt-3 text-xl font-semibold tracking-tight text-[var(--tp-text)]">
              See signal, not noise
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">
              Postgres-backed presence and metrics mean the overview stays fast while daemons reconnect
              behind Caddy or Cloudflare.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[var(--tp-text)]">
              <li className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-accent)]"
                  aria-hidden
                />
                <span>Which hosts are connected vs stale</span>
              </li>
              <li className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-accent)]"
                  aria-hidden
                />
                <span>Command latency segments on ping</span>
              </li>
              <li className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-accent)]"
                  aria-hidden
                />
                <span>Deploy validation errors before queue time</span>
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
              <p className="tp-eyebrow">TurboPanel High Availability pricing</p>
              <h2 className="tp-section-title mt-4">
                Managed control plane from $X/month — first server included.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--tp-text-muted)]">
                Per-server add-ons stay predictable. Annual billing is pay X months, get X months —
                self-hosted remains $0 if you truly need to run the panel yourself.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <MarketingPrimaryCta href="/pricing" emphasis={false} className="px-5">
                Compare TurboPanel High Availability plans
              </MarketingPrimaryCta>
              <MarketingControlPlaneCta path="/sign-up" variant="secondary" emphasis={false} className="px-5">
                Create TurboPanel High Availability account
              </MarketingControlPlaneCta>
            </div>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection className="pb-20">
        <MarketingSectionHeader
          title="Why teams standardize on TurboPanel High Availability"
          description="Professional ops tooling with a hosted control plane — so your engineers spend cycles on workloads, not running the panel themselves."
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
            Start on TurboPanel High Availability
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/api">Explore the API</MarketingSecondaryCta>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
