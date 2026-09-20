/**
 * Runtime environment detection for API URLs.
 * Use hostname and port (from window.location) to determine the correct API base URL.
 * When using turbopanel.app in /etc/hosts for local dev, hostname alone is not enough—
 * we must also check the port (WEBSITE_PORT on turbopanel-website.service, default 19820).
 * Local API calls target Caddy HTTPS (CADDY_PORT, default 8443), not the wrangler TCP port.
 *
 * Host → control-plane mapping and Scalar server labels live in
 * {@link ./control-plane-hosts.ts}; both the Worker routes and the client
 * derive everything from the request host — no deployment variable.
 */

import {
  controlPlaneServerLabel,
  LOCAL_DEV_CONTROL_PLANE_LABEL,
  WEBSITE_HOST_TO_CONTROL_PLANE,
} from '@/lib/control-plane-hosts'

const DEFAULT_DEV_WEBSITE_PORT = '19820'
const DEFAULT_DEV_CADDY_PORT = '8443'

/** Dev website listen port — NEXT_PUBLIC_WEBSITE_PORT / WEBSITE_PORT set on turbopanel-website.service by Ansible. */
export function getDevWebsitePort(): string {
  return (
    process.env.NEXT_PUBLIC_WEBSITE_PORT ??
    process.env.WEBSITE_PORT ??
    DEFAULT_DEV_WEBSITE_PORT
  )
}

/** Local HTTPS API entrypoint (Caddy) — NEXT_PUBLIC_CADDY_PORT / CADDY_PORT set on turbopanel-website.service by Ansible. */
export function getDevCaddyPort(): string {
  return (
    process.env.NEXT_PUBLIC_CADDY_PORT ??
    process.env.CADDY_PORT ??
    DEFAULT_DEV_CADDY_PORT
  )
}

export function isLocalDevWebsiteHost(hostname: string, port = ''): boolean {
  const normalized = hostname.split(':')[0].toLowerCase()
  if (normalized === 'localhost' || normalized === '127.0.0.1') return true
  return normalized === 'turbopanel.app' && port === getDevWebsitePort()
}

function localDevApiBaseUrl(): string {
  return `https://localhost:${getDevCaddyPort()}`
}

/** Resolve control-plane origin from hostname (+ optional local-dev port). */
function resolveLocalOrMappedBase(hostname: string, port = ''): string {
  if (isLocalDevWebsiteHost(hostname, port)) {
    return localDevApiBaseUrl()
  }

  const mapped = WEBSITE_HOST_TO_CONTROL_PLANE[hostname.split(':')[0].toLowerCase()]
  if (mapped) return mapped

  return 'https://turbopanel.app'
}

/**
 * API / OpenAPI base URL for the current website host.
 * Same static map as {@link getControlPlaneBaseUrl}.
 */
export function getApiBaseUrl(hostname: string, port = ''): string {
  return resolveLocalOrMappedBase(hostname, port)
}

/**
 * Control-plane origin for the current website environment.
 * Local Next (`localhost` / `turbopanel.app:19820`) → Caddy `:8443`;
 * deployed marketing hosts → matching TurboPanel High Availability instance (`turbopanel.app`, etc.).
 */
export function getControlPlaneBaseUrl(hostname: string, port = ''): string {
  return resolveLocalOrMappedBase(hostname, port)
}

/** Sign-in page on the env-appropriate control plane. */
export function getSignInUrl(hostname: string, port = ''): string {
  return `${getControlPlaneBaseUrl(hostname, port)}/sign-in`
}

export type ControlPlaneServer = { url: string; description: string }

/**
 * Scalar `servers` entries for the current website host — the control plane
 * the host maps to, labelled from {@link ./control-plane-hosts.ts}. Local dev
 * is labelled `Local Dev`; an unmapped origin gets the generic label.
 */
export function getControlPlaneServers(
  hostname: string,
  port = ''
): ControlPlaneServer[] {
  const url = getControlPlaneBaseUrl(hostname, port)
  const description = isLocalDevWebsiteHost(hostname, port)
    ? LOCAL_DEV_CONTROL_PLANE_LABEL
    : controlPlaneServerLabel(url)
  return [{ url, description }]
}

export function getScalarOpenApiUrl(hostname: string, port = ''): string {
  return `${getControlPlaneBaseUrl(hostname, port)}/api/client/v1/openapi.json`
}

export function getScalarDaemonOpenApiUrl(hostname: string, port = ''): string {
  return `${getControlPlaneBaseUrl(hostname, port)}/api/daemon/v1/openapi.json`
}
