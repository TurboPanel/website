import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  CheckIcon,
  FeatureList,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'
type PhaseStatus = 'Complete' | 'In Progress' | 'Planned' | 'Future'

type Phase = Readonly<{
  title: string
  shortLabel: string
  status: PhaseStatus
  summary: string
  focus: ReadonlyArray<string>
  releaseUrl?: string
  discussionUrl?: string
}>

const LAST_UPDATED = '2026-10-12'

const IDEAS_URL = 'https://github.com/TurboPanel/turbopanel/discussions/categories/ideas'
const RELEASES_URL = 'https://github.com/TurboPanel/turbopanel/releases'

const PHASES: ReadonlyArray<Phase> = [
  {
    title: 'Foundation',
    shortLabel: 'Foundation',
    status: 'Complete',
    summary: 'The secure foundation for accounts, teams, and one reliable control plane.',
    releaseUrl: RELEASES_URL,
    focus: [
      'Secure sign-in, verification, recovery, and team invitations',
      'TOTP authenticator-app second factor and passkeys',
      'The same product experience across High Availability and self-hosted',
      'Organizations, invitations, and flexible access',
      'Signed releases that move through one tag-based pipeline, from canary to release',
      'Clear guides for setup, security, deployment, and automation',
    ],
  },
  {
    title: 'Fleet Operations',
    shortLabel: 'Fleet ops',
    status: 'Complete',
    summary: 'Manage many servers from one place without guessing what is online.',
    releaseUrl: RELEASES_URL,
    focus: [
      'Multi-server dashboard with live status, OS, and connection details',
      'Host metrics charts for CPU, memory, disk, network, and more',
      'Server connect, reconnect, ping, hostname, reboot, and updates',
      'Updates one server at a time; an offline server does not block the rest of the fleet',
      'A quick add-server flow that gets a host online in minutes',
      'Private networking mesh, datacenters, and IP address management',
    ],
  },
  {
    title: 'Hosting and Deploy',
    shortLabel: 'Hosting',
    status: 'Complete',
    summary:
      'Deploy from a source repository, run Docker Compose, PHP and WordPress sites, and Node apps from one place.',
    releaseUrl: RELEASES_URL,
    focus: [
      'Projects from a GitHub repository: a hostname per branch with HTTPS, and a deploy on every push',
      'Docker Compose projects with a managed database attached, including backup and restore',
      'PHP and WordPress sites on Caddy, nginx, Apache or OpenLiteSpeed, with a PHP mode per site',
      "Node apps that run natively as the site owner's Linux user, built in a sandbox",
      'Static sites and SFTP access',
      "Secrets and environment variables, scheduled tasks, and one-click Let's Encrypt certificates",
    ],
  },
  {
    title: 'Production Launch',
    shortLabel: 'Launch',
    status: 'In Progress',
    summary:
      'Prove managed databases on every engine, then move TurboPanel onto its first production servers.',
    discussionUrl: IDEAS_URL,
    focus: [
      'Managed Postgres, MySQL and MariaDB on a single server, a failover pair, or a three-member cluster',
      'Automatic failover works on all three engines; every failure scenario is being proven, including a host losing power and a site staying up through a failover',
      'Backups that survive the loss of a host, and restore checked on every engine',
      "Forward-only upgrades for the panel's own database, with a backup taken first and a tested restore",
      'Our hosted control plane on its own high-availability servers, with a written release checklist and a rehearsed rollback',
      'Self-hosted install and upgrade from the previous release, proven on a fresh host',
      "A choice of PHP versions for the server's OS, in every PHP mode, with 8.4 as the default",
      'Branded new-site, 404 and error pages on every web engine',
      'The redesigned project and environment editor',
      'Hardening of the daemon, sign-in and release signing, an outside security review, and a support channel',
    ],
  },
  {
    title: 'Runtimes and Sites',
    shortLabel: 'Runtimes',
    status: 'Planned',
    summary: 'More ways to create and run a site once the launch work is done.',
    discussionUrl: IDEAS_URL,
    focus: [
      'Deno as an app runtime next to Node',
      'WordPress as a first-class way to create a site, with a wizard that installs it for you',
      'A PHP extensions picker and per-site directory listing',
      'Older Node releases offered with an end-of-life warning, from one runtime list',
      "A site's own 404 and error pages win over ours",
      'A "What are you creating?" page with presets',
    ],
  },
  {
    title: 'Operations and Teams',
    shortLabel: 'Operations',
    status: 'Planned',
    summary: 'Day-two operations for people who run many servers and share them.',
    discussionUrl: IDEAS_URL,
    focus: [
      'MySQL 8.4 and MariaDB 12.3 tested on failover pairs and three-member clusters',
      'Guides for upgrade, backup and restore',
      'A service that keeps crashing is stopped and its site owner is alerted',
      'A read-only Viewer role',
      'Point-and-click backhaul: choose which network carries server-to-server traffic, in priority order',
      'Release signing key rotation and anti-rollback for signed manifests',
    ],
  },
  {
    title: 'Later',
    shortLabel: 'Later',
    status: 'Future',
    summary: 'Longer-term work, not committed to a schedule.',
    focus: [
      'Phone-sized screens for the web app',
      'Private repositories, deploy keys, plain remotes and other code hosts',
      'Rolling deploys across several servers, and blue-green deploys',
    ],
  },
]

