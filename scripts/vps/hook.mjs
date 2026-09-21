#!/usr/bin/env node
/**
 * GitHub push webhook on 127.0.0.1:8790 (alpha). Verifies HMAC-SHA256 of the
 * raw body, maps trunk/staging/live onto a website deploy, responds 202, then
 * flocks per env so GitHub does not wait on pnpm build.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const LISTEN_HOST = '127.0.0.1'
const LISTEN_PORT = 8790
const MAX_BODY_BYTES = 1_000_000
const HOOK_ENV_PATH = join(homedir(), '.config/alpha/hook.env')
const RUN_DEPLOY = join(homedir(), 'bin/run-env-deploy.sh')
const LOCK_DIR = join(homedir(), 'locks')

const REF_TO_ENV = {
  'refs/heads/trunk': 'testing',
  'refs/heads/staging': 'staging',
  'refs/heads/live': 'live',
}

/**
 * @param {string} path
 * @returns {string}
 */
function readWebhookSecret(path) {
  const text = readFileSync(path, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    if (key !== 'GITHUB_WEBHOOK_SECRET') continue
    const value = trimmed.slice(eq + 1).trim()
    if (!value) {
      throw new Error('GITHUB_WEBHOOK_SECRET is empty')
    }
    return value
  }
  throw new Error('GITHUB_WEBHOOK_SECRET missing from hook.env')
}

/**
 * @param {string} hex
 * @returns {Buffer | null}
 */
function hexBuffer(hex) {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
    return null
  }
  return Buffer.from(hex, 'hex')
}

/**
 * @param {Buffer} rawBody
 * @param {string | undefined} header
 * @param {string} secret
 * @returns {boolean}
 */
function verifySignature(rawBody, header, secret) {
  const prefix = 'sha256='
  if (!header?.startsWith(prefix)) {
    return false
  }
  const expected = hexBuffer(header.slice(prefix.length))
  if (!expected) {
    return false
  }
  const digest = createHmac('sha256', secret).update(rawBody).digest()
  if (digest.length !== expected.length) {
    return false
  }
  return timingSafeEqual(digest, expected)
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<Buffer>}
 */
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0
    req.on('data', (chunk) => {
      total += chunk.length
      if (total > MAX_BODY_BYTES) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    req.on('error', reject)
  })
}

/**
 * @param {import('node:http').ServerResponse} res
 * @param {number} status
 * @param {string} [body]
 */
function send(res, status, body = '') {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' })
  res.end(body)
}

/**
 * @param {string} envName
 * @param {string} sha
 */
function startLockedDeploy(envName, sha) {
  const lock = join(LOCK_DIR, envName)
  const child = spawn('/usr/bin/flock', [lock, RUN_DEPLOY, envName, sha], {
    detached: true,
    stdio: 'ignore',
  })
  child.unref()
}

/**
 * @param {unknown} payload
 * @returns {{ envName: string, sha: string } | null}
 */
function deployTargetFromPush(payload) {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }
  const record = /** @type {Record<string, unknown>} */ (payload)
  if (typeof record.ref !== 'string') {
    return null
  }
  const envName = REF_TO_ENV[record.ref]
  if (!envName) {
    return null
  }
  const after = typeof record.after === 'string' ? record.after : ''
  if (!/^[0-9a-f]{40}$/.test(after) || /^0+$/.test(after)) {
    return null
  }
  return { envName, sha: after }
}

const secret = readWebhookSecret(HOOK_ENV_PATH)

const server = createServer((req, res) => {
  void handleRequest(req, res)
})

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handleRequest(req, res) {
  if (req.method !== 'POST') {
    send(res, 405, 'method not allowed\n')
    return
  }

  let rawBody
  try {
    rawBody = await readRawBody(req)
  } catch {
    send(res, 413, 'payload too large\n')
    return
  }

  const signature = req.headers['x-hub-signature-256']
  const header = Array.isArray(signature) ? signature[0] : signature
  if (!verifySignature(rawBody, header, secret)) {
    send(res, 401, 'invalid signature\n')
    return
  }

  const eventHeader = req.headers['x-github-event']
  const event = Array.isArray(eventHeader) ? eventHeader[0] : eventHeader
  if (event === 'ping') {
    send(res, 200, 'pong\n')
    return
  }
  if (event !== 'push') {
    send(res, 204)
    return
  }

  let payload
  try {
    payload = JSON.parse(rawBody.toString('utf8'))
  } catch {
    send(res, 400, 'invalid json\n')
    return
  }

  const target = deployTargetFromPush(payload)
  if (!target) {
    send(res, 204)
    return
  }

  send(res, 202, 'accepted\n')
  startLockedDeploy(target.envName, target.sha)
}

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`webhook listening on ${LISTEN_HOST}:${LISTEN_PORT}`)
})
