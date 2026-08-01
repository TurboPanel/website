'use client'

import { useSyncExternalStore } from 'react'
import { getSignInUrl } from '@/lib/env'

/**
 * Primary nav CTA → TurboPanel High Availability (or local) control-plane `/sign-in`.
 * Resolves from the current website host via the static host map in `src/lib/env.ts`
 * (no `/api/config` round-trip — keeps static page loads off the Worker bill).
 */
type SignInButtonProps = Readonly<{
  compact?: boolean
}>

export function SignInButton({ compact = false }: SignInButtonProps) {
  const href = useSyncExternalStore(
    () => () => {},
    () => getSignInUrl(window.location.hostname, window.location.port),
    () => 'https://turbopanel.app/sign-in',
  )

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-md bg-[var(--tp-accent)] font-semibold tracking-tight text-[var(--tp-accent-contrast)] shadow-sm transition-[opacity,transform,height,padding,font-size] duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tp-bg)] motion-reduce:transition-none motion-reduce:active:scale-100 ${
        compact ? 'h-7 px-3 text-xs' : 'h-9 px-4 text-sm'
      }`}
    >
      Sign in
    </a>
  )
}
