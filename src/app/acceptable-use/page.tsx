import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import { MarketingSection, MarketingSectionHeader } from '@/components/marketing/marketing-primitives'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description: 'What you can and can’t run on the TurboPanel hosted service.',
}

const LAST_UPDATED = '2026-09-12'

function H3({ children }: Readonly<{ children: React.ReactNode }>) {
  return <h3 className="mt-8 text-lg font-semibold text-[var(--tp-text)]">{children}</h3>
}

function P({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">{children}</p>
}

export default function AcceptableUsePage() {
  return (
    <MarketingPageShell active="acceptable-use">
      <MarketingHero
        eyebrow="Legal"
        title="Acceptable Use Policy"
        description={`Last updated ${LAST_UPDATED}. This applies to the hosted TurboPanel service at turbopanel.app, and to anything you deploy through it. It doesn’t apply to a self-hosted instance you run yourself — what you run on your own servers is between you and your own hosting provider.`}
      />

      <MarketingSection className="pt-0">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--tp-amber-line,theme(colors.amber.400/40))] bg-[var(--tp-surface-muted)]/60 px-5 py-4 text-sm text-[var(--tp-text-muted)]">
          <strong className="text-[var(--tp-text)]">Draft, not legal advice.</strong> A reasonable
          starting policy for a platform that lets tenants deploy arbitrary containers and websites;
          needs attorney review before it&apos;s the thing you actually enforce against a real customer.
        </div>

        <MarketingSectionHeader title="Referenced from the Terms of Service" />
        <P>
          This Acceptable Use Policy is part of the{' '}
          <Link href="/terms" className="text-[var(--tp-accent)] hover:underline">
            Terms of Service
          </Link>
          . Violating it is grounds for suspension or termination of your access to the hosted service.
        </P>

        <H3>1. No illegal content or activity</H3>
        <P>
          Don&apos;t use the hosted service to store, distribute, or run anything illegal where you or
          TurboPanel operate — including malware, phishing infrastructure, child sexual abuse material,
          or content that infringes someone else&apos;s intellectual property.
        </P>

        <H3>2. No abuse of other tenants or infrastructure</H3>
        <P>
          Don&apos;t attempt to access, disrupt, or degrade another organization&apos;s data, deployments,
          or servers; don&apos;t attempt to bypass resource limits, billing, or the organization
          boundaries the control plane enforces; don&apos;t run anything intended to disrupt the hosted
          service itself (denial-of-service traffic, resource-exhaustion attacks, credential
          stuffing).
        </P>

        <H3>3. No unauthorized security testing</H3>
        <P>
          Don&apos;t run port scans, vulnerability scans, or penetration tests against anything outside
          infrastructure you own or are explicitly authorized to test — whether the target is another
          tenant, the hosted control plane itself, or a third party. If you want to test the security of
          your <em>own</em> TurboPanel-hosted deployment, that&apos;s fine; if you find a vulnerability in
          TurboPanel itself, report it per the{' '}
          <a href="/security" className="text-[var(--tp-accent)] hover:underline">
            security page
          </a>{' '}
          instead of testing it against production.
        </P>

        <H3>4. No spam or unsolicited messaging</H3>
        <P>
          Don&apos;t use deployments on the hosted service to send unsolicited bulk email, SMS, or other
          messaging, or to operate infrastructure primarily for that purpose.
        </P>

        <H3>5. Resource use and fair use</H3>
        <P>
          Use the resources included in your tier as intended. Sustained, deliberate resource
          consumption clearly disproportionate to normal application use for your tier (for example,
          running the hosted infrastructure primarily as general-purpose compute, cryptocurrency mining,
          or a proxy/VPN service unrelated to an actual hosted application) isn&apos;t covered by that
          tier and may be throttled, billed separately, or treated as a violation.
        </P>

        <H3>6. You&apos;re responsible for what you deploy</H3>
        <P>
          TurboPanel does not pre-review deployments. You are responsible for keeping your own
          applications, containers, and dependencies reasonably secure and patched, and for responding
          promptly if we notify you that something you deployed is compromised or is being used to
          violate this policy — including by a third party who gained access to it.
        </P>

        <H3>7. Enforcement</H3>
        <P>
          Depending on severity, we may warn you, suspend the specific offending resource, suspend your
          organization, or terminate your access outright — including without advance notice for
          active abuse (ongoing attacks, illegal content, active harm to other tenants). Where practical
          we&apos;ll tell you what happened and why.
        </P>

        <H3>8. Reporting a violation</H3>
        <P>
          Think another tenant is violating this policy, or that your own deployment has been
          compromised and is being misused? Email{' '}
          <a href="mailto:abuse@turbopanel.io" className="text-[var(--tp-accent)] hover:underline">
            abuse@turbopanel.io
          </a>{' '}
          [confirm inbox exists before publishing]. Security vulnerabilities in TurboPanel itself go to
          the{' '}
          <a href="/security" className="text-[var(--tp-accent)] hover:underline">
            security page
          </a>{' '}
          instead.
        </P>

        <H3>9. Changes to this policy</H3>
        <P>
          We&apos;ll update the date above when this policy changes, and post material changes here
          before they take effect.
        </P>
      </MarketingSection>
    </MarketingPageShell>
  )
}
