import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'

const PHASES = [
  {
    title: 'Phase 1: Foundation',
    status: 'Complete',
    summary: 'Sign-in, install, and the dual control-plane model are ready to use.',
    focus: [
      'Email/password auth, sessions, email OTP, verification, and password reset',
      'Self-hosted first-run install and Edge-hosted (Cloudflare Workers) control plane',
      'Organizations, workspaces, users, invitations, and access grants',
      'Public docs for setup, architecture, deployment, and the API',
    ],
  },
  {
    title: 'Phase 2: Fleet Operations',
    status: 'Complete',
    summary: 'Manage many servers from one place without guessing what is online.',
    focus: [
      'Multi-server dashboard with live status, OS, and connection details',
      'Host metrics charts for CPU, memory, disk, network, and more',
      'Daemon connect, reconnect, ping, hostname, reboot, and trunk updates',
      'Add-server flow with registration keys (licenses)',
    ],
  },
  {
    title: 'Phase 3: Apps and Deploy',
    status: 'In Progress',
    summary: 'Ship Docker Compose apps today; deepen everyday website hosting next.',
    focus: [
      'Projects, environments, compose editing, and one-click deploy (shipped)',
      'Secrets and environment variables, plus starter catalog templates (shipped)',
      'Richer WordPress / PHP workflows and clearer domain + TLS setup',
      'Database helpers, scheduled tasks, and better container day-to-day views',
    ],
  },
  {
    title: 'Phase 4: Reliability and Security',
    status: 'Planned',
    summary: 'Make recovery, alerting, and account security feel production-grade.',
    focus: [
      'Backup and restore workflows',
      'Health checks and operator alerts',
      'MFA, audit logs, and further security hardening',
      'Smoother install, upgrade, and recovery paths',
    ],
  },
  {
    title: 'Phase 5: Teams and Automation',
    status: 'Planned',
    summary: 'Share work safely and hook TurboPanel into the rest of your stack.',
    focus: [
      'Deeper team roles and client-facing account support',
      'API tokens for external automation',
      'Webhooks for deploy and status events',
      'Usage and reporting views',
    ],
  },
  {
    title: 'Phase 6: Platform Expansion',
    status: 'Future',
    summary: 'Longer-term surfaces once core hosting and ops workflows are mature.',
    focus: [
      'Native mobile operations experience',
      'Plugin and extension system',
      'Broader app catalog and managed service presets',
      'More operator tooling for large fleets',
    ],
  },
] as const

const STATUS_CLASS: Record<string, string> = {
  Complete:
    'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-400/10 dark:text-emerald-300',
  'In Progress':
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/10 dark:text-amber-300',
  Planned:
    'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/35 dark:bg-sky-400/10 dark:text-sky-300',
  Future: 'border-[var(--tp-border)] bg-[var(--tp-surface-muted)] text-[var(--tp-text-muted)]',
}

function PhaseGrid() {
  return (
    <section className="px-4 pb-16 pt-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PHASES.map((phase, index) => (
          <article
            key={phase.title}
            className="tp-fade-up rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)]"
            style={{ animationDelay: `${index * 85}ms` }}
          >
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${STATUS_CLASS[phase.status] ?? STATUS_CLASS.Future}`}
            >
              {phase.status}
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-[var(--tp-text)]">
              {phase.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
              {phase.summary}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--tp-text-muted)]">
              {phase.focus.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-text-muted)]/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function FooterCallout() {
  return (
    <section className="border-t border-[var(--tp-border)] px-4 py-14 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 tp-fade-up">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--tp-text)] sm:text-3xl">
            Want the details right now?
          </h2>
          <p className="mt-2 text-base text-[var(--tp-text-muted)]">
            The docs already cover setup steps, architecture, and API info.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/docs"
            className="rounded-lg bg-[var(--tp-accent)] px-5 py-3 text-sm font-semibold text-[var(--tp-accent-contrast)] transition-opacity hover:opacity-90"
          >
            Go to docs
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-[var(--tp-border)] bg-[var(--tp-surface)] px-5 py-3 text-sm font-semibold text-[var(--tp-text)] transition-colors hover:bg-[var(--tp-surface-muted)]"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function RoadmapPage() {
  return (
    <MarketingPageShell active="roadmap">
      <MarketingHero
        eyebrow="Product roadmap"
        title="What's shipped — and what's next."
        description="We keep this roadmap honest: completed work stays listed, and upcoming phases reflect what we are actually building next."
      />
      <PhaseGrid />
      <FooterCallout />
    </MarketingPageShell>
  )
}
