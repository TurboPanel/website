import type { ReactNode } from 'react'

/**
 * API docs layout. SiteHeader is rendered by docs/layout.tsx.
 */
export default function ApiDocsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}
