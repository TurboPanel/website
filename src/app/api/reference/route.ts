import { getCloudflareContext } from '@opennextjs/cloudflare'
import { ApiReference } from '@scalar/nextjs-api-reference'
import { getApiBaseUrl, getScalarOpenApiUrl, parseApiHostnames } from '@/lib/env'
import {
  buildScalarCookieAuthentication,
  resolveSessionCookieNameFromBaseUrl,
  scalarSessionCookieNameRowCss,
} from '@/lib/scalar-session-cookie'

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'turbopanel.app'
  const [hostname, port = ''] = host.split(':')

  let apiHostnames: string | undefined
  try {
    const ctx = getCloudflareContext()
    apiHostnames = ctx?.env?.API_HOSTNAMES
  } catch {
    apiHostnames = undefined
  }

  let servers: { url: string; description: string }[]
  if (typeof apiHostnames === 'string' && apiHostnames.length > 0) {
    const parsed = parseApiHostnames(apiHostnames)
    if (parsed.length > 0) {
      servers = parsed
    } else {
      servers = [
        {
          url: getApiBaseUrl(hostname, port),
          description: 'API Server',
        },
      ]
    }
  } else {
    servers = [
      {
        url: getApiBaseUrl(hostname, port),
        description: 'API Server',
      },
    ]
  }

  const apiBaseUrl = servers[0].url
  const openApiUrl = getScalarOpenApiUrl(hostname, port)

  const handler = ApiReference({
    sources: [{ url: openApiUrl, title: 'TurboPanel API' }],
    servers,
    authentication: buildScalarCookieAuthentication(
      resolveSessionCookieNameFromBaseUrl(apiBaseUrl)
    ),
    persistAuth: true,
    customCss: scalarSessionCookieNameRowCss,
    theme: 'purple',
    layout: 'modern',
    pageTitle: 'TurboPanel API Reference',
  })

  return handler()
}
