import { DocsLayoutClient } from '@/components/docs/DocsLayoutClient'
import { source } from '@/lib/source'
import type { ReactNode } from 'react'

/**
 * Docs chrome: server layout passes the page tree + children into the client
 * `DocsLayout` boundary. Children (MDX / DocsPage) are SSR'd into the initial
 * HTML — do not wrap them in a mount gate. Sidebar collapse stays off to avoid
 * Radix Collapsible hydration mismatches on the critical path.
 *
 * `nav.title` fills Fumadocs' nav-title slot. Without it the sidebar header and
 * the mobile `#nd-subnav` each rendered an empty `<a href="/">`, leaving the
 * phone docs bar as two unlabelled icons floating on the right.
 */
export default function MainDocsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DocsLayoutClient
      tree={source.getPageTree()}
      nav={{ title: 'TurboPanel Docs', url: '/docs' }}
      sidebar={{ collapsible: false }}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </DocsLayoutClient>
  )
}
