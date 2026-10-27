import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import {
  MarketingCard,
  MarketingSection,
  MarketingSectionHeader,
} from '@/components/marketing/marketing-primitives'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description:
    'Plain-language rules for the hosted TurboPanel service: build freely, keep it lawful, and share fairly.',
}

const LINK = 'text-[var(--tp-accent)] hover:underline'
const BODY = 'text-sm leading-relaxed text-[var(--tp-text-muted)]'

const PRINCIPLES = [
  {
    title: 'Build freely',
    body: 'Run your apps, sites, databases and containers your way. We don’t review deployments before they go live.',
  },
  {
    title: 'Keep it lawful',
    body: 'Nothing illegal, nothing that harms people, nothing that infringes someone else’s work.',
  },
  {
    title: 'Share fairly',
    body: 'Everyone on the hosted service shares real hardware. Don’t take more than your plan is meant to give you.',
  },
] as const

type Rule = Readonly<{
  id: string
  title: string
  summary: string
  body: React.ReactNode
}>

const RULES: ReadonlyArray<Rule> = [
  {
    id: 'lawful',
    title: 'Keep it lawful',
    summary: 'No illegal content or activity.',
    body: (
      <p>
        Don’t use the hosted service to store, distribute, or run anything that’s illegal where you
        or TurboPanel operate. That includes malware, phishing infrastructure, child sexual abuse
        material, and content that infringes someone else’s intellectual property.
      </p>
    ),
  },
  {
    id: 'neighbours',
    title: 'Respect your neighbours',
    summary: 'Don’t reach into, or degrade, anyone else’s environment.',
    body: (
      <>
        <p>
          Don’t try to access, disrupt, or degrade another organization’s data, deployments, or
          servers. Don’t try to get around resource limits, billing, or the organization boundaries
          the control plane enforces.
        </p>
        <p>
          And don’t run anything meant to disrupt the hosted service itself: denial-of-service
          traffic, resource-exhaustion attacks, credential stuffing, and the like.
        </p>
      </>
    ),
  },
  {
    id: 'security-testing',
    title: 'Test only what’s yours',
    summary: 'Security testing needs authorization.',
    body: (
      <>
        <p>
          Don’t run port scans, vulnerability scans, or penetration tests against anything you don’t
          own or aren’t explicitly authorized to test. That covers other customers, the hosted
          control plane, and third parties alike.
        </p>
        <p>
          Testing the security of <em>your own</em> TurboPanel-hosted deployment is fine. If you
          find a vulnerability in TurboPanel itself, please report it through our{' '}
          <Link href="/security" className={LINK}>
            security page
          </Link>{' '}
          rather than testing it against production. We’ll thank you for it.
        </p>
      </>
    ),
  },
  {
    id: 'spam',
    title: 'No spam',
    summary: 'No unsolicited bulk messaging.',
    body: (
      <p>
        Don’t use deployments on the hosted service to send unsolicited bulk email, SMS, or other
        messages, or to run infrastructure whose main purpose is doing so.
      </p>
    ),
  },
  {
    id: 'fair-use',
    title: 'Use resources fairly',
    summary: 'Use what your plan includes, as intended.',
    body: (
      <p>
        Your plan includes resources so you can run real applications. Sustained, deliberate usage
        far beyond what a normal application needs, such as using the infrastructure mainly as
        general-purpose compute, mining cryptocurrency, or running a proxy or VPN service unrelated
        to a hosted application, isn’t covered by your plan. We may throttle it, bill it separately,
        or treat it as a violation.
      </p>
    ),
  },
  {
    id: 'responsibility',
    title: 'Own what you deploy',
    summary: 'Keep your apps secure and respond when we reach out.',
    body: (
      <p>
        TurboPanel doesn’t pre-review deployments, so what you run is your responsibility. Keep your
        applications, containers, and dependencies reasonably secure and patched. If we tell you
        something you deployed is compromised or is being used to break this policy, including by a
        third party who got access to it, please respond promptly.
      </p>
    ),
  },
]

