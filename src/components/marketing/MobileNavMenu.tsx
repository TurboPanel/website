'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton } from '@/components/marketing/SignInButton'
import { SocialNavLinks } from '@/components/marketing/SocialNavLinks'
import { ThemeToggleButton } from '@/components/ThemeToggleButton'
import { useClientMounted } from '@/lib/use-client-mounted'

/** Structural copy of a `SiteHeader` LINKS entry (kept local — avoids a cycle). */
export type MobileNavLink = Readonly<{
  href: string
  label: string
  key: string
}>

type MobileNavMenuProps = Readonly<{
  links: readonly MobileNavLink[]
  /** `ActivePage` key of the current route, when it is nav-visible. */
  activeKey?: string
  /** Smaller trigger while the sticky chrome is scrolled. */
  compact?: boolean
}>

/** Matches the `lg:` breakpoint where `SiteHeader` shows the full nav. */
const DESKTOP_NAV_QUERY = '(min-width: 64rem)'

const BAR_CLASS =
  'absolute left-0 top-1/2 h-[2px] w-5 rounded-full bg-current transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none'

function itemClass(active: boolean) {
  const base =
    'flex items-center rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors'
  if (active) {
    return `${base} bg-[var(--tp-surface-muted)] text-[var(--tp-text)]`
  }

  return `${base} text-[var(--tp-text-muted)] hover:bg-[var(--tp-surface-muted)] hover:text-[var(--tp-text)]`
}

/**
 * Below `lg`, the full site nav does not fit next to the logo + Sign in CTA —
 * it used to overflow and clip every link after the first two. This disclosure
 * moves the nav links, social links, and theme toggle into a panel that drops
 * out of the bottom edge of the sticky chrome.
 *
 * The panel is `absolute` inside `SiteHeader`'s `relative` header (the chrome's
 * `backdrop-filter` is a containing block, so `fixed` would anchor to the
 * chrome, not the viewport). The scrim is portalled to `<body>` instead, below
 * the chrome's z-50 so the panel still paints over it.
 *
 * Stays mounted while closed (with `inert`) so open *and* close both animate.
 */
export function MobileNavMenu({ links, activeKey, compact = false }: MobileNavMenuProps) {
  const mounted = useClientMounted()
  const pathname = usePathname()
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  /**
   * The route the panel was opened on, not a plain boolean: a soft navigation
   * changes `pathname`, which closes the panel during render instead of through
   * a cascading `setState` in an effect.
   */
  const [openedPath, setOpenedPath] = useState<string | null>(null)
  const open = openedPath === pathname

  const close = useCallback(() => setOpenedPath(null), [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      triggerRef.current?.focus()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Resizing up to the desktop nav hides the trigger; drop the state with it.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_NAV_QUERY)
    const onChange = () => {
      if (query.matches) close()
    }

    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [close])

  // Lock the page behind the scrim. `globals.css` gives both html and body
  // `overflow-y: auto`, so either can be the scroller — pin both.
  useEffect(() => {
    if (!open) return

    const root = document.documentElement
    const { body } = document
    const previousRoot = root.style.overflow
    const previousBody = body.style.overflow
    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousRoot
      body.style.overflow = previousBody
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpenedPath((current) => (current === pathname ? null : pathname))}
        className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--tp-text-muted)] transition-[background-color,color,width,height] duration-200 hover:bg-[var(--tp-surface-muted)] hover:text-[var(--tp-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tp-bg)] motion-reduce:transition-none lg:hidden ${
          compact ? 'h-9 w-9' : 'h-11 w-11'
        }`}
      >
        <span className="relative block h-4 w-5" aria-hidden>
          <span
            className={BAR_CLASS}
            style={{
              transform: open
                ? 'translateY(-50%) rotate(45deg)'
                : 'translateY(calc(-50% - 6px))',
            }}
          />
          <span
            className={BAR_CLASS}
            style={{ transform: 'translateY(-50%)', opacity: open ? 0 : 1 }}
          />
          <span
            className={BAR_CLASS}
            style={{
              transform: open
                ? 'translateY(-50%) rotate(-45deg)'
                : 'translateY(calc(-50% + 6px))',
            }}
          />
        </span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-40 bg-[var(--tp-scrim)] lg:hidden"
              onClick={close}
              aria-hidden
            />,
            document.body,
          )
        : null}

      <div
        id={panelId}
        inert={!open}
        className={`absolute inset-x-0 top-full z-10 px-4 pt-2 pb-4 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none sm:px-6 lg:hidden ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        {/* Aligns the card with the header's own max-w-6xl content column. */}
        <div className="mx-auto w-full max-w-6xl">
          {/*
            Full-bleed sheet on phones, right-aligned dropdown from `sm:` up.
            Solid surface, not `.tp-glass`: the sticky chrome's own
            backdrop-filter scopes the backdrop root, so a nested frosted panel
            blurs nothing and just reads as page text bleeding through.
          */}
          <div className="tp-touch-targets ms-auto flex w-full flex-col gap-2 overflow-y-auto rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-2 shadow-[var(--tp-shadow-card)] max-h-[calc(100dvh-var(--tp-chrome-height,0px)-1.5rem)] sm:max-w-xs">
            <nav aria-label="Site" className="flex flex-col gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activeKey === link.key ? 'page' : undefined}
                  onClick={close}
                  className={itemClass(activeKey === link.key)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Below 360px `SiteHeader` drops the bar CTA — this is the only one. */}
            <div className="border-t border-[var(--tp-border)] px-1 pt-2 min-[360px]:hidden">
              <SignInButton className="w-full" />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--tp-border)] px-1 pt-2">
              <SocialNavLinks />
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
