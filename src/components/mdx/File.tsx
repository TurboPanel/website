'use client'

import type { ReactNode } from 'react'

interface FileProps {
  path: string
  children?: ReactNode
  href?: string
}

const GITHUB_BASE = 'https://github.com/turbopanel/turbopanel/blob/main'

export function File({ path, children, href }: FileProps) {
  const displayPath = children ?? path
  const linkHref =
    href ?? (path.startsWith('/') ? `${GITHUB_BASE}${path}` : `${GITHUB_BASE}/${path}`)

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
