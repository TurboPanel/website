#!/usr/bin/env node
/**
 * Usage: ci-gate.mjs <sha>
 * Exits 0 once the commit's required GitHub checks pass; exits 1 if one fails
 * or they are still pending after 30 minutes. run-env-deploy.sh calls this
 * before building, so the VPS only deploys commits CI verified. An optional
 * GITHUB_TOKEN raises the API rate limit; the repo is public, so none is
 * required.
 */
import { setTimeout as sleep } from 'node:timers/promises'
import { waitForCiGate } from './ci-gate-lib.mjs'

const sha = process.argv[2] ?? ''
const token = process.env.GITHUB_TOKEN

/** @param {string} url */
async function fetchJson(url) {
  /** @type {Record<string, string>} */
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'turbopanel-website-ci-gate' }
  if (token) headers.authorization = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`GitHub checks API answered ${res.status} for ${url}`)
  return res.json()
}

try {
  const decision = await waitForCiGate({
    sha,
    fetchJson,
    sleep: (ms) => sleep(ms),
    now: () => Date.now(),
    deadlineMs: 30 * 60 * 1000,
    intervalMs: 60 * 1000,
    log: (line) => console.log(line),
  })
  process.exit(decision === 'pass' ? 0 : 1)
} catch (error) {
  console.error(`ci-gate: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