const STATUS_LABEL: Record<PhaseStatus, string> = {
  Complete: 'Built',
  'In Progress': 'Building now',
  Planned: 'Next up',
  Future: 'Later',
}

function statusBadgeClass(status: PhaseStatus): string {
  if (status === 'Complete') {
    return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-800 dark:text-emerald-300'
  }
  if (status === 'In Progress') {
    return 'border-[var(--tp-accent)]/45 bg-[var(--tp-accent)]/12 text-[var(--tp-text)]'
  }
  if (status === 'Planned') {
    return 'border-sky-400/35 bg-sky-400/10 text-sky-900 dark:text-sky-200'
  }
  return 'border-[var(--tp-border)] bg-[var(--tp-surface-muted)] text-[var(--tp-text-muted)]'
}

function StatusDot({ status }: Readonly<{ status: PhaseStatus }>) {
  if (status === 'Complete') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/15 text-emerald-700 dark:text-emerald-300">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
    )
  }

  if (status === 'In Progress') {
    return (
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[var(--tp-accent)] bg-[var(--tp-surface)]">
        <span className="h-2 w-2 rounded-full bg-[var(--tp-accent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--tp-accent)_28%,transparent)]" />
      </span>
    )
  }

  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--tp-border)] bg-[var(--tp-bg)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--tp-text-muted)]/55" />
    </span>
  )
}

function StatusBadge({ status }: Readonly<{ status: PhaseStatus }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusBadgeClass(status)}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function NowPanel({
  phase,
  index,
  total,
}: Readonly<{
  phase: Phase
  index: number
  total: number
}>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--tp-accent)]/35 bg-[var(--tp-surface)] shadow-[var(--tp-shadow-card)]">
      <div className="h-1 bg-[var(--tp-accent)]" aria-hidden />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={phase.status} />
            <span className="font-mono text-xs text-[var(--tp-text-muted)]">
              Phase {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
          <h2 className="tp-display mt-4 text-3xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-4xl">
            {phase.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--tp-text-muted)] sm:text-lg">
            {phase.summary}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
            In this phase
          </p>
          <div className="mt-4">
            <FeatureList items={phase.focus} />
          </div>
        </div>
      </div>
    </div>
  )
}

