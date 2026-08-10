import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  CheckIcon,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'
import {
  DatacenterMeshDiagram,
  FreeformDiagram,
  PrivateMeshDiagram,
  SingleServerDiagram,
  SplitRegionsDiagram,
} from '@/components/marketing/setups/setup-diagrams'

export const metadata: Metadata = {
  title: 'Architecture Patterns',
  description:
    'One server or a global private mesh — see how TurboPanel shapes itself around your servers, databases, and traffic, from your very first box.',
}

type Pattern = Readonly<{
  id: string
  navLabel: string
  title: string
  tagline: string
  body: string
  points: ReadonlyArray<string>
  bestFor: string
  diagram: ReactNode
}>

const PATTERNS: ReadonlyArray<Pattern> = [
  {
    id: 'single-server',
    navLabel: 'Single server',
    title: 'Run everything on one box',
    tagline: 'The fastest path from idea to production.',
    body: 'Connect one server and it instantly becomes your whole platform. Docker Compose apps, managed Postgres or MySQL, static and PHP sites, background jobs — all deployed, watched, and secured from the same dashboard.',
    points: [
      'Deploy containers, databases, and websites side by side on one box',
      'TLS, backups, metrics, and logs come standard — nothing extra to wire up',
      'Outgrow it later without re-architecting a single thing',
    ],
    bestFor: 'Solo builders, side projects, and small teams shipping their first real app.',
    diagram: <SingleServerDiagram />,
  },
  {
    id: 'datacenter-mesh',
    navLabel: 'Datacenter mesh',
    title: 'Add servers. Keep everything in sync.',
    tagline: 'Same site, high-speed private links, real failover.',
    body: 'Bring more servers online in the same datacenter and TurboPanel wires them into one fast private mesh automatically. Spread workloads across boxes, then add a managed database replica so one bad drive never turns into a 3 a.m. page.',
    points: [
      'High-speed private links between every server in the site — no public hops between them',
      'Spin up managed database replicas and promote one to primary in a click',
      'Move a service to a bigger or cheaper box without touching a single DNS record',
    ],
    bestFor: 'Growing apps that need more headroom and real redundancy, without leaving home.',
    diagram: <DatacenterMeshDiagram />,
  },
  {
    id: 'split-regions',
    navLabel: 'Split regions',
    title: 'Frontend near your users. Backend near your data.',
    tagline: 'Two sites, one private backbone, zero visible seams.',
    body: 'Host your frontend on servers close to your customers, and keep your API and backend in an entirely different datacenter — closer to your team, your compliance boundary, or just your cheapest bandwidth. TurboPanel links the two sites privately, so the split is invisible to everyone but you.',
    points: [
      'Frontend and backend live wherever makes sense for latency, cost, or compliance',
      'API and database traffic rides a private link — no public database ports, ever',
      'Deploy, monitor, and roll back both sides of the stack from one project',
    ],
    bestFor: 'Global products with an API and a database that should never touch the public internet.',
    diagram: <SplitRegionsDiagram />,
  },
  {
    id: 'private-mesh',
    navLabel: 'Private mesh',
    title: 'One source of truth. Reads everywhere your customers are.',
    tagline: 'An encrypted mesh across every site you run, with data that follows your customers.',
    body: 'Connect every datacenter you operate — cloud, colo, even the office closet — into one encrypted, site-to-site mesh. Keep a redundant primary database in your main site for writes, then run read-only replicas in every other region so queries stay fast no matter where your customers are.',
    points: [
      'Encrypted site-to-site tunnels between every location you run',
      'Writes land on a redundant primary; reads happen close to the customer',
      'Promote any replica to primary in seconds if an entire site goes dark',
    ],
    bestFor: 'Multi-region products, and teams who treat downtime as a bug, not a line item.',
    diagram: <PrivateMeshDiagram />,
  },
]

function LegendDot({ tone, label }: Readonly<{ tone: 'blue' | 'green'; label: string }>) {
  const color = tone === 'blue' ? 'var(--tp-blue)' : 'var(--tp-green)'
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--tp-text-muted)]">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {label}
    </span>
  )
}

function DiagramCard({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="tp-card p-5 sm:p-6">
      {children}
      <div className="mt-4 flex items-center gap-4 border-t border-[var(--tp-border)] pt-3">
        <LegendDot tone="blue" label="Compute" />
        <LegendDot tone="green" label="Data" />
      </div>
    </div>
  )
}

