'use client'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs'

/**
 * Client boundary for Fumadocs `DocsLayout` (sidebar / TOC use client hooks).
 *
 * Always render the full layout + children so SSG HTML includes the docs body.
 * Do not gate `children` behind a mounted flag — that left only a "Loading…"
 * shell in the initial HTML and defeated static generation.
 *
 * Sidebar collapse is disabled in `src/app/docs/(main)/layout.tsx`
 * (`sidebar.collapsible: false`) so Radix Collapsible `useId` hydration
 * mismatches stay off the critical path. Interactive TOC popovers remain
 * client-only inside Fumadocs and hydrate after paint without blocking content.
 */
export function DocsLayoutClient(props: Readonly<DocsLayoutProps>) {
  return <DocsLayout {...props} />
}
