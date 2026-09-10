#!/usr/bin/env node
/**
 * Assert wrangler.jsonc API_HOSTNAMES match WRANGLER_API_HOSTNAMES
 * in src/lib/control-plane-hosts.ts (single source of truth for agents).
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

export function extractWranglerApiHostnames(ts) {
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

export const API_HOSTNAMES_KEY = '"API_HOSTNAMES"'

/** Read the string value of `"API_HOSTNAMES": "…"` starting at or after `fromIndex`. */
export function readApiHostnamesValue(source, fromIndex = 0) {
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
export function actualFromWrangler(jsonc) {
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

/**
 * Compare host-map sources (or files under `root`) and return a CLI exit code.
 *
 * @param {{
 *   root?: string,
 *   hostsPath?: string,
 *   wranglerPath?: string,
 *   hostsSource?: string,
 *   wranglerSource?: string,
 *   log?: (...args: unknown[]) => void,
 *   error?: (...args: unknown[]) => void,
 * }} [options]
 * @returns {0 | 1}
 */
export function run(options = {}) {
  const log = options.log ?? console.log
  const error = options.error ?? console.error
  const rootDir = options.root ?? root
  const hostsSource =
    options.hostsSource ??
    readFileSync(
      options.hostsPath ?? path.join(rootDir, 'src/lib/control-plane-hosts.ts'),
      'utf8',
    )
  const wranglerSource =
    options.wranglerSource ??
    readFileSync(options.wranglerPath ?? path.join(rootDir, 'wrangler.jsonc'), 'utf8')

  const expected = extractWranglerApiHostnames(hostsSource)
  const actual = actualFromWrangler(wranglerSource)

  let failed = false
  for (const env of Object.keys(expected).sort((a, b) => a.localeCompare(b))) {
    if (actual[env] !== expected[env]) {
      error(
        `API_HOSTNAMES mismatch for ${env}:\n  control-plane-hosts.ts: ${expected[env]}\n  wrangler.jsonc:         ${actual[env] ?? '(missing)'}`,
      )
      failed = true
    }
  }

  if (failed) {
    return 1
  }

  log('check-control-plane-hosts: wrangler.jsonc matches control-plane-hosts.ts')
  return 0
}

/**
 * @param {string} [argv1]
 * @param {string} [href]
 * @returns {boolean}
 */
export function isCliEntry(argv1 = process.argv[1], href = import.meta.url) {
  if (!argv1) {
    return false
  }
  return href === pathToFileURL(path.resolve(argv1)).href
}

/**
 * Success returns without calling `exit` so a CLI import can fall through.
 * A non-zero `run` status is forwarded to `exit` (default `process.exit`).
 *
 * @param {Parameters<typeof run>[0]} [opts]
 * @param {(code?: number) => void} [exit]
 * @returns {0 | 1}
 */
export function main(opts = {}, exit = process.exit) {
  const code = run(opts)
  if (code !== 0) {
    exit(code)
  }
  return code
}

/**
 * @param {() => boolean} [entry]
 * @param {() => unknown} [invoke]
 */
export function startCli(entry = isCliEntry, invoke = main) {
  if (entry()) invoke()
}

startCli()
