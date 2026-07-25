import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import type { ActivePage } from '@/components/marketing/SiteHeader'

type MarketingPageShellProps = Readonly<{
  /** Kept for call-site clarity; sticky chrome resolves active from the pathname. */
  active: ActivePage
  children: ReactNode
}>

export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="tp-marketing-canvas min-h-screen text-[var(--tp-text)]">
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
