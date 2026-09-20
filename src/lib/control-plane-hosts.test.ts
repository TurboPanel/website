import { describe, expect, it } from 'vitest'
import {
  CONTROL_PLANE_SERVER_LABELS,
  controlPlaneServerLabel,
  DEFAULT_CONTROL_PLANE_LABEL,
  LOCAL_DEV_CONTROL_PLANE_LABEL,
  WEBSITE_HOST_TO_CONTROL_PLANE,
} from '@/lib/control-plane-hosts'

describe('WEBSITE_HOST_TO_CONTROL_PLANE', () => {
  it('maps every marketing host to an https control-plane origin', () => {
    for (const [host, origin] of Object.entries(WEBSITE_HOST_TO_CONTROL_PLANE)) {
      expect(host.length).toBeGreaterThan(0)
      expect(origin.startsWith('https://')).toBe(true)
    }
  })

  it('maps the primary marketing domains', () => {
    expect(WEBSITE_HOST_TO_CONTROL_PLANE['turbopanel.io']).toBe('https://turbopanel.app')
    expect(WEBSITE_HOST_TO_CONTROL_PLANE['www.turbopanel.io']).toBe('https://turbopanel.app')
    expect(WEBSITE_HOST_TO_CONTROL_PLANE['testing.turbopanel.io']).toBe(
      'https://testing.turbopanel.dev',
    )
    expect(WEBSITE_HOST_TO_CONTROL_PLANE['staging.turbopanel.io']).toBe(
      'https://staging.turbopanel.dev',
    )
  })
})

describe('CONTROL_PLANE_SERVER_LABELS', () => {
  it('labels every origin the host map points at', () => {
    for (const origin of new Set(Object.values(WEBSITE_HOST_TO_CONTROL_PLANE))) {
      expect(CONTROL_PLANE_SERVER_LABELS[origin]).toBeTypeOf('string')
      expect(CONTROL_PLANE_SERVER_LABELS[origin]?.length).toBeGreaterThan(0)
    }
  })

  it('pins the per-environment Scalar labels', () => {
    expect(controlPlaneServerLabel('https://turbopanel.app')).toBe('Production API')
    expect(controlPlaneServerLabel('https://testing.turbopanel.dev')).toBe('Testing API')
    expect(controlPlaneServerLabel('https://staging.turbopanel.dev')).toBe('Staging API')
  })

  it('falls back to the generic label for an unknown origin', () => {
    expect(controlPlaneServerLabel('https://example.invalid')).toBe(
      DEFAULT_CONTROL_PLANE_LABEL,
    )
    expect(DEFAULT_CONTROL_PLANE_LABEL).toBe('API Server')
    expect(LOCAL_DEV_CONTROL_PLANE_LABEL).toBe('Local Dev')
  })
})
