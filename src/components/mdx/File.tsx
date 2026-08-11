'use client'

import type { ReactNode } from 'react'
import { docsGithubBlobUrl } from '@/lib/docs-github'

type FileProps = Readonly<{
  path: string
  children?: ReactNode
  href?: string
}>

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

function FileIcon({ path }: Readonly<{ path: string }>) {
  const kind = resolveFileIconKind(path)

  return (
    <svg
      className="size-3.5 shrink-0 text-[var(--tp-text-muted)]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {kind === 'folder' ? <FolderGlyph /> : null}
      {kind === 'document' ? <DocumentGlyph /> : null}
      {kind === 'config' ? <ConfigGlyph /> : null}
      {kind === 'markdown' ? <MarkdownGlyph /> : null}
      {kind === 'style' ? <StyleGlyph /> : null}
      {kind === 'database' ? <DatabaseGlyph /> : null}
    </svg>
  )
}

type FileIconKind = 'folder' | 'document' | 'config' | 'markdown' | 'style' | 'database'

function resolveFileIconKind(path: string): FileIconKind {
  const normalized = path.trim()

  if (!normalized || normalized === '.' || normalized === '..') {
    return 'folder'
  }

  if (normalized.endsWith('/')) {
    return 'folder'
  }

  const basename = normalized.split('/').pop() ?? normalized

  if (!basename || basename === '.' || basename === '..') {
    return 'folder'
  }

  const dotIndex = basename.lastIndexOf('.')

  if (dotIndex <= 0) {
    return 'folder'
  }

  const ext = basename.slice(dotIndex + 1).toLowerCase()

  if (ext === 'json') return 'config'
  if (ext === 'md' || ext === 'mdx') return 'markdown'
  if (ext === 'css') return 'style'
  if (ext === 'sql') return 'database'
  if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx' || ext === 'mjs') {
    return 'document'
  }

  return 'folder'
}

function FolderGlyph() {
  return (
    <>
      <path d="M2 4.5h4.5L8 6h6v7.5H2z" />
      <path d="M2 4.5V12.5" />
    </>
  )
}

function DocumentGlyph() {
  return (
    <>
      <path d="M5 2.5h4.5L12 5v8.5H5z" />
      <path d="M9.5 2.5V5H12" />
      <path d="M7 8.5h4M7 10.5h4" />
    </>
  )
}

function ConfigGlyph() {
  return (
    <>
      <path d="M5 2.5h4.5L12 5v8.5H5z" />
      <path d="M9.5 2.5V5H12" />
      <path d="M7.25 8.25h1.5M7.25 10.25h1.5" />
    </>
  )
}

function MarkdownGlyph() {
  return (
    <>
      <path d="M5 2.5h4.5L12 5v8.5H5z" />
      <path d="M9.5 2.5V5H12" />
      <path d="M7 8.5l1 1.5 1-1.5 1 1.5" />
    </>
  )
}

function StyleGlyph() {
  return (
    <>
      <path d="M5 2.5h4.5L12 5v8.5H5z" />
      <path d="M9.5 2.5V5H12" />
      <circle cx="8.5" cy="9.5" r="1.25" />
    </>
  )
}

function DatabaseGlyph() {
  return (
    <>
      <ellipse cx="8" cy="5" rx="4.5" ry="1.75" />
      <path d="M3.5 5v6c0 .97 2.01 1.75 4.5 1.75s4.5-.78 4.5-1.75V5" />
      <path d="M3.5 8c0 .97 2.01 1.75 4.5 1.75s4.5-.78 4.5-1.75" />
    </>
  )
}
