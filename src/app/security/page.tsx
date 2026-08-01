import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import {
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Supported TurboPanel versions, private vulnerability reporting, and security advisories.',
}

const SUPPORTED = [
  { channel: 'release (stable)', support: 'Security fixes' },
  { channel: 'rc', support: 'Security fixes during RC window' },
  { channel: 'canary', support: 'Best-effort — upgrade to release for production' },
  { channel: 'trunk', support: 'Development only' },
] as const

export default function SecurityPage() {
  return (
    <MarketingPageShell active="security">
      <MarketingHero
        eyebrow="Security"
        title="Report vulnerabilities responsibly"
        description="TurboPanel is in public beta. We take security reports seriously and coordinate fixes before public disclosure."
      />

      <MarketingSection>
        <MarketingSectionHeader title="Supported versions" />
        <div className="overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold">Channel</th>
                <th className="px-5 py-4 font-semibold">Security support</th>
              </tr>
            </thead>
            <tbody>
              {SUPPORTED.map((row) => (
                <tr key={row.channel} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4 font-mono text-[var(--tp-text)]">{row.channel}</td>
                  <td className="px-5 py-4 text-[var(--tp-text-muted)]">{row.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--tp-text-muted)]">
          Pair control plane and daemon versions using the{' '}
          <Link href="/docs/deployment/compatibility" className="text-[var(--tp-accent)] hover:underline">
            compatibility matrix
          </Link>
          .
        </p>
      </MarketingSection>

      <MarketingSection variant="muted">
        <MarketingSectionHeader title="Private reporting" />
        <ol className="list-decimal space-y-3 pl-5 text-sm text-[var(--tp-text-muted)]">
          <li>
            Use{' '}
            <a
              href="https://github.com/turbopanel/turbopanel/security/advisories/new"
              className="text-[var(--tp-accent)] hover:underline"
            >
              GitHub private vulnerability reporting
            </a>{' '}
            on the affected repository.
          </li>
          <li>
            Or email <strong className="text-[var(--tp-text)]">security@turbopanel.io</strong> if private
            reporting is unavailable.
          </li>
        </ol>
        <p className="mt-6 text-sm text-[var(--tp-text-muted)]">
          Full policy:{' '}
          <Link href="/docs/security/reporting" className="text-[var(--tp-accent)] hover:underline">
            Vulnerability reporting
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection>
        <MarketingSectionHeader title="Response timeline" />
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--tp-border)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tp-text-muted)]">
              Acknowledgement
            </dt>
            <dd className="tp-display mt-2 text-2xl font-semibold">3 business days</dd>
          </div>
          <div className="rounded-xl border border-[var(--tp-border)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tp-text-muted)]">
              Initial assessment
            </dt>
            <dd className="tp-display mt-2 text-2xl font-semibold">10 business days</dd>
          </div>
          <div className="rounded-xl border border-[var(--tp-border)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tp-text-muted)]">
              Fix plan
            </dt>
            <dd className="mt-2 text-sm text-[var(--tp-text-muted)]">Severity-dependent; we keep you updated</dd>
          </div>
        </dl>
      </MarketingSection>

      <MarketingSection variant="band">
        <MarketingSectionHeader title="Advisories" />
        <p className="text-sm text-[var(--tp-text-muted)]">
          Published advisories appear on{' '}
          <a
            href="https://github.com/turbopanel/turbopanel/security/advisories"
            className="text-[var(--tp-accent)] hover:underline"
          >
            GitHub Security Advisories
          </a>
          . Subscribe to release notifications for security fixes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="/docs/security/daemon-trust-model">
            Daemon trust model
          </MarketingSecondaryCta>
          <MarketingSecondaryCta href="/changelog">Changelog</MarketingSecondaryCta>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
