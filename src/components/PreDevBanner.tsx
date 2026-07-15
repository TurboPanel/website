'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function PreDevBanner() {
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('predev-banner-dismissed')
    setCollapsed(stored === 'true')
    setMounted(true)
  }, [])

  const handleCollapse = () => {
    setCollapsed(true)
    localStorage.setItem('predev-banner-dismissed', 'true')
  }

  const handleExpand = () => {
    setCollapsed(false)
    localStorage.setItem('predev-banner-dismissed', 'false')
  }

  if (!mounted) return null

  if (!collapsed) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">
        <div className="flex items-center justify-between px-4 py-2.5 gap-4">
          <p className="text-sm font-medium text-white text-center flex-1">
            TurboPanel is evolving fast — see what&apos;s shipped and what&apos;s next.{' '}
            <Link
              href="/roadmap"
              className="underline underline-offset-2 font-semibold ml-1.5 hover:text-blue-100 transition-colors"
            >
              View Roadmap →
            </Link>
          </p>
          <button
            type="button"
            onClick={handleCollapse}
            className="shrink-0 text-white/80 hover:text-white transition-colors text-lg leading-none p-1 rounded hover:bg-white/10"
            aria-label="Collapse banner"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <button
        type="button"
        onClick={handleExpand}
        aria-label="Expand banner"
        className="pointer-events-auto rounded-b-xl border-x border-b border-blue-300/35 bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-md transition-colors hover:from-blue-400 hover:to-blue-600"
      >
        Under active development
      </button>
    </div>
  )
}
