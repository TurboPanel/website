import type { Metadata } from 'next'
import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  CheckIcon,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

export const metadata: Metadata = {
  title: 'Suggested setups',
  description:
    'Simple ways to connect cloud, datacenter, and office servers to one fast TurboPanel control plane.',
}

type Setup = Readonly<{
  id: string
  title: string
  tagline: string
  bestFor: string
  body: string
  points: ReadonlyArray<string>
  recommended?: boolean
}>

const SETUPS: ReadonlyArray<Setup> = [
  {
    id: 'high-availability',
    title: 'TurboPanel High Availability',
    tagline: 'The fastest way to get started.',
    bestFor: 'Almost every team that wants to ship quickly and skip running another piece of infrastructure.',
    body: 'Create an account, connect a server with one command, and deploy. You get a quick, always-on control plane worldwide while we handle the infrastructure, updates, and uptime behind it.',
    points: [
      'Ready in minutes with no control-plane stack to build',
      'First server included; add more as your fleet grows',
      'Fast access for distributed teams and infrastructure',
    ],
    recommended: true,
  },
  {
    id: 'site-to-site-vpn',
    title: 'Site-to-site VPN fleet',
    tagline: 'One private network across every location.',
    bestFor: 'Teams connecting cloud, datacenter, and office servers without exposing private services to the internet.',
    body: 'TurboPanel links your servers over a private network. Use one reachable gateway to bring private or behind-the-firewall machines into the same fleet, then manage them all from one place.',
    points: [
      'Keep databases and admin tools off the public internet',
      'Connect cloud VMs, physical servers, and office machines',
      'Choose exactly which apps should be public or private',
    ],
  },
  {
    id: 'tunnel-front-door',
    title: 'Public front door, private origin',
    tagline: 'Give users a clean public endpoint. Keep the real app private.',
    bestFor: 'Teams that want public websites without directly exposing a datacenter, office, or home lab.',
    body: 'Use a secure tunnel or an inexpensive public server as the front door, then carry traffic privately to the real app. Visitors get a clean endpoint while your origin stays protected.',
    points: [
      'Publish websites without opening inbound ports on the origin',
      'Use a public server as the front door for private infrastructure',
      'Manage domains, TLS, and public or private access from TurboPanel',
    ],
  },
  {
    id: 'edge-frontend-local-api',
    title: 'Edge frontend, local API',
    tagline: 'Put the experience close to users. Keep sensitive data where it belongs.',
    bestFor: 'Products that need a fast worldwide frontend with APIs and databases on private infrastructure.',
    body: 'Serve your frontend globally and connect it to private APIs over a secure tunnel or VPN. Users get a snappy experience while sensitive services stay on infrastructure you control.',
    points: [
      'Fast worldwide frontend with private APIs and databases',
      'Secure paths from the public front door to private origins',
      'Manage deploys, health, and networking from one control plane',
    ],
  },
]

function SetupScenario({
  setup,
  index,
}: Readonly<{
  setup: Setup
  index: number
}>) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article
      id={setup.id}
      className={
        setup.recommended
          ? 'scroll-mt-28 rounded-2xl border border-[var(--tp-accent)]/35 bg-[color-mix(in_srgb,var(--tp-accent)_8%,var(--tp-bg))] px-5 py-8 sm:px-8 sm:py-10'
          : 'scroll-mt-28 border-t border-[var(--tp-border)] pt-10'
      }
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-xs font-medium text-[var(--tp-accent)]">{number}</p>
        {setup.recommended ? (
          <p className="rounded-md bg-[var(--tp-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-accent-contrast)]">
            Suggested first
          </p>
        ) : null}
      </div>
      <h2 className="tp-display mt-3 text-2xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-[1.75rem]">
        {setup.title}
      </h2>
      <p className="mt-2 text-base font-medium text-[var(--tp-text)] sm:text-lg">{setup.tagline}</p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
        {setup.body}
      </p>
      <p className="mt-5 text-sm text-[var(--tp-text)]">
        <span className="font-medium">Best for:</span>{' '}
        <span className="text-[var(--tp-text-muted)]">{setup.bestFor}</span>
      </p>
      <ul className="mt-5 max-w-3xl space-y-2.5">
        {setup.points.map((point) => (
          <li
            key={point}
            className="flex gap-2.5 text-sm leading-relaxed text-[var(--tp-text-muted)]"
          >
            <span className="mt-0.5">
              <CheckIcon />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {setup.recommended ? (
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis={false}>
            Start on TurboPanel High Availability
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/pricing">See pricing</MarketingSecondaryCta>
        </div>
      ) : null}
    </article>
  )
}

export default function SetupsPage() {
  return (
    <MarketingPageShell active="setups">
      <MarketingHero
        eyebrow="Suggested setups"
        title="Start in minutes. Connect anything."
        description="Begin with TurboPanel High Availability, then connect cloud, datacenter, and office infrastructure in the way that fits your business."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Start on TurboPanel High Availability
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/getting-started/introduction">
            How it works
          </MarketingSecondaryCta>
        </div>
      </MarketingHero>

      <MarketingSection className="pt-0 sm:pt-2">
        <MarketingSectionHeader
          eyebrow="Flexible by design"
          title="Four simple patterns that grow with you"
          description="Mix and match them. Start with High Availability, add a private network, then create public front doors only where you need them."
        />
        <nav aria-label="Setup scenarios" className="mb-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {SETUPS.map((setup, index) => (
            <a
              key={setup.id}
              href={`#${setup.id}`}
              className="cursor-pointer font-medium text-[var(--tp-text-muted)] transition-colors duration-200 hover:text-[var(--tp-text)]"
            >
              <span className="font-mono text-[var(--tp-accent)]">
                {String(index + 1).padStart(2, '0')}
              </span>{' '}
              {setup.title}
            </a>
          ))}
        </nav>
        <div className="mt-4 space-y-8">
          {SETUPS.map((setup, index) => (
            <SetupScenario key={setup.id} setup={setup} index={index} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="band" className="pb-20">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <MarketingSectionHeader
            title="Start with the easy part"
            description="Create your control plane, connect a server, and ship. Add advanced networking later."
          />
          <div className="flex shrink-0 flex-wrap gap-3">
            <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
              Create account
            </MarketingControlPlaneCta>
            <MarketingSecondaryCta href="/pricing" className="px-5">
              Pricing
            </MarketingSecondaryCta>
          </div>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
