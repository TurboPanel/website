'use client'

import type { ReactNode } from 'react'
import { docsGithubBlobUrl } from '@/lib/docs-github'

interface FileProps {
  path: string
  children?: ReactNode
  href?: string
}

export function File({ path, children, href }: FileProps) {
  const displayPath = children ?? path
  const linkHref = href ?? docsGithubBlobUrl(path)

  return (
    <code className="fd-file inline-flex items-center gap-1.5 rounded-md bg-fd-secondary px-2 py-1 text-sm font-mono text-fd-foreground">
      <FileIcon path={path} />
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fd-primary hover:underline"
      >
        {displayPath}
      </a>
    </code>
  )
}

function FileIcon({ path }: { path: string }) {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  const iconMap: Record<string, string> = {
    ts: '📄',
    tsx: '📄',
    js: '📄',
    jsx: '📄',
    json: '📋',
    mdx: '📝',
    md: '📝',
    css: '🎨',
    mjs: '📄',
    sql: '🗄️',
  }
  const icon = iconMap[ext] ?? '📁'
  return <span aria-hidden>{icon}</span>
}
