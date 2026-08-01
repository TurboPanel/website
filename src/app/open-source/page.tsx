import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingControlPlaneCta } from '@/components/marketing/MarketingControlPlaneCta'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

export const metadata: Metadata = {
  title: 'Open source',
  description:
    'TurboPanel repositories, AGPL-3.0 licensing, self-hosting scope, and trademark policy.',
}

const REPOS = [
  {
    name: 'TurboPanel Control Plane',
    slug: 'turbopanel',
    role: 'API, auth, orchestration hub, daemon cell',
  },
  {
    name: 'TurboPanel Daemon',
    slug: 'turbopaneld',
    role: 'Node agent, Ansible, deploy runtime, metrics',
  },
  {
    name: 'TurboPanel UI',
    slug: 'ui',
    role: 'Signed-in product console (Expo / Tamagui)',
  },
  {
    name: 'TurboPanel Development Environment',
    slug: 'dev',
    role: 'Contributor dev console (not production install)',
  },
  {
    name: 'TurboPanel Website & Docs',
    slug: 'website',
    role: 'Marketing site and documentation source',
  },
] as const

const FAQ = [
  {
    q: 'Can I use TurboPanel commercially?',
    a: 'Yes, under AGPL-3.0-only. If you modify the software and run it as a network service users interact with, you must offer corresponding source to those users. Consult counsel for your specific deployment model.',
  },
  {
    q: 'Does self-hosted include the full product?',
    a: 'Yes. Self-hosted operators run the same control plane, UI, and daemon stack as TurboPanel High Availability. The difference is who operates the control plane infrastructure.',
  },
  {
    q: 'Can I redistribute TurboPanel?',
    a: 'Under AGPL-3.0-only, yes — with license and source obligations. Do not imply endorsement or use TurboPanel trademarks beyond what the license and brand guidelines allow.',
  },
] as const

export default function OpenSourcePage() {
  return (
    <MarketingPageShell active="open-source">
      <MarketingHero
        eyebrow="Open source"
        title="Same product. Your choice of operator."
        description="TurboPanel application code is open source under AGPL-3.0-only. Self-host the full stack or use TurboPanel High Availability — the console and APIs are the same."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="/docs/deployment/self-hosted">
            Self-hosted guide
          </MarketingSecondaryCta>
          <MarketingControlPlaneCta path="/sign-up" emphasis={false}>
            Request managed access
          </MarketingControlPlaneCta>
        </div>
      </MarketingHero>

      <MarketingSection>
        <MarketingSectionHeader
          eyebrow="License"
          title="AGPL-3.0-only across application repos"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Repository</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">License</th>
              </tr>
            </thead>
            <tbody>
              {REPOS.map((repo) => (
                <tr key={repo.slug} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4">
                    <a
                      href={`https://github.com/turbopanel/${repo.slug}`}
                      className="font-medium text-[var(--tp-text)] hover:text-[var(--tp-accent)]"
                    >
                      turbopanel/{repo.slug}
                    </a>
                    <p className="mt-1 text-[var(--tp-text-muted)]">{repo.role}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[var(--tp-text-muted)]">AGPL-3.0-only</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--tp-text-muted)]">
          Community standards live in{' '}
          <a href="https://github.com/turbopanel/.github" className="text-[var(--tp-accent)] hover:underline">
            turbopanel/.github
          </a>{' '}
          (no separate license file there).
        </p>
      </MarketingSection>

      <MarketingSection variant="muted">
        <MarketingSectionHeader
          title="What self-hosting includes"
          description="You operate the control plane; TurboPanel operates it on High Availability."
        />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-blue)]">
              Self-hosted operator runs
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--tp-text-muted)]">
              <li>Control plane (Deno + Postgres + Caddy)</li>
              <li>UI static export or dev proxy</li>
              <li>Backups, upgrades, and public TLS for the panel</li>
              <li>One daemon per managed server (including co-located CP host)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-green)]">
              TurboPanel High Availability operates
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--tp-text-muted)]">
              <li>Workers control plane + Hyperdrive database path</li>
              <li>Global edge TLS and uptime</li>
              <li>Accounts, email, and panel upgrades</li>
              <li>You still run workload servers and enroll daemons</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm text-[var(--tp-text-muted)]">
          The signed-in app experience does not differ by deployment model.
        </p>
      </MarketingSection>

      <MarketingSection>
        <MarketingSectionHeader eyebrow="Repositories" title="Where the code lives" />
        <ul className="space-y-3 text-sm">
          {REPOS.map((repo) => (
            <li key={repo.slug}>
              <Link
                href={`https://github.com/turbopanel/${repo.slug}`}
                className="font-medium text-[var(--tp-accent)] hover:underline"
              >
                {repo.name}
              </Link>
              <span className="text-[var(--tp-text-muted)]"> — {repo.role}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="/docs/deployment/self-hosted">Install self-hosted</MarketingSecondaryCta>
          <MarketingSecondaryCta href="https://github.com/turbopanel/turbopanel/releases">
            Releases
          </MarketingSecondaryCta>
          <MarketingSecondaryCta href="/security">Security</MarketingSecondaryCta>
          <MarketingSecondaryCta href="/roadmap">Roadmap</MarketingSecondaryCta>
        </div>
      </MarketingSection>

      <MarketingSection variant="band">
        <MarketingSectionHeader
          eyebrow="Brand"
          title="Trademark and logo use"
          description="The code is open; the TurboPanel name and logo are brand assets."
        />
        <p className="text-sm text-[var(--tp-text-muted)]">
          See <Link href="/about/logo" className="text-[var(--tp-accent)] hover:underline">Logo & brand</Link>{' '}
          for download links, clear space, and do-not rules.
        </p>
      </MarketingSection>

      <MarketingSection variant="muted">
        <MarketingSectionHeader title="FAQ" />
        <div className="divide-y divide-[var(--tp-border)] border-t border-[var(--tp-border)]">
          {FAQ.map((item) => (
            <div key={item.q} className="grid gap-2 py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
              <h3 className="tp-display text-base font-semibold tracking-tight text-[var(--tp-text)]">
                {item.q}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--tp-text-muted)]">{item.a}</p>
            </div>
          ))}
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
