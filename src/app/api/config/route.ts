import { getCloudflareContext } from '@opennextjs/cloudflare'
import {
  getApiBaseUrl,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
  parseApiHostnames,
} from '@/lib/env'

export type ApiConfig = {
  servers: { url: string; description: string }[]
  openApiUrl: string
  daemonOpenApiUrl: string
}

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

  let servers: { url: string; description: string }[]
  if (typeof apiHostnames === 'string' && apiHostnames.length > 0) {
    const parsed = parseApiHostnames(apiHostnames)
    if (parsed.length > 0) {
      servers = parsed
    } else {
      servers = [{ url: getApiBaseUrl(hostname, port), description: 'API Server' }]
    }
  } else {
    servers = [{ url: getApiBaseUrl(hostname, port), description: 'API Server' }]
  }

  const openApiUrl = getScalarOpenApiUrl(hostname, port)
  const daemonOpenApiUrl = getScalarDaemonOpenApiUrl(hostname, port)
  const body: ApiConfig = { servers, openApiUrl, daemonOpenApiUrl }
  return Response.json(body)
}
