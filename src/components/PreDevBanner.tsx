'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  persistPreDevBannerDismissed,
  preDevBannerDismissedStore,
} from '@/lib/predev-banner-dismissed'
import { useClientMounted } from '@/lib/use-client-mounted'

type PreDevBannerProps = Readonly<{
  /** Collapse while the sticky chrome is in compact (scrolled) mode. */
  scrollHidden?: boolean
}>

export function PreDevBanner({ scrollHidden = false }: PreDevBannerProps) {
  const mounted = useClientMounted()
  const dismissed = useSyncExternalStore(
    preDevBannerDismissedStore.subscribe,
    preDevBannerDismissedStore.getSnapshot,
    preDevBannerDismissedStore.getServerSnapshot,
  )

  const handleCollapse = () => {
    persistPreDevBannerDismissed()
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
              <span className="font-semibold text-[var(--tp-accent)]">
                Currently in Private Alpha
              </span>
              {' — '}
              <Link
                href="/roadmap"
                className="group/roadmap font-semibold text-[var(--tp-text)] transition-colors hover:text-[var(--tp-accent)]"
                tabIndex={hidden ? -1 : undefined}
              >
                <span className="underline decoration-[var(--tp-accent)]/50 underline-offset-[3px] transition-[text-decoration-color] group-hover/roadmap:decoration-[var(--tp-accent)]">
                  See what&apos;s shipped and what&apos;s next
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
