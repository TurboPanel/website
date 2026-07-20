import type { ReactNode } from 'react'

/**
 * Docs shell layout. Sticky site chrome lives in the root layout.
 * DocsLayout is provided by (main)/layout.tsx; API docs render under api/.
 */
export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return children
}
