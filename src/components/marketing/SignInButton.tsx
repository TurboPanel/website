'use client'

import { useEffect, useState } from 'react'
import { getSignInUrl } from '@/lib/env'

type ApiConfigSignIn = Readonly<{
  signInUrl?: string
  servers?: ReadonlyArray<{ url: string }>
}>

function resolveHrefFromConfig(data: ApiConfigSignIn): string | null {
  if (typeof data.signInUrl === 'string' && data.signInUrl.length > 0) {
    return data.signInUrl
  }
  const base = data.servers?.[0]?.url
  if (typeof base === 'string' && base.length > 0) {
    return `${base}/sign-in`
  }
  return null
}

/**
 * Primary nav CTA → Edge (or local) control-plane `/sign-in`.
 * Resolves from the current website host, then confirms via `/api/config`.
 */
type SignInButtonProps = Readonly<{
  compact?: boolean
}>

export function SignInButton({ compact = false }: SignInButtonProps) {
  const [href, setHref] = useState('https://turbopanel.app/sign-in')

  useEffect(() => {
    const host = window.location.hostname
    const port = window.location.port
    setHref(getSignInUrl(host, port))

    let cancelled = false
    void fetch('/api/config')
      .then(async (res) => {
        if (!res.ok) return
        const data = (await res.json()) as ApiConfigSignIn
        const next = resolveHrefFromConfig(data)
        if (!cancelled && next) setHref(next)
      })
      .catch(() => {
        /* keep host-mapped href */
      })

    return () => {
      cancelled = true
    }
  }, [])

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
