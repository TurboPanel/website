import { describe, expect, it } from 'vitest'
import {
  buildScalarBearerAuthentication,
  buildScalarCookieAuthentication,
  HTTP_SESSION_COOKIE_NAME,
  HTTPS_SESSION_COOKIE_NAME,
  resolveSessionCookieNameFromBaseUrl,
} from '@/lib/scalar-session-cookie'

describe('resolveSessionCookieNameFromBaseUrl', () => {
  it('selects the __Host cookie for https origins', () => {
    expect(resolveSessionCookieNameFromBaseUrl('https://turbopanel.app')).toBe(
      HTTPS_SESSION_COOKIE_NAME,
    )
  })

  it('selects the plain cookie for http origins', () => {
    expect(resolveSessionCookieNameFromBaseUrl('http://localhost:8880')).toBe(
      HTTP_SESSION_COOKIE_NAME,
    )
  })

  it('defaults to the secure cookie name when the URL is invalid', () => {
    expect(resolveSessionCookieNameFromBaseUrl('not-a-url')).toBe(
      HTTPS_SESSION_COOKIE_NAME,
    )
  })
})

describe('buildScalarCookieAuthentication', () => {
  it('registers cookieAuth as the preferred scheme', () => {
    expect(buildScalarCookieAuthentication(HTTPS_SESSION_COOKIE_NAME)).toEqual({
      preferredSecurityScheme: 'cookieAuth',
      createAnySecurityScheme: false,
      securitySchemes: {
        cookieAuth: { name: HTTPS_SESSION_COOKIE_NAME },
      },
    })
  })
})

describe('buildScalarBearerAuthentication', () => {
  it('registers bearerAuth only for the daemon surface', () => {
    expect(buildScalarBearerAuthentication()).toEqual({
      preferredSecurityScheme: 'bearerAuth',
      createAnySecurityScheme: false,
      securitySchemes: {
        bearerAuth: { token: '' },
      },
    })
  })
})
