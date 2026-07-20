'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PreDevBanner } from '@/components/PreDevBanner'
import { SiteHeader, type ActivePage } from '@/components/marketing/SiteHeader'

/** Compact as soon as the page has scrolled at all. */
const SCROLL_COMPACT_PX = 1

function resolveActive(pathname: string): ActivePage | undefined {
  if (pathname.startsWith('/docs')) return 'docs'
  if (pathname.startsWith('/pricing')) return 'pricing'
  if (pathname.startsWith('/roadmap')) return 'roadmap'
  if (pathname === '/') return 'overview'
  return undefined
}

function readScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

/**
 * Sticky site chrome: evolving-fast banner + TurboPanel nav.
 * On scroll the banner collapses and the nav shrinks; `--tp-chrome-height`
 * stays in sync so docs/Scalar sidebars fill the remaining viewport.
 */
export function StickySiteChrome() {
  const pathname = usePathname()
  const chromeRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const syncScrolled = (nestedY = 0) => {
      setScrolled(readScrollY() > SCROLL_COMPACT_PX || nestedY > SCROLL_COMPACT_PX)
    }
    const onScroll = (event: Event) => {
      const target = event.target
      const nestedY = target instanceof HTMLElement ? target.scrollTop : 0
      syncScrolled(nestedY)
    }
    syncScrolled()
    // Capture so nested scrollers (Scalar main pane, etc.) still flip compact mode.
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true })
      document.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [])

  useEffect(() => {
    const el = chromeRef.current
    if (!el) return

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        '--tp-chrome-height',
        `${el.getBoundingClientRect().height}px`
      )
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--tp-chrome-height')
    }
  }, [])

  return (
    <div
      ref={chromeRef}
      className="sticky top-0 z-50 border-b border-[var(--tp-border)] bg-[var(--tp-bg)]/95 backdrop-blur-md"
      data-compact={scrolled ? '' : undefined}
    >
      <PreDevBanner scrollHidden={scrolled} />
      <SiteHeader active={resolveActive(pathname)} compact={scrolled} />
    </div>
  )
}
