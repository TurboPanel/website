'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PreDevBanner } from '@/components/PreDevBanner'
import { SiteHeader, type ActivePage } from '@/components/marketing/SiteHeader'

/** Compact as soon as the page has scrolled at all. */
const SCROLL_COMPACT_PX = 1

function resolveActive(pathname: string): ActivePage | undefined {
  if (pathname.startsWith('/docs')) return 'docs'
  if (pathname.startsWith('/pricing')) return 'pricing'
  if (pathname.startsWith('/roadmap')) return 'roadmap'
  if (pathname.startsWith('/setups')) return 'setups'
  if (pathname === '/') return 'overview'
  return undefined
}

function readScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

function scrollWindowToTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/**
 * Sticky site chrome: evolving-fast banner + TurboPanel nav.
 * On scroll the banner collapses and the nav shrinks; `--tp-chrome-height`
 * stays in sync so docs/Scalar sidebars fill the remaining viewport.
 * Pathname changes (no hash) scroll to top so the full-size chrome returns.
 */
export function StickySiteChrome() {
  const pathname = usePathname()
  const chromeRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  /** Set by `popstate` so back/forward can keep browser scroll restoration. */
  const historyTraversalRef = useRef(false)

  useEffect(() => {
    const onPopState = () => {
      historyTraversalRef.current = true
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Soft navigations keep this layout mounted; without an explicit reset the
  // compact chrome sticks even when the new page should start at the top.
  // Next may also apply scroll after paint, so sync from the previous
  // page's scrollY is not enough — force top on forward navigations.
  useLayoutEffect(() => {
    if (window.location.hash) {
      historyTraversalRef.current = false
      setScrolled(readScrollY() > SCROLL_COMPACT_PX)
      return
    }
    if (historyTraversalRef.current) {
      historyTraversalRef.current = false
      setScrolled(readScrollY() > SCROLL_COMPACT_PX)
      return
    }
    scrollWindowToTop()
    setScrolled(false)
  }, [pathname])

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
      className="tp-glass tp-glass-strong sticky top-0 z-50 rounded-none border-x-0 border-t-0"
      data-compact={scrolled ? '' : undefined}
    >
      <PreDevBanner scrollHidden={scrolled} />
      <SiteHeader active={resolveActive(pathname)} compact={scrolled} />
    </div>
  )
}
