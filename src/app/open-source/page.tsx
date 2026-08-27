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
    'TurboPanel repositories, licenses, third-party notices, self-hosting scope, and trademark policy.',
}

type RepoRow = {
  name: string
  slug: string
  role: string
  license: string
  licenseNote?: string
  noticesHref: string
  noticesLabel: string
}

const REPOS: readonly RepoRow[] = [
  {
    name: 'TurboPanel Control Plane',
    slug: 'turbopanel',
    role: 'API, auth, orchestration hub, daemon cell',
    license: 'AGPL-3.0-only',
    noticesHref: 'https://github.com/TurboPanel/turbopanel/blob/trunk/THIRD_PARTY_NOTICES.md',
    noticesLabel: 'Current development (trunk)',
  },
  {
    name: 'TurboPanel Daemon',
    slug: 'turbopaneld',
    role: 'Host daemon, Ansible, deploy runtime, metrics',
    license: 'AGPL-3.0-only',
    noticesHref: 'https://github.com/TurboPanel/turbopaneld/blob/trunk/THIRD_PARTY_NOTICES.md',
    noticesLabel: 'Current development (trunk)',
  },
  {
    name: 'TurboPanel UI',
    slug: 'ui',
    role: 'Signed-in product console (Expo / Tamagui)',
    license: 'AGPL-3.0-only',
    licenseNote: 'with Apple App Store additional permission',
    noticesHref: 'https://github.com/TurboPanel/ui/blob/trunk/THIRD_PARTY_NOTICES.md',
    noticesLabel: 'Current development (trunk)',
  },
  {
    name: 'TurboPanel Development Environment',
    slug: 'dev',
    role: 'Contributor dev console (not production install)',
    license: 'AGPL-3.0-only',
    noticesHref: 'https://github.com/TurboPanel/dev/blob/trunk/THIRD_PARTY_NOTICES.md',
    noticesLabel: 'Current development (trunk)',
  },
  {
    name: 'TurboPanel Website & Docs',
    slug: 'website',
    role: 'Marketing site and documentation source',
    license: 'Apache-2.0 / CC BY 4.0',
    licenseNote: 'code / documentation',
    noticesHref: 'https://github.com/TurboPanel/website/blob/trunk/THIRD_PARTY_NOTICES.md',
    noticesLabel: 'Current development (trunk)',
  },
]

const FAQ = [
  {
    q: 'Can I use TurboPanel commercially?',
    a: 'Yes. The control plane, daemon, product UI, and contributor console are AGPL-3.0-only. If you modify that software and run it as a network service users interact with, you must offer corresponding source to those users. The website is Apache-2.0 (code) and CC BY 4.0 (documentation).',
  },
  {
    q: 'Does self-hosted include the full product?',
    a: 'Yes — by design, self-hosted operators run the same control plane, UI, and daemon stack as TurboPanel High Availability, with the difference being who operates the control-plane infrastructure. Both paths are currently in private alpha and not yet publicly available.',
  },
  {
    q: 'Can I redistribute TurboPanel?',
    a: 'Yes, under the license of each repository, including corresponding source where AGPL requires it. App Store copies of the UI are also covered by the Apple App Store additional permission in that repository. That permission applies only to material TurboPanel has authority to license — not third-party components or marks. Do not imply endorsement or use TurboPanel trademarks beyond what the license and brand guidelines allow.',
  },
  {
    q: 'Do third-party components use TurboPanel’s license?',
    a: 'No. Components shipped inside TurboPanel artifacts keep their own copyright and license terms. Use the THIRD_PARTY_NOTICES.md that shipped with that release, tag, or exact git revision — not the current trunk file. Packaged daemon releases stage the matching file at /opt/turbopanel/share/THIRD_PARTY_NOTICES.md. The website keeps a first-party NOTICE in addition to generated third-party notices.',
  },
  {
    q: 'Are third-party marks covered by TurboPanel licenses?',
    a: 'No. TurboPanel’s licenses and the UI App Store additional permission never grant rights in third-party trademarks or artwork. OS identity marks (for example the Debian swirl) are recorded in the UI repository’s assets/os/NOTICE.md and remain under their original terms.',
  },
  {
    q: 'Where is source for a published UI build?',
    a: 'Each store binary and production update publishes corresponding source for that exact revision. Native Settings → About names the license, version, and source URL for the git revision baked into that build — not the trunk branch.',
  },
  {
    q: 'Where is source for a deployed control plane?',
    a: 'GET /api/health returns the license and a revision object with commit and sourceUrl. sourceUrl points at the exact git tree for that revision, not trunk.',
  },
] as const

