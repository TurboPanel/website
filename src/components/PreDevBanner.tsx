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
        <div className="w-full border-b border-[var(--tp-border)] bg-[var(--tp-surface-muted)]">
          <div className="flex items-center justify-between gap-4 px-4 py-2.5">
            <p className="flex-1 text-center text-sm font-medium text-[var(--tp-text)]">
              TurboPanel is evolving fast —{' '}
              <Link
                href="/roadmap"
                className="group/roadmap font-semibold text-[var(--tp-text)] transition-colors hover:text-[var(--tp-accent)]"
                tabIndex={hidden ? -1 : undefined}
              >
                <span className="underline decoration-[var(--tp-accent)]/50 underline-offset-[3px] transition-[text-decoration-color] group-hover/roadmap:decoration-[var(--tp-accent)]">
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
              className="shrink-0 cursor-pointer rounded-md p-1.5 text-lg leading-none text-[var(--tp-text-muted)] transition-colors duration-200 hover:bg-[var(--tp-surface)] hover:text-[var(--tp-text)]"
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
