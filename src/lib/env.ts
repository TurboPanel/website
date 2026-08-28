/**
 * Runtime environment detection for API URLs.
 * Use hostname and port (from window.location) to determine the correct API base URL.
 * When using turbopanel.app in /etc/hosts for local dev, hostname alone is not enough—
 * we must also check the port (WEBSITE_PORT on turbopanel-website.service, default 19820).
 * Local API calls target Caddy HTTPS (CADDY_PORT, default 8443), not the wrangler TCP port.
 *
 * Host → control-plane mapping lives in {@link ./control-plane-hosts.ts}; keep
 * `wrangler.jsonc` `API_HOSTNAMES` in sync (`pnpm check:hosts`).
 */

import {
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

function schemeForApiHost(hostnameWithOptionalPort: string): string {
  const colon = hostnameWithOptionalPort.indexOf(':')
  const host = colon === -1 ? hostnameWithOptionalPort : hostnameWithOptionalPort.slice(0, colon)
  const hostPort = colon === -1 ? '' : hostnameWithOptionalPort.slice(colon + 1)
  const normalized = host.toLowerCase()
  if (normalized === 'localhost' || normalized === '127.0.0.1') {
    const caddyPort = getDevCaddyPort()
    if (!hostPort || hostPort === caddyPort || hostPort === '443') {
      return 'https://'
    }
    return 'http://'
  }
  return 'https://'
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
 * Same static map as {@link getControlPlaneBaseUrl} (without Wrangler override).
 */
export function getApiBaseUrl(hostname: string, port = ''): string {
  return resolveLocalOrMappedBase(hostname, port)
}

/**
 * Control-plane origin for the current website environment.
 * Local Next (`localhost` / `turbopanel.app:19820`) → Caddy `:8443`;
 * deployed marketing hosts → matching TurboPanel High Availability instance (`turbopanel.app`, etc.).
 * Optional `apiHostnames` (Wrangler `API_HOSTNAMES`) wins when provided.
 */
export function getControlPlaneBaseUrl(
  hostname: string,
  port = '',
  apiHostnames?: string
): string {
  if (typeof apiHostnames === 'string' && apiHostnames.length > 0) {
    const parsed = parseApiHostnames(apiHostnames)
    const fromEnv = parsed[0]?.url
    if (fromEnv) return fromEnv
  }

  return resolveLocalOrMappedBase(hostname, port)
}

/** Sign-in page on the env-appropriate control plane. */
export function getSignInUrl(
  hostname: string,
  port = '',
  apiHostnames?: string
): string {
  return `${getControlPlaneBaseUrl(hostname, port, apiHostnames)}/sign-in`
}

export function getScalarOpenApiUrl(hostname: string, port = ''): string {
  return `${getControlPlaneBaseUrl(hostname, port)}/api/client/v1/openapi.json`
}

export function getScalarDaemonOpenApiUrl(hostname: string, port = ''): string {
  return `${getControlPlaneBaseUrl(hostname, port)}/api/daemon/v1/openapi.json`
}

/**
 * Parses a CSV string of "hostname,label" pairs into a Scalar-compatible servers array.
 * Local dev uses https://localhost:{CADDY_PORT} (Caddy); production hostnames use https://.
 * Returns [] if token count is odd or input is empty/blank.
 */
export function parseApiHostnames(csv: string): { url: string; description: string }[] {
  const trimmed = csv.trim()
  if (!trimmed) return []
  const tokens = trimmed
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  if (tokens.length % 2 !== 0) return []
  const result: { url: string; description: string }[] = []
  for (let i = 0; i < tokens.length; i += 2) {
    const hostname = tokens[i]
    const description = tokens[i + 1]!
    const scheme = schemeForApiHost(hostname)
    result.push({ url: `${scheme}${hostname}`, description })
  }
  return result
}
