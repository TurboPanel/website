import { afterEach, describe, expect, it } from 'vitest'
import {
  getApiBaseUrl,
  getControlPlaneBaseUrl,
  getDevCaddyPort,
  getDevWebsitePort,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
  getSignInUrl,
  isLocalDevWebsiteHost,
  parseApiHostnames,
} from '@/lib/env'

const envSnapshot = { ...process.env }

afterEach(() => {
  process.env = { ...envSnapshot }
})

describe('getDevWebsitePort', () => {
  it('prefers NEXT_PUBLIC_WEBSITE_PORT then WEBSITE_PORT then default', () => {
    delete process.env.NEXT_PUBLIC_WEBSITE_PORT
    delete process.env.WEBSITE_PORT
    expect(getDevWebsitePort()).toBe('19820')

    process.env.WEBSITE_PORT = '21000'
    expect(getDevWebsitePort()).toBe('21000')

    process.env.NEXT_PUBLIC_WEBSITE_PORT = '22000'
    expect(getDevWebsitePort()).toBe('22000')
  })
})

describe('getDevCaddyPort', () => {
  it('prefers NEXT_PUBLIC_CADDY_PORT then CADDY_PORT then default', () => {
    delete process.env.NEXT_PUBLIC_CADDY_PORT
    delete process.env.CADDY_PORT
    expect(getDevCaddyPort()).toBe('8443')

    process.env.CADDY_PORT = '9443'
    expect(getDevCaddyPort()).toBe('9443')

    process.env.NEXT_PUBLIC_CADDY_PORT = '10443'
    expect(getDevCaddyPort()).toBe('10443')
  })
})

describe('isLocalDevWebsiteHost', () => {
  it('recognizes localhost and turbopanel.app on the dev website port', () => {
    expect(isLocalDevWebsiteHost('localhost')).toBe(true)
    expect(isLocalDevWebsiteHost('127.0.0.1')).toBe(true)
    expect(isLocalDevWebsiteHost('turbopanel.app', '19820')).toBe(true)
    expect(isLocalDevWebsiteHost('turbopanel.app', '443')).toBe(false)
  })

  it('strips an embedded port from the hostname and compares case-insensitively', () => {
    expect(isLocalDevWebsiteHost('localhost:19820')).toBe(true)
    expect(isLocalDevWebsiteHost('127.0.0.1:19820')).toBe(true)
    expect(isLocalDevWebsiteHost('TURBOPANEL.APP', '19820')).toBe(true)
    expect(isLocalDevWebsiteHost('turbopanel.app')).toBe(false)
  })

  it('uses the configured website port when matching turbopanel.app', () => {
    delete process.env.NEXT_PUBLIC_WEBSITE_PORT
    process.env.WEBSITE_PORT = '21000'
    expect(isLocalDevWebsiteHost('turbopanel.app', '21000')).toBe(true)
    expect(isLocalDevWebsiteHost('turbopanel.app', '19820')).toBe(false)
  })
})

describe('getApiBaseUrl', () => {
  it('maps marketing hosts and local dev to the expected control-plane origins', () => {
    expect(getApiBaseUrl('localhost')).toBe('https://localhost:8443')
    expect(getApiBaseUrl('127.0.0.1')).toBe('https://localhost:8443')
    expect(getApiBaseUrl('turbopanel.app', '19820')).toBe('https://localhost:8443')
    expect(getApiBaseUrl('turbopanel.io')).toBe('https://turbopanel.app')
    expect(getApiBaseUrl('www.turbopanel.io')).toBe('https://turbopanel.app')
    expect(getApiBaseUrl('testing.turbopanel.io')).toBe('https://testing.turbopanel.dev')
    expect(getApiBaseUrl('staging.turbopanel.io')).toBe('https://staging.turbopanel.dev')
    expect(getApiBaseUrl('unknown.example')).toBe('https://turbopanel.app')
  })

  it('strips an embedded port and matches mapped hosts case-insensitively', () => {
    expect(getApiBaseUrl('TURBOPANEL.IO:443')).toBe('https://turbopanel.app')
    expect(getApiBaseUrl('Staging.TurboPanel.IO:443')).toBe(
      'https://staging.turbopanel.dev',
    )
  })

  it('uses the configured Caddy port for the local API origin', () => {
    delete process.env.NEXT_PUBLIC_CADDY_PORT
    process.env.CADDY_PORT = '9443'
    expect(getApiBaseUrl('localhost')).toBe('https://localhost:9443')
    expect(getApiBaseUrl('127.0.0.1')).toBe('https://localhost:9443')
  })
})

describe('getControlPlaneBaseUrl', () => {
  it('prefers Wrangler API_HOSTNAMES when provided', () => {
    expect(
      getControlPlaneBaseUrl(
        'turbopanel.io',
        '',
        'staging.turbopanel.dev,Staging API',
      ),
    ).toBe('https://staging.turbopanel.dev')
  })

  it('falls back to the static host map when apiHostnames is empty', () => {
    expect(getControlPlaneBaseUrl('staging.turbopanel.io')).toBe(
      'https://staging.turbopanel.dev',
    )
    expect(getControlPlaneBaseUrl('turbopanel.io', '', '')).toBe('https://turbopanel.app')
  })

  it('ignores malformed API_HOSTNAMES CSV and uses the host map', () => {
    expect(getControlPlaneBaseUrl('turbopanel.io', '', 'odd-token-count')).toBe(
      'https://turbopanel.app',
    )
  })

  it('ignores whitespace-only API_HOSTNAMES and uses the host map', () => {
    expect(getControlPlaneBaseUrl('testing.turbopanel.io', '', '   ')).toBe(
      'https://testing.turbopanel.dev',
    )
  })

  it('trims Wrangler CSV and still prefers the first hostname pair', () => {
    expect(
      getControlPlaneBaseUrl(
        'localhost',
        '',
        '  testing.turbopanel.dev, Testing API  ',
      ),
    ).toBe('https://testing.turbopanel.dev')
  })
})

