import {
  type ControlPlaneServer,
  getControlPlaneBaseUrl,
  getControlPlaneServers,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
  getSignInUrl,
} from '@/lib/env'

export type ApiConfig = {
  servers: ControlPlaneServer[]
  openApiUrl: string
  daemonOpenApiUrl: string
  controlPlaneUrl: string
  signInUrl: string
}

/**
 * Public config for external consumers (Scalar embeds, third-party tools).
 *
 * Everything is derived from the request host through the static map in
 * `src/lib/control-plane-hosts.ts` — the marketing site resolves the same
 * values client-side via `src/lib/env.ts` so static pages do not pay for a
 * Worker invocation on every view. No deployment variable is consulted.
 *
 * Cache policy: responses are environment-stable (host → control-plane map).
 * CDN/browser may cache for 1 hour; shared caches (s-maxage) for 24 hours
 * with a week of stale-while-revalidate. Bump deploys invalidate Workers; no
 * per-user variance.
 */
const CONFIG_CACHE_CONTROL =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

export async function GET(request: Request): Promise<Response> {
  const host = request.headers.get('host') || 'turbopanel.app'
  const [hostname, port = ''] = host.split(':')

  const body: ApiConfig = {
    servers: getControlPlaneServers(hostname, port),
    openApiUrl: getScalarOpenApiUrl(hostname, port),
    daemonOpenApiUrl: getScalarDaemonOpenApiUrl(hostname, port),
    controlPlaneUrl: getControlPlaneBaseUrl(hostname, port),
    signInUrl: getSignInUrl(hostname, port),
  }
  return Response.json(body, {
    headers: {
      'Cache-Control': CONFIG_CACHE_CONTROL,
    },
  })
}
