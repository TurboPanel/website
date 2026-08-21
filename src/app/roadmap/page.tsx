import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  CheckIcon,
  FeatureList,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'
import { OPEN_SOURCE_LAUNCH_DATE } from '@/lib/site-dates'

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

const LAST_UPDATED = OPEN_SOURCE_LAUNCH_DATE

const PHASES: ReadonlyArray<Phase> = [
  {
    title: 'Foundation',
    shortLabel: 'Foundation',
    status: 'Complete',
    summary: 'The secure foundation for accounts, teams, and one reliable control plane.',
    releaseUrl: 'https://github.com/TurboPanel/turbopanel/releases',
    focus: [
      'Secure sign-in, verification, recovery, and team invitations',
      'The same product experience across High Availability and self-hosted',
      'Organizations, workspaces, invitations, and flexible access',
      'Clear guides for setup, security, deployment, and automation',
    ],
  },
  {
    title: 'Fleet Operations',
    shortLabel: 'Fleet ops',
    status: 'Complete',
    summary: 'Manage many servers from one place without guessing what is online.',
    releaseUrl: 'https://github.com/TurboPanel/turbopanel/releases',
    focus: [
      'Multi-server dashboard with live status, OS, and connection details',
      'Host metrics charts for CPU, memory, disk, network, and more',
      'Server connect, reconnect, ping, hostname, reboot, and updates',
      'A quick add-server flow that gets a host online in minutes',
    ],
  },
  {
    title: 'Apps and Deploy',
    shortLabel: 'Apps & deploy',
    status: 'In Progress',
    summary: 'Deploy container apps today, with an even easier website experience on the way.',
    discussionUrl: 'https://github.com/TurboPanel/turbopanel/discussions/categories/ideas',
    focus: [
      'Projects, environments, visual editing, and one-click deploy (shipped)',
      'Secrets and environment variables, plus starter catalog templates (shipped)',
      'Faster WordPress and PHP setup, plus simpler domains and TLS',
      'Database helpers, scheduled tasks, and better container day-to-day views',
    ],
  },
  {
    title: 'Reliability and Security',
    shortLabel: 'Reliability',
    status: 'Planned',
    summary: 'Make recovery, alerting, and account security feel production-grade.',
    discussionUrl: 'https://github.com/TurboPanel/turbopanel/discussions/categories/ideas',
    focus: [
      'Backup and restore workflows',
      'Health checks and operator alerts',
      'MFA, audit logs, and further security hardening',
      'Smoother install, upgrade, and recovery paths',
    ],
  },
  {
    title: 'Teams and Automation',
    shortLabel: 'Teams',
    status: 'Planned',
    summary: 'Share work safely and hook TurboPanel into the rest of your stack.',
    discussionUrl: 'https://github.com/TurboPanel/turbopanel/discussions/categories/ideas',
    focus: [
      'Deeper team roles and client-facing account support',
      'API tokens for external automation',
      'Webhooks for deploy and status events',
      'Usage and reporting views',
    ],
  },
  {
    title: 'Platform Expansion',
    shortLabel: 'Platform',
    status: 'Future',
    summary: 'Longer-term surfaces once core hosting and ops workflows are mature. Not committed to a schedule.',
    focus: [
      'Native mobile operations experience',
      'Plugin and extension system',
      'Broader app catalog and managed service presets',
      'More operator tooling for large fleets',
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
        description={`Neither TurboPanel High Availability nor self-hosted is publicly available yet. Server management and core deploys are furthest along, and we are now working on websites, apps, databases, and everyday operations. Last updated ${LAST_UPDATED}.`}
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
          <MarketingControlPlaneCta path="/sign-up" emphasis>
            Join the waitlist
          </MarketingControlPlaneCta>
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
            description="TurboPanel High Availability is building toward accounts, fleet management, metrics, deploys, and private networking from one fast control plane — join the waitlist to hear when it opens."
          />
          <div className="flex flex-wrap gap-3">
            <MarketingControlPlaneCta path="/sign-up" emphasis={false} className="px-5">
              Join the waitlist
            </MarketingControlPlaneCta>
            <MarketingSecondaryCta href="/docs" className="px-5">
              Go to docs
            </MarketingSecondaryCta>
          </div>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
