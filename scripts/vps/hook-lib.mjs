/**
 * Pure pieces of the GitHub push webhook (`hook.mjs`): secret parsing, HMAC
 * verification, push → environment mapping, and a delivery-id replay guard.
 * Kept free of I/O so they are unit-tested; `hook.mjs` wires them to a server.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

export const REF_TO_ENV = Object.freeze({
  'refs/heads/trunk': 'testing',
  'refs/heads/staging': 'staging',
  'refs/heads/live': 'live',
})

/**
 * Read `GITHUB_WEBHOOK_SECRET=` out of hook.env text.
 * @param {string} text
 * @returns {string}
 */
export function parseWebhookSecret(text) {
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    if (trimmed.slice(0, eq).trim() !== 'GITHUB_WEBHOOK_SECRET') continue
    const value = trimmed.slice(eq + 1).trim()
    if (!value) throw new Error('GITHUB_WEBHOOK_SECRET is empty')
    return value
  }
  throw new Error('GITHUB_WEBHOOK_SECRET missing from hook.env')
}

/**
 * @param {string} hex
 * @returns {Buffer | null}
 */
function hexBuffer(hex) {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return null
  return Buffer.from(hex, 'hex')
}

/**
 * Verify GitHub's `X-Hub-Signature-256` (`sha256=<hex>`) over the raw body,
 * comparing in constant time.
 * @param {Buffer} rawBody
 * @param {string | undefined} header
 * @param {string} secret
 * @returns {boolean}
 */
export function verifySignature(rawBody, header, secret) {
  const prefix = 'sha256='
  if (!header?.startsWith(prefix)) return false
  const expected = hexBuffer(header.slice(prefix.length))
  if (!expected) return false
  const digest = createHmac('sha256', secret).update(rawBody).digest()
  if (digest.length !== expected.length) return false
  return timingSafeEqual(digest, expected)
}

/**
 * Map a push payload onto the environment it deploys, or `null` when the push
 * deploys nothing (another branch, a deletion, a malformed payload).
 * @param {unknown} payload
 * @returns {{ envName: string, sha: string } | null}
 */
export function deployTargetFromPush(payload) {
  if (typeof payload !== 'object' || payload === null) return null
  const record = /** @type {Record<string, unknown>} */ (payload)
  if (typeof record.ref !== 'string') return null
  const envName = Object.hasOwn(REF_TO_ENV, record.ref)
    ? REF_TO_ENV[/** @type {keyof typeof REF_TO_ENV} */ (record.ref)]
    : undefined
  if (!envName) return null
  const after = typeof record.after === 'string' ? record.after : ''
  if (!/^[0-9a-f]{40}$/.test(after) || /^0+$/.test(after)) return null
  return { envName, sha: after }
}

/**
 * Remembers the last `limit` `X-GitHub-Delivery` ids. A signed request that
 * is replayed verbatim carries the same id and is refused instead of
 * triggering a second deploy. A request without an id is not remembered.
 * @param {number} [limit]
 */
export function createReplayGuard(limit = 1000) {
  /** @type {Set<string>} */
  const seen = new Set()
  return {
    /**
     * @param {string | undefined} deliveryId
     * @returns {boolean} true the first time an id is seen
     */
    firstSeen(deliveryId) {
      if (!deliveryId) return true
      if (seen.has(deliveryId)) return false
      seen.add(deliveryId)
      if (seen.size > limit) {
        const oldest = seen.values().next().value
        if (oldest !== undefined) seen.delete(oldest)
      }
      return true
    },
  }
}
