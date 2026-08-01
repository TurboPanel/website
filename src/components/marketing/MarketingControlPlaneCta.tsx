'use client'

import { useSyncExternalStore, type ReactNode } from 'react'
import { getControlPlaneBaseUrl } from '@/lib/env'
import {
  MarketingPrimaryCta,
  MarketingSecondaryCta,
} from '@/components/marketing/MarketingPrimaryCta'

type ControlPlanePath = '/sign-in' | '/sign-up'

type MarketingControlPlaneCtaProps = Readonly<{
  path?: ControlPlanePath
  variant?: 'primary' | 'secondary'
  emphasis?: boolean
  className?: string
  children: ReactNode
}>

function defaultControlPlaneHref(path: ControlPlanePath): string {
  return `https://turbopanel.app${path}`
}

/**
 * Resolves the env-appropriate control-plane URL (TurboPanel High Availability
 * or local Caddy) without `/api/config` — same host map as {@link SignInButton}.
 */
export function MarketingControlPlaneCta({
  path = '/sign-in',
  variant = 'primary',
  emphasis = true,
  className = '',
  children,
}: MarketingControlPlaneCtaProps) {
  const href = useSyncExternalStore(
    () => () => {},
    () =>
      `${getControlPlaneBaseUrl(window.location.hostname, window.location.port)}${path}`,
    () => defaultControlPlaneHref(path),
  )

  if (variant === 'secondary') {
    return (
      <MarketingSecondaryCta href={href} className={className}>
        {children}
      </MarketingSecondaryCta>
    )
  }

  return (
    <MarketingPrimaryCta href={href} emphasis={emphasis} className={className}>
      {children}
    </MarketingPrimaryCta>
  )
}
