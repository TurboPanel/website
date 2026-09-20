import { afterEach, describe, expect, it } from 'vitest'
import {
  getApiBaseUrl,
  getControlPlaneBaseUrl,
  getControlPlaneServers,
  getDevCaddyPort,
  getDevWebsitePort,
  getScalarDaemonOpenApiUrl,
  getScalarOpenApiUrl,
  getSignInUrl,
  isLocalDevWebsiteHost,
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
  it('derives the control plane from the host map', () => {
    expect(getControlPlaneBaseUrl('staging.turbopanel.io')).toBe(
      'https://staging.turbopanel.dev',
    )
    expect(getControlPlaneBaseUrl('turbopanel.io')).toBe('https://turbopanel.app')
    expect(getControlPlaneBaseUrl('testing.turbopanel.io')).toBe(
      'https://testing.turbopanel.dev',
    )
  })

  it('routes local website hosts to the local Caddy control plane', () => {
    expect(getControlPlaneBaseUrl('localhost')).toBe('https://localhost:8443')
    expect(getControlPlaneBaseUrl('turbopanel.app', '19820')).toBe(
      'https://localhost:8443',
    )
  })

  it('falls back to production for an unmapped host', () => {
    expect(getControlPlaneBaseUrl('unknown.example')).toBe('https://turbopanel.app')
  })
})

describe('getControlPlaneServers', () => {
  it('labels each mapped control plane from the host map', () => {
    expect(getControlPlaneServers('turbopanel.io')).toEqual([
      { url: 'https://turbopanel.app', description: 'Production API' },
    ])
    expect(getControlPlaneServers('www.turbopanel.io')).toEqual([
      { url: 'https://turbopanel.app', description: 'Production API' },
    ])
    expect(getControlPlaneServers('testing.turbopanel.io')).toEqual([
      { url: 'https://testing.turbopanel.dev', description: 'Testing API' },
    ])
    expect(getControlPlaneServers('staging.turbopanel.io')).toEqual([
      { url: 'https://staging.turbopanel.dev', description: 'Staging API' },
    ])
  })

  it('labels the local Caddy control plane as Local Dev', () => {
    expect(getControlPlaneServers('localhost')).toEqual([
      { url: 'https://localhost:8443', description: 'Local Dev' },
    ])
    expect(getControlPlaneServers('127.0.0.1')).toEqual([
      { url: 'https://localhost:8443', description: 'Local Dev' },
    ])
    expect(getControlPlaneServers('turbopanel.app', '19820')).toEqual([
      { url: 'https://localhost:8443', description: 'Local Dev' },
    ])
  })

  it('uses the configured Caddy port for the local entry', () => {
    delete process.env.NEXT_PUBLIC_CADDY_PORT
    process.env.CADDY_PORT = '9443'
    expect(getControlPlaneServers('localhost')).toEqual([
      { url: 'https://localhost:9443', description: 'Local Dev' },
    ])
  })

  it('falls back to the production label for an unmapped host', () => {
    expect(getControlPlaneServers('unknown.example')).toEqual([
      { url: 'https://turbopanel.app', description: 'Production API' },
    ])
  })

  it('matches mapped hosts case-insensitively and ignores an embedded port', () => {
    expect(getControlPlaneServers('Staging.TurboPanel.IO:443')).toEqual([
      { url: 'https://staging.turbopanel.dev', description: 'Staging API' },
    ])
  })
})

describe('getSignInUrl', () => {
  it('appends /sign-in to the resolved control-plane origin', () => {
    expect(getSignInUrl('turbopanel.io')).toBe('https://turbopanel.app/sign-in')
    expect(getSignInUrl('localhost')).toBe('https://localhost:8443/sign-in')
    expect(getSignInUrl('testing.turbopanel.io')).toBe(
      'https://testing.turbopanel.dev/sign-in',
    )
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
