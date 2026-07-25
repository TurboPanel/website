import { getCloudflareContext } from '@opennextjs/cloudflare'
import {
  getControlPlaneBaseUrl,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
  getSignInUrl,
  parseApiHostnames,
} from '@/lib/env'

export type ApiConfig = {
  servers: { url: string; description: string }[]
  openApiUrl: string
  daemonOpenApiUrl: string
  controlPlaneUrl: string
  signInUrl: string
}

/**
 * Public config for external consumers (Scalar embeds, third-party tools).
 *
 * The marketing site itself resolves the same values client-side via
 * `src/lib/env.ts` / `control-plane-hosts.ts` so static pages do not pay for a
 * Worker invocation on every view.
 *
 * Cache policy: responses are environment-stable (host → control-plane map or
 * Wrangler `API_HOSTNAMES`). CDN/browser may cache for 1 hour; shared caches
 * (s-maxage) for 24 hours with a week of stale-while-revalidate. Bump deploys
 * invalidate Workers; no per-user variance.
 */
const CONFIG_CACHE_CONTROL =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

export async function GET(request: Request): Promise<Response> {
  const host = request.headers.get('host') || 'turbopanel.app'
  const [hostname, port = ''] = host.split(':')

  let apiHostnames: string | undefined
  try {
    const ctx = getCloudflareContext()
    apiHostnames = ctx?.env?.API_HOSTNAMES
  } catch {
    apiHostnames = undefined
  }

  const controlPlaneUrl = getControlPlaneBaseUrl(hostname, port, apiHostnames)
  let servers: { url: string; description: string }[]
  if (typeof apiHostnames === 'string' && apiHostnames.length > 0) {
    const parsed = parseApiHostnames(apiHostnames)
    if (parsed.length > 0) {
      servers = parsed
    } else {
      servers = [{ url: controlPlaneUrl, description: 'API Server' }]
    }
  } else {
    servers = [{ url: controlPlaneUrl, description: 'API Server' }]
  }

  const openApiUrl = getScalarOpenApiUrl(hostname, port)
  const daemonOpenApiUrl = getScalarDaemonOpenApiUrl(hostname, port)
  const body: ApiConfig = {
    servers,
    openApiUrl,
    daemonOpenApiUrl,
    controlPlaneUrl,
    signInUrl: getSignInUrl(hostname, port, apiHostnames),
  }
  return Response.json(body, {
    headers: {
      'Cache-Control': CONFIG_CACHE_CONTROL,
    },
  })
}