export default function OpenSourcePage() {
  return (
    <MarketingPageShell active="open-source">
      <MarketingHero
        eyebrow="Open source"
        title="Same product. Your choice of operator."
        description="TurboPanel's control plane, daemon, and product UI are open source under AGPL-3.0-only. Self-host the full stack or use TurboPanel High Availability — the console and APIs are the same."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="/docs/deployment/self-hosted">
            Preview self-hosted docs
          </MarketingSecondaryCta>
          <MarketingControlPlaneCta path="/sign-up" emphasis={false}>
            Join the waitlist
          </MarketingControlPlaneCta>
        </div>
      </MarketingHero>

      <MarketingSection>
        <MarketingSectionHeader
          eyebrow="License"
          title="How each repository is licensed"
        />
        <div className="overflow-x-auto rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="bg-[var(--tp-surface-muted)]/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Repository</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">License</th>
                <th className="px-5 py-4 font-semibold text-[var(--tp-text)]">Current notices (trunk)</th>
              </tr>
            </thead>
            <tbody>
              {REPOS.map((repo) => (
                <tr key={repo.slug} className="border-t border-[var(--tp-border)]">
                  <td className="px-5 py-4">
                    <a
                      href={`https://github.com/TurboPanel/${repo.slug}`}
                      className="font-medium text-[var(--tp-text)] hover:text-[var(--tp-accent)]"
                    >
                      TurboPanel/{repo.slug}
                    </a>
                    <p className="mt-1 text-[var(--tp-text-muted)]">{repo.role}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[var(--tp-text-muted)]">
                    {repo.license}
                    {repo.licenseNote ? (
                      <p className="mt-1 font-sans text-[var(--tp-text-muted)]">{repo.licenseNote}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={repo.noticesHref}
                      className="font-mono text-[var(--tp-accent)] hover:underline"
                    >
                      {repo.noticesLabel}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--tp-text-muted)]">
          Third-party components shipped inside TurboPanel artifacts keep their own
          licenses; the notices column is the current-development file on{' '}
          <span className="font-mono">trunk</span>, not a relicense and not the
          notices for a shipped artifact. For a release, use the{' '}
          <span className="font-mono">THIRD_PARTY_NOTICES.md</span> that shipped
          with that tag, commit, or packaged artifact — packaged daemon releases
          stage it at{' '}
          <span className="font-mono">/opt/turbopanel/share/THIRD_PARTY_NOTICES.md</span>
          {'. '}
          Community health files in{' '}
          <a href="https://github.com/TurboPanel/.github" className="text-[var(--tp-accent)] hover:underline">
            turbopanel/.github
          </a>
          {' '}use the path-based map in{' '}
          <a
            href="https://github.com/TurboPanel/.github/blob/trunk/LICENSES/README.md"
            className="text-[var(--tp-accent)] hover:underline"
          >
            LICENSES/README.md
          </a>
          {'. Contributions are accepted under the '}
          <a
            href="https://github.com/TurboPanel/.github/blob/trunk/CLA.md"
            className="text-[var(--tp-accent)] hover:underline"
          >
            Contributor License Agreement
          </a>
          {'. The full model is in '}
          <Link href="/docs/getting-started/licensing" className="text-[var(--tp-accent)] hover:underline">
            Licensing
          </Link>
          {'.'}
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
                href={`https://github.com/TurboPanel/${repo.slug}`}
                className="font-medium text-[var(--tp-accent)] hover:underline"
              >
                {repo.name}
              </Link>
              <span className="text-[var(--tp-text-muted)]"> — {repo.role}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="/docs/getting-started/licensing">Licensing</MarketingSecondaryCta>
          <MarketingSecondaryCta href="/docs/deployment/self-hosted">Preview self-hosted docs</MarketingSecondaryCta>
          <MarketingSecondaryCta href="https://github.com/TurboPanel/turbopanel/releases">
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
        <div className="space-y-4 text-sm leading-relaxed text-[var(--tp-text-muted)]">
          <p>
            Open-source licenses do not grant permission to use the TurboPanel name,
            logos, or other trademarks. You may accurately state that a product is
            based on, compatible with, or derived from TurboPanel. Modified
            distributions must not use the TurboPanel name, logos, or trade dress in
            a way that suggests they are official TurboPanel products without prior
            written permission.
          </p>
          <p>
            Third-party marks are never covered by TurboPanel’s licenses or by the
            UI App Store additional permission. OS identity artwork stays under
            its original copyright, license, and trademark terms — see{' '}
            <a
              href="https://github.com/TurboPanel/ui/blob/trunk/assets/os/NOTICE.md"
              className="text-[var(--tp-accent)] hover:underline"
            >
              assets/os/NOTICE.md
            </a>
            {' '}
            in the UI repository.
          </p>
          <p>
            See <Link href="/about/logo" className="text-[var(--tp-accent)] hover:underline">Logo & brand</Link>
            {' '}
            for download links, clear space, and do-not rules, and{' '}
            <a
              href="https://github.com/TurboPanel/.github/blob/trunk/TRADEMARKS.md"
              className="text-[var(--tp-accent)] hover:underline"
            >
              TRADEMARKS.md
            </a>
            {' '}
            for the trademark policy.
          </p>
        </div>
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
