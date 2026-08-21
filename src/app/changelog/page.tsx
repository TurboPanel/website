import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import {
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'
import { OPEN_SOURCE_LAUNCH_DATE } from '@/lib/site-dates'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'TurboPanel release highlights, security fixes, and upgrade notes.',
}

const ENTRIES = [
  {
    date: '2026-08-20',
    channel: 'Private alpha',
    title: 'Licensing',
    body: 'Control plane, daemon, UI, and contributor console stay AGPL-3.0-only. The UI adds an Apple App Store additional permission. The website is Apache-2.0 for code and CC BY 4.0 for documentation. Contributions use a CLA; trademarks stay separate from the software licenses.',
    links: [
      { href: '/open-source', label: 'Open source' },
      { href: '/about/logo', label: 'Logo & brand' },
    ],
  },
  {
    date: OPEN_SOURCE_LAUNCH_DATE,
    channel: 'Private alpha',
    title: 'Open-source launch packaging',
    body: 'Unified public naming, AGPL-3.0-only across repos, self-hosted documentation, and community routing via turbopanel/.github.',
    links: [
      { href: '/open-source', label: 'Open source' },
      { href: '/docs/deployment/compatibility', label: 'Compatibility' },
    ],
  },
] as const

export default function ChangelogPage() {
  return (
    <MarketingPageShell active="changelog">
      <MarketingHero
        eyebrow="Changelog"
        title="Release highlights and upgrade notes"
        description="Human-written summaries — not commit dumps. Pair with GitHub Releases for artifacts and checksums."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <MarketingSecondaryCta href="https://github.com/TurboPanel/turbopanel/releases">
            GitHub Releases
          </MarketingSecondaryCta>
          <MarketingSecondaryCta href="/security">Security advisories</MarketingSecondaryCta>
        </div>
      </MarketingHero>

      <MarketingSection>
        <MarketingSectionHeader
          title="Recent entries"
          description="Subscribe to GitHub release notifications for security fixes and stable channel promotions."
        />
        <div className="space-y-8">
          {ENTRIES.map((entry) => (
            <article
              key={entry.title}
              className="rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-6"
            >
              <p className="font-mono text-xs text-[var(--tp-text-muted)]">
                {entry.date} · {entry.channel}
              </p>
              <h2 className="tp-display mt-2 text-xl font-semibold text-[var(--tp-text)]">{entry.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">{entry.body}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {entry.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-[var(--tp-accent)] hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
