import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import { MarketingSecondaryCta } from '@/components/marketing/MarketingPrimaryCta'
import {
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'
import entries from './entries.json'
import { OPEN_SOURCE_LAUNCH_DATE } from '@/lib/site-dates'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'TurboPanel release highlights, security fixes, and upgrade notes.',
}

type ChangelogEntry = {
  /** Omitted for the open-source launch entry, which takes OPEN_SOURCE_LAUNCH_DATE. */
  date?: string
  channel: string
  title: string
  body: string
  /** Optional grouped highlights, written for what a site owner or organization owner notices. */
  sections?: readonly { heading: string; items: readonly string[] }[]
  links: readonly { href: string; label: string }[]
}

// The release-notes copy lives in entries.json so this file only renders it. Entries dated
// "Unreleased" are drafted ahead of the tag (the date is filled in when the release is published)
// and written for what is merged on trunk, not for open pull requests.
const ENTRIES = entries as readonly ChangelogEntry[]

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
                {entry.date ?? OPEN_SOURCE_LAUNCH_DATE} · {entry.channel}
              </p>
              <h2 className="tp-display mt-2 text-xl font-semibold text-[var(--tp-text)]">{entry.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">{entry.body}</p>
              {entry.sections?.map((section) => (
                <div key={section.heading} className="mt-5">
                  <h3 className="text-sm font-semibold text-[var(--tp-text)]">{section.heading}</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--tp-text-muted)]">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
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