function PhaseTimeline({ phases }: Readonly<{ phases: ReadonlyArray<Phase> }>) {
  return (
    <ol className="relative space-y-0">
      <span className="tp-timeline-spine" aria-hidden />
      {phases.map((phase, index) => {
        const isCurrent = phase.status === 'In Progress'
        const isFuture = phase.status === 'Future'
        let rowClass = 'border-[var(--tp-border)] bg-[var(--tp-surface)]'
        if (isCurrent) {
          rowClass =
            'border-[var(--tp-accent)]/35 bg-[color-mix(in_srgb,var(--tp-accent)_6%,var(--tp-surface))]'
        } else if (isFuture) {
          rowClass = 'border-[var(--tp-border)] bg-[var(--tp-surface)]/70'
        }

        return (
          <li
            key={phase.title}
            id={`phase-${index + 1}`}
            className="relative scroll-mt-28 pb-6 last:pb-0"
          >
            <div className="flex gap-4 sm:gap-5">
              <div className="relative z-[1] shrink-0 pt-5">
                <StatusDot status={phase.status} />
              </div>
              <article className={`min-w-0 flex-1 rounded-xl border p-5 sm:p-6 ${rowClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] font-medium text-[var(--tp-text-muted)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="tp-display text-lg font-semibold tracking-tight text-[var(--tp-text)] sm:text-xl">
                      {phase.title}
                    </h3>
                  </div>
                  <StatusBadge status={phase.status} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-[15px]">
                  {phase.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  {phase.releaseUrl ? (
                    <a
                      href={phase.releaseUrl}
                      className="font-medium text-[var(--tp-accent)] hover:underline"
                    >
                      Release notes
                    </a>
                  ) : null}
                  {phase.discussionUrl ? (
                    <a
                      href={phase.discussionUrl}
                      className="font-medium text-[var(--tp-accent)] hover:underline"
                    >
                      Discuss this phase
                    </a>
                  ) : null}
                  {phase.status === 'Future' ? (
                    <span className="text-[var(--tp-text-muted)]">Not committed to a schedule</span>
                  ) : null}
                </div>
                {isCurrent ? null : (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {phase.focus.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-relaxed text-[var(--tp-text-muted)]"
                      >
                        <span className="mr-2 text-[var(--tp-accent)]" aria-hidden>
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function StatusAside({
  shipped,
  building,
  ahead,
  currentTitle,
}: Readonly<{
  shipped: number
  building: number
  ahead: number
  currentTitle: string
}>) {
  return (
    <div className="rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6 shadow-[var(--tp-shadow-card)]">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tp-text-muted)]">
        Live status
      </p>
      <p className="tp-display mt-3 text-2xl font-semibold tracking-tight text-[var(--tp-text)]">
        Building {currentTitle}
      </p>
      <dl className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-bg)] px-3 py-3 text-center">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text-muted)]">
            Built
          </dt>
          <dd className="tp-display mt-1 text-2xl font-semibold text-[var(--tp-text)]">{shipped}</dd>
        </div>
        <div className="rounded-xl border border-[var(--tp-accent)]/35 bg-[color-mix(in_srgb,var(--tp-accent)_10%,var(--tp-bg))] px-3 py-3 text-center">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text-muted)]">
            Building
          </dt>
          <dd className="tp-display mt-1 text-2xl font-semibold text-[var(--tp-text)]">{building}</dd>
        </div>
        <div className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-bg)] px-3 py-3 text-center">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--tp-text-muted)]">
            Ahead
          </dt>
          <dd className="tp-display mt-1 text-2xl font-semibold text-[var(--tp-text)]">{ahead}</dd>
        </div>
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-[var(--tp-text-muted)]">
        Every phase below moves TurboPanel High Availability and self-hosted closer to a public beta —
        neither is available yet.
      </p>
    </div>
  )
}

export default function RoadmapPage() {
  const shipped = PHASES.filter((phase) => phase.status === 'Complete').length
  const building = PHASES.filter((phase) => phase.status === 'In Progress').length
  const ahead = PHASES.length - shipped - building
  const currentIndex = PHASES.findIndex((phase) => phase.status === 'In Progress')
  const currentPhase = PHASES[currentIndex] ?? PHASES[0]

  return (
    <MarketingPageShell active="roadmap">
      <MarketingHero
        eyebrow="Product roadmap · Private alpha"
        title="In private alpha. Building toward beta."
        description={`Neither TurboPanel High Availability nor self-hosted is publicly available yet. Server management, hosting and deploys are built. We are now proving managed database failover on every engine and getting TurboPanel onto its first production servers. Last updated ${LAST_UPDATED}.`}
        aside={
          <StatusAside
            shipped={shipped}
            building={building}
            ahead={ahead}
            currentTitle={currentPhase.title}
          />
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="/docs">Read the docs</MarketingSecondaryCta>
          <MarketingSecondaryCta href="/changelog">Changelog</MarketingSecondaryCta>
        </div>
      </MarketingHero>

      <MarketingSection className="pt-2 pb-8 sm:pt-0 sm:pb-10">
        <NowPanel phase={currentPhase} index={currentIndex} total={PHASES.length} />
      </MarketingSection>

      <MarketingSection variant="muted" className="pt-12 pb-16 sm:pt-14">
        <MarketingSectionHeader
          eyebrow="All phases"
          title="From foundation to platform"
          description="Scan the timeline, or jump into the phase we are building now."
        />
        <PhaseTimeline phases={PHASES} />
      </MarketingSection>

      <MarketingSection variant="band">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <MarketingSectionHeader
            title="Follow our progress toward beta"
            description="TurboPanel High Availability is building toward accounts, fleet management, deploys, managed databases, and private networking from one fast control plane."
          />
          <div className="flex flex-wrap gap-3">
            <MarketingSecondaryCta href="/docs" className="px-5">
              Go to docs
            </MarketingSecondaryCta>
          </div>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
