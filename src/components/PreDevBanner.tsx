'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type PreDevBannerProps = Readonly<{
  /** Collapse while the sticky chrome is in compact (scrolled) mode. */
  scrollHidden?: boolean
}>

export function PreDevBanner({ scrollHidden = false }: PreDevBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('predev-banner-dismissed')
    setDismissed(stored === 'true')
    setMounted(true)
  }, [])

  const handleCollapse = () => {
    setDismissed(true)
    localStorage.setItem('predev-banner-dismissed', 'true')
  }

  if (!mounted) return null

  const hidden = dismissed || scrollHidden

  return (
    <div
      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
        hidden ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
      }`}
      aria-hidden={hidden}
    >
      <div className="min-h-0">
        <div className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">
          <div className="flex items-center justify-between gap-4 px-4 py-2.5">
            <p className="flex-1 text-center text-sm font-medium text-white">
              TurboPanel is evolving fast —{' '}
              <Link
                href="/roadmap"
                className="group/roadmap font-semibold text-white transition-colors hover:text-blue-50"
                tabIndex={hidden ? -1 : undefined}
              >
                <span className="underline decoration-white/55 underline-offset-[3px] transition-[text-decoration-color] group-hover/roadmap:decoration-white">
                  see what&apos;s shipped and what&apos;s up next
                </span>
                <span
                  className="ml-1.5 inline-block translate-y-px text-[0.95em] tracking-tight transition-transform duration-200 ease-out group-hover/roadmap:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </p>
            <button
              type="button"
              onClick={handleCollapse}
              className="shrink-0 rounded p-1 text-lg leading-none text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss banner"
              tabIndex={hidden ? -1 : undefined}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