function PatternSection({ pattern, index, reverse }: Readonly<{ pattern: Pattern; index: number; reverse: boolean }>) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article id={pattern.id} className="scroll-mt-28 border-t border-[var(--tp-border)] pt-12 first:border-t-0 first:pt-0">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className={`order-1 min-w-0 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
          <DiagramCard>{pattern.diagram}</DiagramCard>
        </div>
        <div className={`order-2 min-w-0 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
          <p className="font-mono text-xs font-semibold text-[var(--tp-accent)]">{number}</p>
          <h3 className="tp-display mt-3 text-2xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-[1.7rem]">
            {pattern.title}
          </h3>
          <p className="mt-2 text-base font-medium text-[var(--tp-text)] sm:text-lg">{pattern.tagline}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
            {pattern.body}
          </p>
          <ul className="mt-5 max-w-xl space-y-2.5">
            {pattern.points.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-[var(--tp-text-muted)]">
                <span className="mt-0.5">
                  <CheckIcon />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-[var(--tp-text)]">
            <span className="font-medium">Best for:</span>{' '}
            <span className="text-[var(--tp-text-muted)]">{pattern.bestFor}</span>
          </p>
        </div>
      </div>
    </article>
  )
}

function UnlimitedPattern() {
  return (
    <article
      id="unlimited"
      className="scroll-mt-28 rounded-2xl border border-dashed border-[var(--tp-accent)]/45 bg-[color-mix(in_srgb,var(--tp-accent)_6%,var(--tp-surface))] px-5 py-10 sm:px-10 sm:py-12"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs font-semibold text-[var(--tp-accent)]">N</p>
        <h3 className="tp-display mt-3 text-2xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-[1.9rem]">
          Whatever shape comes next
        </h3>
        <p className="mt-2 text-base font-medium text-[var(--tp-text)] sm:text-lg">
          Mix every pattern above. Invent your own. TurboPanel doesn&apos;t care.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-md">
        <FreeformDiagram />
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
        Two datacenters or twenty. A Raspberry Pi in a closet next to a rack in a colo three states away.
        Ten read replicas orbiting one write primary. Your footprint is your call — TurboPanel&apos;s only
        job is to make it feel like one machine, however wide, weird, or wonderfully specific it gets.
      </p>
      <ul className="mx-auto mt-6 grid max-w-2xl gap-2.5 text-left sm:grid-cols-3">
        {[
          'Any mix of servers, datacenters, and private links',
          'Add or remove capacity without downtime or a rewrite',
          'One console, one API — no matter the shape',
        ].map((point) => (
          <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-[var(--tp-text-muted)]">
            <span className="mt-0.5">
              <CheckIcon />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <MarketingControlPlaneCta path="/sign-up" emphasis={false}>
          Join the waitlist
        </MarketingControlPlaneCta>
        <MarketingSecondaryCta href="/docs">Read the docs</MarketingSecondaryCta>
      </div>
    </article>
  )
}

export default function SetupsPage() {
  return (
    <MarketingPageShell active="setups">
      <MarketingHero
        eyebrow="Architecture patterns"
        title="Any footprint. One control plane."
        description="One server or twelve, one datacenter or five — TurboPanel doesn't care how your fleet is shaped. Wire it up your way, then run every app, container, database, and website from a single fast console."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Join the waitlist
          </MarketingControlPlaneCta>
          <MarketingSecondaryCta href="/docs/getting-started/introduction">
            See how it works
          </MarketingSecondaryCta>
        </div>
      </MarketingHero>

      <MarketingSection className="pt-0 sm:pt-2">
        <MarketingSectionHeader
          eyebrow="Pick your shape"
          title="Four patterns. Infinite combinations."
          description="Every pattern below runs on the exact same TurboPanel console — same deploys, same dashboards, same API. Start with whichever one fits today, then reshape your fleet as you grow. Nothing to migrate, nothing to relearn."
        />
        <nav aria-label="Jump to a setup" className="mb-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {PATTERNS.map((pattern, index) => (
            <a
              key={pattern.id}
              href={`#${pattern.id}`}
              className="cursor-pointer font-medium text-[var(--tp-text-muted)] transition-colors duration-200 hover:text-[var(--tp-text)]"
            >
              <span className="font-mono text-[var(--tp-accent)]">
                {String(index + 1).padStart(2, '0')}
              </span>{' '}
              {pattern.navLabel}
            </a>
          ))}
          <a
            href="#unlimited"
            className="cursor-pointer font-medium text-[var(--tp-text-muted)] transition-colors duration-200 hover:text-[var(--tp-text)]"
          >
            <span className="font-mono text-[var(--tp-accent)]">N</span> Unlimited
          </a>
        </nav>
        <div className="mt-4 space-y-12">
          {PATTERNS.map((pattern, index) => (
            <PatternSection key={pattern.id} pattern={pattern} index={index} reverse={index % 2 === 1} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="muted">
        <UnlimitedPattern />
      </MarketingSection>

      <MarketingSection variant="band" className="pb-20">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <MarketingSectionHeader
            title="Pick a pattern. Or don't — just start."
            description="Connect your first server, deploy something, and reshape your fleet whenever you're ready. The console never changes underneath you."
          />
          <div className="flex shrink-0 flex-wrap gap-3">
            <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
              Join the waitlist
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
