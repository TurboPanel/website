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

type ChangelogEntry = {
  date: string
  channel: string
  title: string
  body: string
  /** Optional grouped highlights, written for what a site owner or organization owner notices. */
  sections?: readonly { heading: string; items: readonly string[] }[]
  links: readonly { href: string; label: string }[]
}

const ENTRIES: readonly ChangelogEntry[] = [
  {
    // Drafted ahead of the tag; the date is filled in when 0.2.x is published. Written for what is
    // merged on trunk, not for open pull requests.
    date: 'Unreleased',
    channel: 'Private alpha · 0.2.x release candidate',
    title: 'TurboPanel 0.2.x',
    body: 'A new project and environment editor in the web app, a deploy you can cancel, certificates in one click, more ways to serve a site (four web engines and three PHP modes), a much tighter separation between site owners on a server, and a firewall you can preview before anything is applied.',
    sections: [
      {
        heading: 'The project and environment editor',
        items: [
          'Projects home: one card per project, the projects you opened recently, and deploys in progress.',
          'A project has Environments, Base and Settings tabs. An environment has Overview, Deployments, Configuration and Settings tabs under one header.',
          'The Base is the compose document that environments share. The Environments tab shows it first, then one card per environment: what is running now, the last deploy, a small map, the git branch, the server, and whether it "Follows the Base" with a number of changes or "Stands alone". New environment starts from the Base or from nothing and asks for a server.',
          'Environment Overview draws the map of the environment, lists its services and latest deploys, and shows the "Changes from Base" card. The map is in the web app; the phone keeps its earlier Overview.',
          'Configuration shows what an environment really runs, with a switch for only the changes from the Base, and lets you edit and save. The merged result is checked before it is saved, so a change that could not deploy is refused up front. The Base tab edits the shared compose document.',
          'New Navy and Paper looks, with a Light, Dark or Match switcher.',
        ],
      },
      {
        heading: 'Deploying and running',
        items: [
          'Cancel a deploy that is queued or running. It stops every server of that deploy, including servers still waiting their turn; once a deploy has switched over it can no longer be cancelled.',
          'A failed deploy or command shows the line that says why, including which step of a server setup failed.',
          'Each service shows whether it is running, starting or stopped. Crash handling is not part of this release.',
          'A new environment deploys one step at a time: stop the old version, start the new one, wait for every service to be healthy, and roll back on its own if it is not. Deployment history says Sequential or In place, and Rolled back or Needs attention when a deploy did not finish. The strategy and the number of servers updated at once are set through the API; there is no screen for them yet.',
          'Each environment picks its git branch, a push deploys the environments that build that branch, and history shows which push started a deploy.',
          'A Node app receives the variables you set on it in its running process, and the app lists where each variable comes from. Node 26 is offered, and pnpm comes with every Node series. Secret site variables are sent to the server sealed.',
          'WordPress sites are recognised and tagged, and the app warns when their database cannot work. Deleting an environment that has services asks you to stop it first and names what will go.',
          'Every environment is its own Docker Compose project, so two environments cannot trip over each other on one server. Server status data carries a release link check from each server; there is no screen for it yet.',
        ],
      },
      {
        heading: 'Domains and certificates',
        items: [
          'One-click Let\'s Encrypt for each domain. The app checks DNS first and shows the certificate state (test certificate, issuing, ready, renewal failed); the expiry date is recorded from the server.',
          '"Also redirect www to this domain" serves the www name as a permanent redirect.',
          'The Hosting tab lets you pick a hostname and shows only that hostname\'s settings.',
        ],
      },
      {
        heading: 'Sites, web engines and PHP',
        items: [
          'Sites can be served by Caddy, nginx, Apache or OpenLiteSpeed, or by nginx in front of Apache.',
          'PHP runs in one of three modes: FastCGI (the default), php-fpm, or OpenLiteSpeed\'s lsphp as a process of its own. Every site\'s PHP runs as the site owner\'s Linux user, with its own memory limit.',
          'An organization owner or manager chooses which PHP modes the organization offers and can narrow that for each server. A site picks its mode in the visual editor or in its compose document; a mode the policy does not allow stops the deploy with a clear message.',
          'Remote build sources (building from an address on the internet) are off until the organization allows them, and risky build options in a compose document are refused.',
          'A site owner\'s Linux user can be named in plain, partial or random form, with an organization default that can be locked.',
        ],
      },
      {
        heading: 'Keeping site owners apart',
        items: [
          'Root owns a site owner\'s home folder and the folders that hold published releases. The owner writes only to their own folders (home, data, tmp, and each site\'s webroot and shared folders), so a release cannot be changed after it is published.',
          'Native and static builds run in a sandbox as an unprivileged build user with public internet access only, 4 GB of memory, 2 CPUs and 30 minutes, one build at a time per server.',
          'SSH keys are managed by the app and keys placed in a home folder are ignored; port forwarding is off. Files-only owners can be locked into their own home with an SFTP jail, which is off by default and turned on for one server at a time by an operator.',
          'The web servers run as their own unprivileged accounts, and a link inside one site is followed only when its owner matches the file it points to.',
          'The Docker gate is installed wherever Docker runs on a managed server. It is in observe mode: it records what it would refuse and blocks nothing yet.',
        ],
      },
      {
        heading: 'Firewall',
        items: [
          'Firewall pages for the organization policy, your own rules, and each server\'s mode and preview. Nothing is applied to a server unless an operator opts that one server in.',
          'When a firewall is applied, a safety net rolls it back unless the server confirms it still works, and it is restored after a reboot. Saving an SSH list that leaves you out is warned about and refused.',
        ],
      },
      {
        heading: 'Databases, storage and backups',
        items: [
          'Scheduled and on-demand backups for storage copies, with restore and delete from the app, and a schedules panel for managed databases of all three engines.',
          'A managed Postgres can fail over to a failover replica on its own when the primary is found dead; recoveries no longer leave a cluster stuck.',
        ],
      },
      {
        heading: 'Organizations, people and notifications',
        items: [
          'The Activity page lists deploy work across the whole organization, running and recently failed.',
          'A Members screen with Remove and Leave, a Change password screen with a breached-password check, and an organization setting that asks people to confirm it is them before permanent actions (off by default).',
          'Email notification channels confirm their address from an emailed link, and every channel can use a digest and quiet hours. A critical event is never held back by either. Failed emails are retried later and then set aside.',
          'Plain-language reasons for failed updates, billing refusals and other errors across the app.',
        ],
      },
      {
        heading: 'Updates and billing',
        items: [
          'Updates name the version and the piece being updated, show a calm reconnecting state while the control plane restarts, and update one server at a time by default; an environment can start more at once. A server already on the target build no longer shows a stale update error.',
          'The capacity pages say server limit. A server limit change checks its proration date first, spare larger server slots follow the recommended size, a refusal to remove a license says how many are in use, and a past-due subscription ends on Stripe\'s own retry schedule.',
        ],
      },
      {
        heading: 'Reliability and safety',
        items: [
          'Many reliability and safety improvements to builds, hosting, sign-in, notifications and updates across the control plane, daemon and web app, with no change to how you use them.',
        ],
      },
    ],
    links: [
      { href: '/docs/using/projects', label: 'Projects' },
      { href: '/docs/using/deploy', label: 'Deploying' },
      { href: '/docs/using/hosting', label: 'Hosting' },
      { href: '/docs/using/php', label: 'PHP modes' },
      { href: '/docs/using/firewall', label: 'Firewall' },
      { href: '/docs/security/site-isolation', label: 'Site owner isolation' },
      { href: '/docs/deployment/upgrade', label: 'Upgrade & rollback' },
    ],
  },
  {
    // Drafted ahead of the tag; the date is filled in when v0.1.0 is published.
    date: 'Unreleased',
    channel: '0.1.0 release candidate',
    title: 'TurboPanel 0.1.0',
    body: 'The first packaged release. Self-hosted installs from a single command (curl -fsSL turbopanel.sh | sh) that pulls signed-off packages from GitHub Releases, verifies each against its manifest, converges the host and hands off to the install wizard; the same command with a license enrols a server. Sign in with a passkey or TOTP second factor, or with GitHub or Google; invite teammates by email with a capped grant. Automatic HTTPS for hosted sites through Caddy\'s built-in ACME client, off by default per organization; instance TLS as self-signed, uploaded or Let\'s Encrypt. Git-backed projects connect through a GitHub App or GitLab OAuth, with an installation bound to one organization and forge addresses inside your network refused. Managed Postgres and MySQL engines with users, backups and shared ingress; TurboFabric overlay networks; datacenter networking with reserved ranges, routing policy and Docker address pools. Scheduled tasks from the console and from compose, rendered as systemd timers. Host metrics v6 across eight entity families. Every wire carries a version and a floor: a daemon below 0.1.0 keeps its connection but runs no commands until it updates; the app refuses an older instance and says which version it needs. Workers-only billing with a product-keyed tier ladder. The database schema is frozen at one baseline: every later migration is additive, the installer applies them with the instance\'s own migrate verb, and the instance refuses to serve a schema it does not ship.',
    links: [
      { href: '/docs/getting-started/installation', label: 'Install' },
      { href: '/docs/deployment/upgrade', label: 'Upgrade & rollback' },
      { href: '/docs/deployment/compatibility', label: 'Compatibility' },
      { href: '/docs/deployment/security', label: 'Security' },
    ],
  },
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
]

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
