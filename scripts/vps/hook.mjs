#!/usr/bin/env node
/**
 * GitHub push webhook on 127.0.0.1:8790 (alpha). Verifies HMAC-SHA256 of the
 * raw body, maps trunk/staging/live onto a website deploy, responds 202, then
 * flocks per env so GitHub does not wait on pnpm build.
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import {
  createReplayGuard,
  deployTargetFromPush,
  parseWebhookSecret,
  verifySignature,
} from './hook-lib.mjs'

const LISTEN_HOST = '127.0.0.1'
const LISTEN_PORT = 8790
const MAX_BODY_BYTES = 1_000_000
const HOOK_ENV_PATH = join(homedir(), '.config/alpha/hook.env')
const RUN_DEPLOY = join(homedir(), 'bin/run-env-deploy.sh')
const LOCK_DIR = join(homedir(), 'locks')

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

const secret = parseWebhookSecret(readFileSync(HOOK_ENV_PATH, 'utf8'))
const replayGuard = createReplayGuard()

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

  const deliveryHeader = req.headers['x-github-delivery']
  const delivery = Array.isArray(deliveryHeader) ? deliveryHeader[0] : deliveryHeader
  if (!replayGuard.firstSeen(delivery)) {
    send(res, 409, 'duplicate delivery\n')
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
