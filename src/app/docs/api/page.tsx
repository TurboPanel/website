'use client'

import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import {
  getControlPlaneBaseUrl,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
} from '@/lib/env'
import {
  buildScalarBearerAuthentication,
  buildScalarCookieAuthentication,
  installScalarSessionCookieNameRowLock,
  resolveSessionCookieNameFromBaseUrl,
  scalarSessionCookieNameRowCss,
} from '@/lib/scalar-session-cookie'

/** Non-empty trimmed string URLs only; rejects non-strings and blank values. */
function normalizeConfigUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/** Resolve OpenAPI + try-it servers from the static host map (no `/api/config`). */
function resolveLocalApiDocsConfig(hostname: string, port: string) {
  const controlPlaneUrl = getControlPlaneBaseUrl(hostname, port)
  return {
    openApiUrl: getScalarOpenApiUrl(hostname, port),
    daemonOpenApiUrl: getScalarDaemonOpenApiUrl(hostname, port),
    servers: [{ url: controlPlaneUrl, description: 'API Server' }],
  }
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
    /* Account for sticky site chrome so the sidebar (incl. MCP) fits the viewport */
    --scalar-custom-header-height: var(--tp-chrome-height, 0px);
    --scalar-sidebar-sticky-offset: var(--tp-chrome-height, 0px);
    font-size: clamp(0.9375rem, 1.5vw + 0.75rem, 1rem);
  }

  /* Hide Scalar modern layout header/navigation duplicated by site chrome */
  .scalar-api-reference .t-doc__header { display: none !important; }
  .scalar-api-reference .api-reference-toolbar { display: none !important; }

  /* Reduce top padding so the page sits flush under the site chrome */
  .scalar-api-reference,
  .scalar-app {
    padding-top: 0 !important;
    margin-top: 0 !important;
    max-width: var(--fd-layout-width, 97rem);
  }

  /* Chrome is outside Scalar — don't force an extra 100dvh of page scroll */
  .scalar-api-reference .references-layout {
    min-height: calc(100dvh - var(--tp-chrome-height, 0px));
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

function subscribeClientApiDocsConfig(): () => void {
  return () => {}
}

/**
 * `useSyncExternalStore` compares snapshots by identity, so this must return the
 * same object until the host actually changes — building a fresh one per call
 * made React throw "The result of getSnapshot should be cached to avoid an
 * infinite loop" and re-render on every pass.
 */
let cachedApiDocsConfigKey: string | null = null
let cachedApiDocsConfig: ReturnType<typeof resolveLocalApiDocsConfig> | null = null

function getClientApiDocsConfigSnapshot() {
  const { hostname, port } = globalThis.location
  const key = `${hostname}:${port}`

  if (key !== cachedApiDocsConfigKey || !cachedApiDocsConfig) {
    cachedApiDocsConfigKey = key
    cachedApiDocsConfig = resolveLocalApiDocsConfig(hostname, port)
  }

  return cachedApiDocsConfig
}

export default function ApiDocsPage() {
  const { resolvedTheme } = useTheme()
  const apiDocsConfig = useSyncExternalStore(
    subscribeClientApiDocsConfig,
    getClientApiDocsConfigSnapshot,
    () => null,
  )
  const openApiUrl = apiDocsConfig?.openApiUrl ?? null
  const daemonOpenApiUrl = apiDocsConfig?.daemonOpenApiUrl ?? null
  const servers = apiDocsConfig?.servers ?? null

  let forceDarkModeState: 'dark' | 'light' | undefined
  if (resolvedTheme === 'dark') forceDarkModeState = 'dark'
  else if (resolvedTheme === 'light') forceDarkModeState = 'light'
  else forceDarkModeState = undefined

  const primaryOpenApiUrl = normalizeConfigUrl(openApiUrl)

  const apiBaseUrl = useMemo(() => {
    if (servers?.[0]?.url) return servers[0].url
    if (globalThis.location !== undefined) {
      const { hostname, port } = globalThis.location
      return getControlPlaneBaseUrl(hostname, port)
    }
    return 'https://turbopanel.app'
  }, [servers])

  /** https://localhost:8443 → __Host-turbopanel.session_token */
  const sessionCookieName = useMemo(
    () => resolveSessionCookieNameFromBaseUrl(apiBaseUrl),
    [apiBaseUrl]
  )

  const scalarConfiguration = useMemo(() => {
    if (!primaryOpenApiUrl) return null

    const shared = {
      ...(servers && servers.length > 0 ? { servers } : {}),
      persistAuth: true,
      theme: 'none' as const,
      layout: 'modern' as const,
      hideDarkModeToggle: true,
      hideSearch: true,
      documentDownloadType: 'none' as const,
      forceDarkModeState,
      customCss: scalarCustomCss,
    }

    // One config per OpenAPI document so auth schemes stay surface-specific.
    // A shared `sources` + global authentication registers every scheme on every doc.
    const clientDocument = {
      ...shared,
      url: primaryOpenApiUrl,
      title: 'Client API',
      slug: 'client',
      default: true as const,
      authentication: buildScalarCookieAuthentication(sessionCookieName),
    }

    if (!daemonOpenApiUrl) return [clientDocument]

    return [
      clientDocument,
      {
        ...shared,
        url: daemonOpenApiUrl,
        title: 'Daemon API',
        slug: 'daemon',
        default: false as const,
        authentication: buildScalarBearerAuthentication(),
      },
    ]
  }, [
    primaryOpenApiUrl,
    daemonOpenApiUrl,
    servers,
    sessionCookieName,
    forceDarkModeState,
  ])

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
        key={`${primaryOpenApiUrl}-${daemonOpenApiUrl ?? ''}-${sessionCookieName}`}
        configuration={scalarConfiguration}
      />
    </div>
  )
}
