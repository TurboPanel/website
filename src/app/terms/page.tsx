import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { MarketingPageShell } from '@/components/marketing/MarketingPageShell'
import { MarketingSection, MarketingSectionHeader } from '@/components/marketing/marketing-primitives'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing use of the TurboPanel hosted service.',
}

const LAST_UPDATED = '2026-09-12'

function H3({ children }: Readonly<{ children: React.ReactNode }>) {
  return <h3 className="mt-8 text-lg font-semibold text-[var(--tp-text)]">{children}</h3>
}

function P({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="mt-3 text-sm leading-relaxed text-[var(--tp-text-muted)]">{children}</p>
}

export default function TermsPage() {
  return (
    <MarketingPageShell active="terms">
      <MarketingHero
        eyebrow="Legal"
        title="Terms of Service"
        description={`Last updated ${LAST_UPDATED}. These terms cover the hosted TurboPanel service at turbopanel.app. The self-hosted software is separately licensed — see below.`}
      />

      <MarketingSection className="pt-0">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--tp-amber-line,theme(colors.amber.400/40))] bg-[var(--tp-surface-muted)]/60 px-5 py-4 text-sm text-[var(--tp-text-muted)]">
          <strong className="text-[var(--tp-text)]">Draft, not legal advice.</strong> This page is a
          starting template written to match TurboPanel&apos;s actual product and licensing facts. It has
          not been reviewed by an attorney and should be before it governs real signups. Bracketed
          fields (legal entity name, registered address, governing jurisdiction) still need filling in.
        </div>

        <MarketingSectionHeader title="1. Two different things these terms cover" />
        <P>
          TurboPanel is two products under one name. <strong className="text-[var(--tp-text)]">The
          software</strong> — the control plane, the daemon, and the web UI — is open source, licensed
          under the GNU Affero General Public License v3 (AGPLv3). Downloading it, running it yourself,
          and self-hosting your own instance is governed by that license, not by these Terms; nothing
          here restricts what the AGPLv3 already permits.
        </P>
        <P>
          <strong className="text-[var(--tp-text)]">The hosted service</strong> — TurboPanel High
          Availability at <code>turbopanel.app</code>, where TurboPanel operates the control plane for
          you — is what these Terms govern. Creating an account, signing up from the waitlist, or using{' '}
          <code>turbopanel.app</code> means you agree to them.
        </P>

        <H3>2. Private alpha</H3>
        <P>
          The hosted service is in private alpha. Signup is invite- and waitlist-gated, features change
          or disappear without notice, there is no uptime commitment or service-level agreement, and
          TurboPanel may suspend, reset, or discontinue the hosted service or your access to it at any
          time. Use it for evaluation and low-stakes workloads accordingly.
        </P>

        <H3>3. Accounts</H3>
        <P>
          You must provide accurate information when creating an account and keep your credentials
          confidential. You are responsible for all activity under your account, including actions taken
          by anyone you invite into your organization. Tell us promptly at{' '}
          <a href="mailto:security@turbopanel.io" className="text-[var(--tp-accent)] hover:underline">
            security@turbopanel.io
          </a>{' '}
          if you suspect unauthorized access.
        </P>

        <H3>4. Acceptable use</H3>
        <P>
          Your use of the hosted service — including anything you deploy, host, or run through it — is
          also governed by the{' '}
          <Link href="/acceptable-use" className="text-[var(--tp-accent)] hover:underline">
            Acceptable Use Policy
          </Link>
          . Violating it is grounds for suspension or termination under Section 8.
        </P>

        <H3>5. Content you host</H3>
        <P>
          TurboPanel does not review what you deploy. You are solely responsible for the legality,
          security, and behavior of any application, container, or website you run through the hosted
          service, and for having the rights to any code, data, or content it uses.
        </P>

        <H3>6. Billing</H3>
        <P>
          Paid tiers are billed through Stripe on the cadence and terms shown at signup for that tier.
          TurboPanel does not store your card details — Stripe processes and stores payment information
          directly. Fees are non-refundable except where required by law or stated otherwise in writing.
          Failure to pay may result in suspension of the affected organization&apos;s hosted resources.
        </P>

        <H3>7. Intellectual property</H3>
        <P>
          The TurboPanel name, logo, and brand assets are owned by [Company Legal Name] and are not
          covered by the AGPLv3 license on the software. You retain all rights to the content and code
          you deploy through the service; you grant TurboPanel only the limited rights needed to operate,
          store, and display it back to you as part of providing the service.
        </P>

        <H3>8. Suspension and termination</H3>
        <P>
          TurboPanel may suspend or terminate your access to the hosted service for violating these
          Terms or the Acceptable Use Policy, for non-payment, or — during private alpha — at its
          discretion with reasonable notice where practical. You may stop using the hosted service and
          close your account at any time; self-hosted use is unaffected, since it runs under the AGPLv3
          independently of any account with us.
        </P>

        <H3>9. Disclaimer of warranties</H3>
        <P>
          THE HOSTED SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;, WITHOUT
          WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT — TO THE FULLEST EXTENT PERMITTED BY LAW. This is especially true
          during private alpha.
        </P>

        <H3>10. Limitation of liability</H3>
        <P>
          TO THE FULLEST EXTENT PERMITTED BY LAW, [COMPANY LEGAL NAME] WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS,
          OR REVENUE, ARISING FROM YOUR USE OF THE HOSTED SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF
          SUCH DAMAGES. [Aggregate liability cap language — to be set with counsel.]
        </P>

        <H3>11. Changes to these terms</H3>
        <P>
          TurboPanel may update these Terms as the product changes. Material changes will be reflected
          on this page with an updated date above; continued use of the hosted service after a change
          takes effect means you accept the revised Terms.
        </P>

        <H3>12. Governing law</H3>
        <P>
          These Terms are governed by the laws of [Jurisdiction], without regard to its conflict-of-laws
          principles. [Venue / arbitration clause — to be set with counsel.]
        </P>

        <H3>13. Contact</H3>
        <P>
          Questions about these Terms:{' '}
          <a href="mailto:legal@turbopanel.io" className="text-[var(--tp-accent)] hover:underline">
            legal@turbopanel.io
          </a>{' '}
          [confirm inbox exists before publishing], or [Company Legal Name], [Registered Address].
        </P>
      </MarketingSection>
    </MarketingPageShell>
  )
}