describe('getSignInUrl', () => {
  it('appends /sign-in to the resolved control-plane origin', () => {
    expect(getSignInUrl('turbopanel.io')).toBe('https://turbopanel.app/sign-in')
    expect(getSignInUrl('localhost')).toBe('https://localhost:8443/sign-in')
    expect(
      getSignInUrl('turbopanel.io', '', 'testing.turbopanel.dev,Testing API'),
    ).toBe('https://testing.turbopanel.dev/sign-in')
  })
})

describe('getScalarOpenApiUrl', () => {
  it('points at the client OpenAPI spec on the control plane', () => {
    expect(getScalarOpenApiUrl('turbopanel.io')).toBe(
      'https://turbopanel.app/api/client/v1/openapi.json',
    )
  })
})

describe('getScalarDaemonOpenApiUrl', () => {
  it('points at the daemon OpenAPI spec on the control plane', () => {
    expect(getScalarDaemonOpenApiUrl('turbopanel.io')).toBe(
      'https://turbopanel.app/api/daemon/v1/openapi.json',
    )
  })
})

describe('parseApiHostnames', () => {
  it('returns an empty array for blank or malformed CSV', () => {
    expect(parseApiHostnames('')).toEqual([])
    expect(parseApiHostnames('   ')).toEqual([])
    expect(parseApiHostnames('only-one-token')).toEqual([])
  })

  it('builds Scalar server entries with https for remote hosts', () => {
    expect(parseApiHostnames('turbopanel.app,Production API')).toEqual([
      { url: 'https://turbopanel.app', description: 'Production API' },
    ])
  })

  it('uses https for localhost when the port matches Caddy', () => {
    expect(parseApiHostnames('localhost:8443,Local Dev')).toEqual([
      { url: 'https://localhost:8443', description: 'Local Dev' },
    ])
  })

  it('uses http for localhost when the port is not the Caddy port', () => {
    expect(parseApiHostnames('localhost:8880,Plain HTTP')).toEqual([
      { url: 'http://localhost:8880', description: 'Plain HTTP' },
    ])
  })

  it('uses https for localhost without a port or on port 443', () => {
    expect(parseApiHostnames('localhost,Local Dev')).toEqual([
      { url: 'https://localhost', description: 'Local Dev' },
    ])
    expect(parseApiHostnames('localhost:443,TLS')).toEqual([
      { url: 'https://localhost:443', description: 'TLS' },
    ])
  })

  it('parses multiple hostname pairs and remote hosts stay on https', () => {
    expect(
      parseApiHostnames(
        'localhost:8443,Local Dev,testing.turbopanel.dev,Testing API',
      ),
    ).toEqual([
      { url: 'https://localhost:8443', description: 'Local Dev' },
      { url: 'https://testing.turbopanel.dev', description: 'Testing API' },
    ])
  })

  it('uses http for 127.0.0.1 when the port is not the Caddy port', () => {
    expect(parseApiHostnames('127.0.0.1:8880,Plain HTTP')).toEqual([
      { url: 'http://127.0.0.1:8880', description: 'Plain HTTP' },
    ])
  })

  it('uses https for 127.0.0.1 without a port, on 443, or on the Caddy port', () => {
    expect(parseApiHostnames('127.0.0.1,Loopback')).toEqual([
      { url: 'https://127.0.0.1', description: 'Loopback' },
    ])
    expect(parseApiHostnames('127.0.0.1:443,TLS')).toEqual([
      { url: 'https://127.0.0.1:443', description: 'TLS' },
    ])
    expect(parseApiHostnames('127.0.0.1:8443,Caddy')).toEqual([
      { url: 'https://127.0.0.1:8443', description: 'Caddy' },
    ])
  })

  it('matches localhost case-insensitively and treats an empty port as https', () => {
    expect(parseApiHostnames('LOCALHOST:8443,Local Dev')).toEqual([
      { url: 'https://LOCALHOST:8443', description: 'Local Dev' },
    ])
    expect(parseApiHostnames('localhost:,Local Dev')).toEqual([
      { url: 'https://localhost:', description: 'Local Dev' },
    ])
  })

  it('drops blank CSV tokens and still parses even pairs', () => {
    expect(parseApiHostnames(' localhost:8443 , Local Dev , ')).toEqual([
      { url: 'https://localhost:8443', description: 'Local Dev' },
    ])
  })

  it('returns empty when blank tokens leave an odd count', () => {
    expect(parseApiHostnames('a,b,c,')).toEqual([])
  })

  it('treats a custom Caddy port as https and the default 8443 as http', () => {
    delete process.env.NEXT_PUBLIC_CADDY_PORT
    process.env.CADDY_PORT = '9443'
    expect(parseApiHostnames('localhost:9443,Custom Caddy')).toEqual([
      { url: 'https://localhost:9443', description: 'Custom Caddy' },
    ])
    expect(parseApiHostnames('localhost:8443,Old Default')).toEqual([
      { url: 'http://localhost:8443', description: 'Old Default' },
    ])
    expect(parseApiHostnames('127.0.0.1:9443,Custom Caddy')).toEqual([
      { url: 'https://127.0.0.1:9443', description: 'Custom Caddy' },
    ])
  })
})
