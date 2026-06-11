'use client'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs'
import { useEffect, useState } from 'react'

/**
 * Renders a minimal shell until after mount, then the full DocsLayout.
 * - Radix UI Collapsible (sidebar/TOC) uses useId() and can cause hydration
 *   mismatches between server and client with React 19 / Next 16.
 * - DocsPage and other Fumadocs components use LayoutContext; that context
 *   is only provided by DocsLayout, so we must not render props.children
 *   until we're inside the real layout (avoids "Cannot destructure
 *   isNavTransparent from null").
 * So we show a loading state until mounted, then render the full layout.
 */
export function DocsLayoutClient(props: Readonly<DocsLayoutProps>) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        id="nd-docs-layout"
        className="grid min-h-[var(--fd-docs-height,100dvh)] transition-[grid-template-columns] duration-200 ease-out"
        style={{ ['--fd-docs-height' as string]: '100dvh' }}
      >
        <div className="flex min-h-[50vh] items-center justify-center text-fd-muted-foreground">
          Loading…
        </div>
      </div>
    )
  }

  return <DocsLayout {...props} />
}
