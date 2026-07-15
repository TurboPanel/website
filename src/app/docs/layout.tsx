import type { CSSProperties, ReactNode } from 'react'
import { SiteHeader } from '@/components/marketing/SiteHeader'

/**
 * Docs shell layout. DocsLayout is provided by (main)/layout.tsx and api/layout.tsx.
 */
export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div style={{ '--fd-nav-height': '64px' } as CSSProperties}>
      <SiteHeader active="docs" />
      {children}
    </div>
  )
}
