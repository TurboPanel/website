import { DocsLayoutClient } from '@/components/docs/DocsLayoutClient'
import { source } from '@/lib/source'
import type { ReactNode } from 'react'

export default function MainDocsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DocsLayoutClient tree={source.getPageTree()} sidebar={{ collapsible: false }}>
      {children}
    </DocsLayoutClient>
  )
}
