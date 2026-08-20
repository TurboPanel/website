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
})

describe('getApiBaseUrl', () => {
  it('maps marketing hosts and local dev to the expected control-plane origins', () => {
    expect(getApiBaseUrl('localhost')).toBe('https://localhost:8443')
    expect(getApiBaseUrl('turbopanel.io')).toBe('https://turbopanel.app')
    expect(getApiBaseUrl('testing.turbopanel.io')).toBe('https://testing.turbopanel.dev')
    expect(getApiBaseUrl('unknown.example')).toBe('https://turbopanel.app')
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
  })
})

describe('getSignInUrl', () => {
  it('appends /sign-in to the resolved control-plane origin', () => {
    expect(getSignInUrl('turbopanel.io')).toBe('https://turbopanel.app/sign-in')
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
})
