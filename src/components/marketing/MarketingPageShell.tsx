import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader, type ActivePage } from '@/components/marketing/SiteHeader'

type MarketingPageShellProps = Readonly<{
  active: ActivePage
  children: ReactNode
}>

export function MarketingPageShell({ active, children }: MarketingPageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--tp-bg)] text-[var(--tp-text)]">
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
