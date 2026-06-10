/**
 * Runtime environment detection for API URLs.
 * Use hostname and port (from window.location) to determine the correct API base URL.
 * When using turbopanel.app in /etc/hosts for local dev, hostname alone is not enough—
 * we must also check the port (19820 = dev website).
 */

const DEV_WEBSITE_PORT = '19820'

export function getApiBaseUrl(hostname: string, port = ''): string {
  const normalized = hostname.split(':')[0].toLowerCase()
  if (normalized === 'localhost' || normalized === '127.0.0.1') {
    return 'http://localhost:18787'
  }
  if (normalized === 'turbopanel.app' && port === DEV_WEBSITE_PORT) {
    return 'http://localhost:18787'
  }
  return 'https://turbopanel.app'
}

export function getOpenApiUrl(hostname: string, port = ''): string {
  return `${getApiBaseUrl(hostname, port)}/api/openapi.json`
}

/**
 * Parses a CSV string of "hostname,label" pairs into a Scalar-compatible servers array.
 * Uses http:// for localhost or 127.0.0.1, https:// otherwise.
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
    const description = tokens[i + 1] ?? 'API Server'
    const normalized = hostname.split(':')[0].toLowerCase()
    const scheme = normalized === 'localhost' || normalized === '127.0.0.1' ? 'http://' : 'https://'
    result.push({ url: `${scheme}${hostname}`, description })
  }
  return result
}
