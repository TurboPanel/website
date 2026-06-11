import Link from 'next/link'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader } from '@/components/marketing/SiteHeader'

const PHASES = [
  {
    title: 'Phase 1: Core Features',
    status: 'Complete',
    summary: 'The first production foundation for TurboPanel is now in place.',
    focus: [
      'Email/password auth, sessions, verification, password reset, and MFA',
      'First-run install, root admin setup, and admin configuration',
      'Organizations, users, settings, and API foundations',
      'Self-hosted control plane, local dev, migrations, and setup docs',
    ],
  },
  {
    title: 'Phase 2: Better Day-To-Day Ops',
    status: 'In Progress',
    summary: 'Tools that make managing multiple servers easier and less stressful.',
    focus: [
      'Multi-server dashboard',
      'CPU, memory, and disk visibility',
      'Stronger reconnect and error handling',
      'Cleaner, easier interface',
    ],
  },
  {
    title: 'Phase 3: Website Hosting Tools',
    status: 'Planned',
    summary: 'Helpful features for people running classic websites and web apps.',
    focus: [
      'WordPress and PHP support',
      'Domain and SSL setup',
      'Environment variable management',
      'Database and scheduled task tools',
    ],
  },
  {
    title: 'Phase 4: Reliability and Security',
    status: 'Planned',
    summary: 'Make recovery, alerts, and security practices much stronger.',
    focus: [
      'Backup and restore workflows',
      'Health checks and alerts',
      'Audit logs and security hardening',
      'Smoother install and upgrade path',
    ],
  },
  {
    title: 'Phase 5: Team Features',
    status: 'Planned',
    summary: 'Built for teams that share access and responsibilities.',
    focus: [
      'Team roles and permissions',
      'Client account support',
      'API tokens and webhooks',
      'Usage and reporting views',
    ],
  },
  {
    title: 'Phase 6: Platform Expansion',
    status: 'Future',
    summary: 'Longer-term improvements once core workflows are fully mature.',
    focus: [
      'Cloud-hosted control plane option',
      'Managed daemon updates',
      'Mobile operations interface',
      'Plugin and extension system',
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

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_12%_-12%,var(--tp-hero-a),transparent_56%),radial-gradient(620px_circle_at_90%_4%,var(--tp-hero-b),transparent_58%)]" />
      <div className="mx-auto w-full max-w-6xl tp-fade-up">
        <p className="inline-flex rounded-full border border-[var(--tp-border)] bg-[var(--tp-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
          Product roadmap
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[var(--tp-text)] sm:text-5xl">
          Here&apos;s what we&apos;re building next.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--tp-text-muted)]">
          We share our roadmap in public so you always know where TurboPanel is going.
        </p>
      </div>
    </section>
  )
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
    <div className="min-h-screen bg-[var(--tp-bg)] text-[var(--tp-text)]">
      <SiteHeader active="roadmap" />
      <main>
        <HeroSection />
        <PhaseGrid />
        <FooterCallout />
      </main>
      <SiteFooter />
    </div>
  )
}
