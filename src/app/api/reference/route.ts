import { getCloudflareContext } from '@opennextjs/cloudflare'
import {
  getApiBaseUrl,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
  parseApiHostnames,
} from '@/lib/env'
import {
  buildScalarBearerAuthentication,
  buildScalarCookieAuthentication,
  resolveSessionCookieNameFromBaseUrl,
  scalarSessionCookieNameRowCss,
} from '@/lib/scalar-session-cookie'

/**
 * Next.js `@scalar/nextjs-api-reference` spreads a single config object and
 * cannot pass an array of documents. Emit CDN HTML ourselves so Client and
 * Daemon each keep surface-specific authentication.
 */
function buildMultiDocumentScalarHtml(
  documents: ReadonlyArray<Record<string, unknown>>,
  options: Readonly<{ pageTitle: string; customCss: string }>
): string {
  const configJson = JSON.stringify(documents, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `      ${line}`))
    .join('\n')

  return `<!doctype html>
<html>
  <head>
    <title>${options.pageTitle}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
${options.customCss}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"><\/script>
    <script type="text/javascript">
      Scalar.createApiReference('#app', ${configJson})
    <\/script>
  </body>
</html>`
}

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
  const daemonOpenApiUrl = getScalarDaemonOpenApiUrl(hostname, port)
  const sessionCookieName = resolveSessionCookieNameFromBaseUrl(apiBaseUrl)

  const shared = {
    servers,
    persistAuth: true,
    theme: 'purple' as const,
    layout: 'modern' as const,
    _integration: 'nextjs' as const,
  }

  const html = buildMultiDocumentScalarHtml(
    [
      {
        ...shared,
        url: openApiUrl,
        title: 'Client API',
        slug: 'client',
        default: true,
        authentication: buildScalarCookieAuthentication(sessionCookieName),
      },
      {
        ...shared,
        url: daemonOpenApiUrl,
        title: 'Daemon API',
        slug: 'daemon',
        default: false,
        authentication: buildScalarBearerAuthentication(),
      },
    ],
    {
      pageTitle: 'TurboPanel API Reference',
      customCss: scalarSessionCookieNameRowCss,
    }
  )

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
