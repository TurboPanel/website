#!/usr/bin/env node
/**
 * Assert wrangler.jsonc API_HOSTNAMES match WRANGLER_API_HOSTNAMES
 * in src/lib/control-plane-hosts.ts (single source of truth for agents).
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const hostsSource = readFileSync(
  path.join(root, 'src/lib/control-plane-hosts.ts'),
  'utf8',
)
const wranglerSource = readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8')

function extractWranglerApiHostnames(ts) {
  const marker = 'export const WRANGLER_API_HOSTNAMES'
  const start = ts.indexOf(marker)
  if (start === -1) {
    throw new Error('WRANGLER_API_HOSTNAMES not found in control-plane-hosts.ts')
  }
  const brace = ts.indexOf('{', start)
  const end = ts.indexOf('}', brace)
  if (brace === -1 || end === -1) {
    throw new Error('Could not parse WRANGLER_API_HOSTNAMES object')
  }
  const body = ts.slice(brace + 1, end)
  const out = {}
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//')) {
      continue
    }
    const colon = trimmed.indexOf(':')
    if (colon === -1) {
      continue
    }
    const key = trimmed.slice(0, colon).trim()
    const openQuote = trimmed.indexOf("'", colon)
    if (openQuote === -1) {
      continue
    }
    const closeQuote = trimmed.indexOf("'", openQuote + 1)
    if (closeQuote === -1) {
      continue
    }
    out[key] = trimmed.slice(openQuote + 1, closeQuote)
  }
  return out
}

const API_HOSTNAMES_KEY = '"API_HOSTNAMES"'

/** Read the string value of `"API_HOSTNAMES": "…"` starting at or after `fromIndex`. */
function readApiHostnamesValue(source, fromIndex = 0) {
  const keyPos = source.indexOf(API_HOSTNAMES_KEY, fromIndex)
  if (keyPos === -1) {
    return null
  }
  const colon = source.indexOf(':', keyPos + API_HOSTNAMES_KEY.length)
  if (colon === -1) {
    return null
  }
  const openQuote = source.indexOf('"', colon + 1)
  if (openQuote === -1) {
    return null
  }
  const closeQuote = source.indexOf('"', openQuote + 1)
  if (closeQuote === -1) {
    return null
  }
  return source.slice(openQuote + 1, closeQuote)
}

/**
 * Pull API_HOSTNAMES from wrangler.jsonc without a full JSONC parse
 * (trailing commas + comments are common in this file).
 */
function actualFromWrangler(jsonc) {
  const envValues = {}
  for (const env of ['testing', 'staging', 'live']) {
    const envPos = jsonc.indexOf(`"${env}"`)
    if (envPos === -1) {
      continue
    }
    const value = readApiHostnamesValue(jsonc, envPos)
    if (value !== null) {
      envValues[env] = value
    }
  }
  return {
    development: readApiHostnamesValue(jsonc, 0),
    testing: envValues.testing,
    staging: envValues.staging,
    live: envValues.live,
  }
}

const expected = extractWranglerApiHostnames(hostsSource)
const actual = actualFromWrangler(wranglerSource)

let failed = false
for (const env of Object.keys(expected).sort((a, b) => a.localeCompare(b))) {
  if (actual[env] !== expected[env]) {
    console.error(
      `API_HOSTNAMES mismatch for ${env}:\n  control-plane-hosts.ts: ${expected[env]}\n  wrangler.jsonc:         ${actual[env] ?? '(missing)'}`,
    )
    failed = true
  }
}

if (failed) {
  process.exit(1)
}

console.log('check-control-plane-hosts: wrangler.jsonc matches control-plane-hosts.ts')
