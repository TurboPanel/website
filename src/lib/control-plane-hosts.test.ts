import { describe, expect, it } from 'vitest'
import {
  WEBSITE_HOST_TO_CONTROL_PLANE,
  WRANGLER_API_HOSTNAMES,
} from '@/lib/control-plane-hosts'

describe('WEBSITE_HOST_TO_CONTROL_PLANE', () => {
  it('maps every marketing host to an https control-plane origin', () => {
    for (const [host, origin] of Object.entries(WEBSITE_HOST_TO_CONTROL_PLANE)) {
      expect(host.length).toBeGreaterThan(0)
      expect(origin.startsWith('https://')).toBe(true)
    }
  })
})

describe('WRANGLER_API_HOSTNAMES', () => {
  it('defines the expected named environments', () => {
    expect(Object.keys(WRANGLER_API_HOSTNAMES).sort((a, b) => a.localeCompare(b))).toEqual(
      ['development', 'live', 'staging', 'testing'],
    )
  })

  it('uses localhost Caddy for development', () => {
    expect(WRANGLER_API_HOSTNAMES.development).toBe('localhost:8443,Local Dev')
  })
})
