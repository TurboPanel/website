import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  createReplayGuard,
  deployTargetFromPush,
  parseWebhookSecret,
  REF_TO_ENV,
  verifySignature,
} from './hook-lib.mjs'

const SECRET = 'test-webhook-secret'
const SHA = 'a'.repeat(40)

function sign(body: Buffer, secret = SECRET): string {
  return `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`
}

describe('parseWebhookSecret', () => {
  it('reads the secret, ignoring comments, blanks and other keys', () => {
    const text = '# alpha hook\n\nOTHER=1\nnot-a-pair\n GITHUB_WEBHOOK_SECRET = s3cr3t \n'
    expect(parseWebhookSecret(text)).toBe('s3cr3t')
  })

  it('refuses an empty secret', () => {
    expect(() => parseWebhookSecret('GITHUB_WEBHOOK_SECRET=\n')).toThrow(/empty/)
  })

  it('refuses a file without the key', () => {
    expect(() => parseWebhookSecret('OTHER=1\n')).toThrow(/missing/)
  })
})

describe('verifySignature', () => {
  const body = Buffer.from(JSON.stringify({ ref: 'refs/heads/trunk', after: SHA }))

  it('accepts GitHub’s sha256 HMAC of the raw body', () => {
    expect(verifySignature(body, sign(body), SECRET)).toBe(true)
  })

  it('accepts uppercase hex', () => {
    expect(verifySignature(body, sign(body).toUpperCase().replace('SHA256=', 'sha256='), SECRET)).toBe(true)
  })

  it('refuses a signature made with another secret', () => {
    expect(verifySignature(body, sign(body, 'wrong'), SECRET)).toBe(false)
  })

  it('refuses a signature over a different body', () => {
    const tampered = Buffer.from(JSON.stringify({ ref: 'refs/heads/live', after: SHA }))
    expect(verifySignature(tampered, sign(body), SECRET)).toBe(false)
  })

  it('refuses a missing header', () => {
    expect(verifySignature(body, undefined, SECRET)).toBe(false)
  })

  it('refuses the legacy sha1 header and other prefixes', () => {
    expect(verifySignature(body, sign(body).replace('sha256=', 'sha1='), SECRET)).toBe(false)
  })

  it('refuses non-hex and odd-length digests without throwing', () => {
    expect(verifySignature(body, 'sha256=zz', SECRET)).toBe(false)
    expect(verifySignature(body, 'sha256=abc', SECRET)).toBe(false)
  })

  it('refuses a truncated digest (length checked before the constant-time compare)', () => {
    expect(verifySignature(body, sign(body).slice(0, -2), SECRET)).toBe(false)
  })
})

describe('deployTargetFromPush', () => {
  it('maps each deploy branch to its environment', () => {
    for (const [ref, envName] of Object.entries(REF_TO_ENV)) {
      expect(deployTargetFromPush({ ref, after: SHA })).toEqual({ envName, sha: SHA })
    }
  })

  it('ignores other branches and inherited object keys', () => {
    expect(deployTargetFromPush({ ref: 'refs/heads/feature', after: SHA })).toBeNull()
    expect(deployTargetFromPush({ ref: 'constructor', after: SHA })).toBeNull()
    expect(deployTargetFromPush({ ref: 'toString', after: SHA })).toBeNull()
  })

  it('ignores branch deletions (all-zero after) and malformed shas', () => {
    expect(deployTargetFromPush({ ref: 'refs/heads/trunk', after: '0'.repeat(40) })).toBeNull()
    expect(deployTargetFromPush({ ref: 'refs/heads/trunk', after: 'A'.repeat(40) })).toBeNull()
    expect(deployTargetFromPush({ ref: 'refs/heads/trunk', after: 'abc' })).toBeNull()
    expect(deployTargetFromPush({ ref: 'refs/heads/trunk' })).toBeNull()
  })

  it('ignores payloads that are not objects or lack a ref', () => {
    expect(deployTargetFromPush(null)).toBeNull()
    expect(deployTargetFromPush('push')).toBeNull()
    expect(deployTargetFromPush({ after: SHA })).toBeNull()
  })
})

describe('createReplayGuard', () => {
  it('accepts a delivery id once and refuses its replay', () => {
    const guard = createReplayGuard()
    expect(guard.firstSeen('d-1')).toBe(true)
    expect(guard.firstSeen('d-1')).toBe(false)
    expect(guard.firstSeen('d-2')).toBe(true)
  })

  it('lets a request without a delivery id through without remembering it', () => {
    const guard = createReplayGuard()
    expect(guard.firstSeen(undefined)).toBe(true)
    expect(guard.firstSeen(undefined)).toBe(true)
  })

  it('forgets the oldest id once over its limit', () => {
    const guard = createReplayGuard(2)
    guard.firstSeen('a')
    guard.firstSeen('b')
    guard.firstSeen('c')
    expect(guard.firstSeen('a')).toBe(true)
    expect(guard.firstSeen('c')).toBe(false)
  })
})
