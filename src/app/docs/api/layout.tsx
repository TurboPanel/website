import type { ReactNode } from 'react'

/**
 * API docs layout. Sticky site chrome lives in the root layout.
 */
export default function ApiDocsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}