const TOC = [
  ...RULES.map((r) => ({ id: r.id, title: r.title })),
  { id: 'enforcement', title: 'How we enforce this' },
  { id: 'report', title: 'Reporting a violation' },
  { id: 'changes', title: 'Changes to this policy' },
]

function RuleCard({ rule, index }: Readonly<{ rule: Rule; index: number }>) {
  return (
    <MarketingCard id={rule.id} className="scroll-mt-28">
      <div className="flex items-start gap-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--tp-border)] bg-[var(--tp-surface-muted)] font-mono text-sm font-semibold text-[var(--tp-accent)]"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--tp-text)]">{rule.title}</h3>
          <p className="mt-1 text-sm font-medium text-[var(--tp-text)]/80">{rule.summary}</p>
          <div className={`mt-3 space-y-3 ${BODY}`}>{rule.body}</div>
        </div>
      </div>
    </MarketingCard>
  )
}

export default function AcceptableUsePage() {
  return (
    <MarketingPageShell active="aup">
      <MarketingHero
        eyebrow="Legal"
        title="Acceptable Use Policy"
        description="A short set of ground rules that keeps the hosted TurboPanel service fast, safe, and fair for everyone on it."
      />

      <MarketingSection className="pt-0">
        <div className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-[var(--tp-text-muted)]">
            This policy applies to the hosted TurboPanel service at turbopanel.app and to everything
            you deploy through it. It’s part of our{' '}
            <Link href="/terms" className={LINK}>
              Terms of Service
            </Link>
            . It doesn’t apply to a self-hosted instance you run yourself; what you run on your own
            servers is between you and your own hosting provider.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <MarketingCard key={p.title} accent>
                <h2 className="text-base font-semibold text-[var(--tp-text)]">{p.title}</h2>
                <p className={`mt-2 ${BODY}`}>{p.body}</p>
              </MarketingCard>
            ))}
          </div>

          <nav
            aria-label="On this page"
            className="mt-10 rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)] px-5 py-4"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tp-text-muted)]">
              On this page
            </p>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={LINK}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </MarketingSection>

      <MarketingSection className="pt-0">
        <div className="mx-auto max-w-3xl">
          <MarketingSectionHeader eyebrow="The rules" title="What we ask of you" />
          <div className="space-y-4">
            {RULES.map((rule, i) => (
              <RuleCard key={rule.id} rule={rule} index={i} />
            ))}
          </div>

          <div className="mt-16">
            <MarketingSectionHeader
              eyebrow="When things go wrong"
              title="Enforcement and reporting"
            />
            <div className="space-y-4">
              <MarketingCard id="enforcement" className="scroll-mt-28">
                <h3 className="text-lg font-semibold text-[var(--tp-text)]">How we enforce this</h3>
                <p className={`mt-3 ${BODY}`}>
                  We respond in proportion to what happened. Depending on severity, we may warn you,
                  suspend the specific resource involved, suspend your organization, or end your
                  access. For active abuse such as ongoing attacks, illegal content, or active harm
                  to other customers, we may act without advance notice. Wherever we can, we’ll tell
                  you what happened and why.
                </p>
              </MarketingCard>

              <MarketingCard id="report" className="scroll-mt-28">
                <h3 className="text-lg font-semibold text-[var(--tp-text)]">
                  Reporting a violation
                </h3>
                <p className={`mt-3 ${BODY}`}>
                  If you think another customer is breaking this policy, or that your own deployment
                  has been compromised and is being misused, email{' '}
                  <a href="mailto:abuse@turbopanel.io" className={LINK}>
                    abuse@turbopanel.io
                  </a>
                  . Vulnerabilities in TurboPanel itself belong on the{' '}
                  <Link href="/security" className={LINK}>
                    security page
                  </Link>{' '}
                  instead.
                </p>
              </MarketingCard>

              <MarketingCard id="changes" className="scroll-mt-28">
                <h3 className="text-lg font-semibold text-[var(--tp-text)]">
                  Changes to this policy
                </h3>
                <p className={`mt-3 ${BODY}`}>
                  When this policy changes, we’ll update the date at the top of the page and post
                  material changes here before they take effect.
                </p>
              </MarketingCard>
            </div>
          </div>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  )
}
