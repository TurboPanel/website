'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { resolveSessionCookieNameFromBaseUrl } from '@/lib/scalar-session-cookie'
import { getApiBaseUrl, getScalarOpenApiUrl } from '@/lib/env'
import {
  buildScalarCookieAuthentication,
  installScalarSessionCookieNameRowLock,
  scalarSessionCookieNameRowCss,
} from '@/lib/scalar-session-cookie'

type ApiConfig = {
  servers: { url: string; description: string }[]
  openApiUrl: string
}

/** Non-empty trimmed string URLs only; rejects non-strings and blank values. */
function normalizeConfigUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const scalarCustomCss = `
  /* Map Scalar theme to Fumadocs CSS variables */
  .scalar-api-reference,
  .scalar-app {
    --scalar-background-1: var(--fd-background);
    --scalar-background-2: var(--fd-background);
    --scalar-background-3: var(--fd-border);
    --scalar-sidebar-background-1: var(--fd-background);
    --scalar-color-1: var(--fd-foreground);
    --scalar-color-2: var(--fd-foreground);
    --scalar-color-3: var(--fd-foreground);
    --scalar-color-accent: var(--fd-accent);
    --scalar-border-color: var(--fd-border);
    --scalar-font: var(--font-geist-sans, 'Avenir Next', 'Segoe UI', sans-serif);
    --scalar-font-code: var(--font-geist-mono, ui-monospace, monospace);
    font-size: clamp(0.9375rem, 1.5vw + 0.75rem, 1rem);
  }

  /* Hide Scalar modern layout header/navigation duplicated by Fumadocs */
  .scalar-api-reference .t-doc__header { display: none !important; }
  .scalar-api-reference .api-reference-toolbar { display: none !important; }

  /* Reduce top padding and header offset for seamless Fumadocs integration */
  .scalar-api-reference,
  .scalar-app {
    --refs-header-height: 0px;
    padding-top: 0 !important;
    margin-top: 0 !important;
    max-width: var(--fd-layout-width, 97rem);
  }

  /* Wrapper for Scalar so back link can be positioned over sidebar */
  .scalar-api-reference { position: relative; }

  /* "Back to Documentation" link: placed at top of Scalar sidebar via customCss (no DOM injection).
     Scoped to .scalar-api-reference so only this page is targeted, not other sidebars. */
  .scalar-api-reference .scalar-back-link {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: var(--scalar-sidebar-width, 288px);
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--scalar-sidebar-color-1);
    text-decoration: none;
    border-bottom: 1px solid var(--scalar-sidebar-border-color);
    box-sizing: border-box;
  }
  .scalar-api-reference .scalar-back-link:hover {
    color: var(--scalar-color-accent);
    background: var(--scalar-sidebar-item-hover-background);
  }

  ${scalarSessionCookieNameRowCss}
`

export default function ApiDocsPage() {
  const { resolvedTheme } = useTheme()
  const [openApiUrl, setOpenApiUrl] = useState<string | null>(null)
  const [servers, setServers] = useState<{ url: string; description: string }[] | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((res) =>
        res.ok ? (res.json() as Promise<ApiConfig>) : Promise.reject(new Error('config failed'))
      )
      .then((data) => {
        const open = normalizeConfigUrl(data.openApiUrl)
        if (!cancelled && (data.servers?.length ?? 0) > 0 && open) {
          setOpenApiUrl(open)
          setServers(data.servers)
          return
        }
        throw new Error('empty config')
      })
      .catch(() => {
        if (cancelled) return
        const { hostname, port } = globalThis.location
        setOpenApiUrl(getScalarOpenApiUrl(hostname, port))
        setServers(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  let forceDarkModeState: 'dark' | 'light' | undefined
  if (resolvedTheme === 'dark') forceDarkModeState = 'dark'
  else if (resolvedTheme === 'light') forceDarkModeState = 'light'
  else forceDarkModeState = undefined

  const primaryOpenApiUrl = normalizeConfigUrl(openApiUrl)

  const apiBaseUrl = useMemo(() => {
    if (servers?.[0]?.url) return servers[0].url
    if (globalThis.location !== undefined) {
      const { hostname, port } = globalThis.location
      return getApiBaseUrl(hostname, port)
    }
    return 'https://turbopanel.app'
  }, [servers])

  /** https://localhost:8443 → __Secure-turbopanel.session_token */
  const sessionCookieName = useMemo(
    () => resolveSessionCookieNameFromBaseUrl(apiBaseUrl),
    [apiBaseUrl]
  )

  const scalarConfiguration = useMemo(
    () =>
      primaryOpenApiUrl
        ? {
            sources: [{ url: primaryOpenApiUrl, title: 'TurboPanel API' }],
            ...(servers && servers.length > 0 ? { servers } : {}),
            authentication: buildScalarCookieAuthentication(sessionCookieName),
            persistAuth: true,
            theme: 'none' as const,
            layout: 'modern' as const,
            hideDarkModeToggle: true,
            hideSearch: true,
            documentDownloadType: 'none' as const,
            forceDarkModeState,
            customCss: scalarCustomCss,
          }
        : null,
    [
      primaryOpenApiUrl,
      servers,
      sessionCookieName,
      forceDarkModeState,
    ]
  )

  useEffect(() => {
    if (!scalarConfiguration) return
    const root = document.querySelector('.scalar-api-reference')
    if (!root) return
    return installScalarSessionCookieNameRowLock(root)
  }, [scalarConfiguration])

  if (primaryOpenApiUrl === null || scalarConfiguration === null) return null

  return (
    <div className="scalar-api-reference">
      <a href="/docs" className="scalar-back-link">
        ← Documentation
      </a>
      <ApiReferenceReact
        key={`${primaryOpenApiUrl}-${sessionCookieName}`}
        configuration={scalarConfiguration}
      />
    </div>
  )
}
