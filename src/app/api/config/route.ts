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
  return Response.json(body)
}
