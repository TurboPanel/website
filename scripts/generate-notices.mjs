#!/usr/bin/env node
/**
 * Generate or check THIRD_PARTY_NOTICES.md from the resolved pnpm graph.
 * Complements first-party `NOTICE` — does not replace it.
 *
 * Usage:
 *   node scripts/generate-notices.mjs
 *   node scripts/generate-notices.mjs --check
 *   pnpm notices:generate
 *   pnpm notices:check
 */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  attachNoticeText,
  enrichMissingPackageLicenses,
  evaluateLicensePolicy,
  NOTICE_POLICY_REPO_LICENSE,
  fingerprintCommentValue,
  formatPolicyFailures,
  NOTICES_FILE_NAME,
  noticePackageKey,
  noticesAreCurrent,
  packagesFromPnpmLicenses,
  pnpmLicenseKeys,
  pnpmPackagePaths,
  renderThirdPartyNotices,
} from '../src/lib/notices.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * @typedef {import('../src/lib/notices.ts').PnpmLicenseEntry} PnpmLicenseEntry
 * @typedef {import('../src/lib/notices.ts').NoticePackage} NoticePackage
 */

/**
 * @param {{
 *   root?: string
 *   argv?: string[]
 *   io?: { log: (...args: unknown[]) => void, error: (...args: unknown[]) => void }
 *   exit?: (code: number) => void
 *   spawnPnpmLicenses?: (prodOnly: boolean) => Record<string, unknown>
 *   readFile?: (target: string, encoding?: BufferEncoding) => string | Buffer
 *   writeFile?: (target: string, contents: string) => void
 *   exists?: (target: string) => boolean
 * }} [opts]
 */
export function runGenerateNotices({
  root = ROOT,
  argv = process.argv.slice(2),
  io = console,
  exit,
  spawnPnpmLicenses = (prodOnly) => loadPnpmLicenses(root, prodOnly),
  readFile = (target, encoding) => fs.readFileSync(target, encoding),
  writeFile = (target, contents) => fs.writeFileSync(target, contents),
  exists = (target) => fs.existsSync(target),
} = {}) {
  const check = argv.includes('--check')
  const leave = exit ?? ((code) => process.exit(code))

  let allGrouped
  let prodGrouped
  try {
    allGrouped = spawnPnpmLicenses(false)
    prodGrouped = spawnPnpmLicenses(true)
  } catch (error) {
    io.error(
      error instanceof Error
        ? error.message
        : 'generate-notices: failed to read pnpm licenses',
    )
    leave(1)
    return 1
  }

  const packages = attachPnpmNoticeFiles(
    enrichMissingPackageLicenses(
      packagesFromPnpmLicenses(allGrouped, pnpmLicenseKeys(prodGrouped)),
      (pkg) => readPnpmInstallLicense(root, allGrouped, pkg, exists, readFile),
    ),
    allGrouped,
    root,
    exists,
    readFile,
  )
  const policy = evaluateLicensePolicy(packages, {
    repoLicense: NOTICE_POLICY_REPO_LICENSE,
  })
  if (policy.length > 0) {
    io.error('generate-notices: unreviewed license class:\n')
    io.error(formatPolicyFailures(policy))
    leave(1)
    return 1
  }

  const markdown = renderThirdPartyNotices(packages, {
    repoLicense: 'Apache-2.0',
    productName: 'TurboPanel Website',
    regenerateCommand: 'pnpm notices:generate',
    lockfileFingerprints: {
      'pnpm-lock.yaml': fingerprintCommentValue(hashFile(root, 'pnpm-lock.yaml', readFile)),
    },
    complementNoticePath: 'NOTICE',
  })

  return finishNoticesWrite({
    check,
    exists,
    io,
    leave,
    markdown,
    noticesPath: path.join(root, NOTICES_FILE_NAME),
    packages,
    readFile,
    writeFile,
  })
}

/**
 * @param {import('../src/lib/notices.ts').NoticePackage[]} packages
 * @param {Record<string, unknown>} grouped
 * @param {string} root
 * @param {(target: string) => boolean} exists
 * @param {(target: string, encoding?: BufferEncoding) => string | Buffer} readFile
 */
export function attachPnpmNoticeFiles(packages, grouped, root, exists, readFile) {
  const paths = pnpmPackagePaths(grouped)
  return packages.map((pkg) => {
    const rel = paths.get(noticePackageKey(pkg))
    if (!rel) return pkg
    const dir = path.isAbsolute(rel) ? rel : path.join(root, rel)
    for (const name of ['NOTICE', 'NOTICE.txt', 'NOTICE.md']) {
      const candidate = path.join(dir, name)
      if (!exists(candidate)) continue
      return attachNoticeText(pkg, readFile(candidate, 'utf8'))
    }
    return pkg
  })
}

/**
 * @param {string} root
 * @param {Record<string, unknown>} grouped
 * @param {import('../src/lib/notices.ts').NoticePackage} pkg
 * @param {(target: string) => boolean} exists
 * @param {(target: string, encoding?: BufferEncoding) => string | Buffer} readFile
 * @returns {string | undefined}
 */
export function readPnpmInstallLicense(root, grouped, pkg, exists, readFile) {
  const rel = pnpmPackagePaths(grouped).get(noticePackageKey(pkg))
  if (!rel) return undefined
  const dir = path.isAbsolute(rel) ? rel : path.join(root, rel)
  return (
    licenseFromPackageJson(dir, exists, readFile) ??
    licenseFromLicenseFile(dir, exists, readFile)
  )
}

function licenseFromPackageJson(dir, exists, readFile) {
  const pkgJsonPath = path.join(dir, 'package.json')
  if (!exists(pkgJsonPath)) return undefined
  try {
    const parsed = JSON.parse(readFile(pkgJsonPath, 'utf8'))
    const field = parsed.license ?? parsed.licenses?.[0]?.type
    if (typeof field === 'string' && field.trim()) return field.trim()
  } catch {
    // Unparseable manifest — fall back to the LICENSE text probe.
  }
  return undefined
}

/** Last-resort license identification from the LICENSE file's own wording. */
const LICENSE_TEXT_MARKERS = [
  { pattern: /Apache License[\s\S]{0,80}Version 2\.0/i, license: 'Apache-2.0' },
  { pattern: /Permission is hereby granted, free of charge/i, license: 'MIT' },
  { pattern: /ISC License/i, license: 'ISC' },
]

function licenseFromLicenseFile(dir, exists, readFile) {
  for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt']) {
    const candidate = path.join(dir, name)
    if (!exists(candidate)) continue
    const text = readFile(candidate, 'utf8')
    const marker = LICENSE_TEXT_MARKERS.find((entry) => entry.pattern.test(text))
    if (marker) return marker.license
  }
  return undefined
}

/**
 * Absolute path to the pnpm CLI running this script, from the lifecycle-script
 * env. Spawning it via `process.execPath` keeps both the command and the CLI
 * fixed paths rather than a PATH lookup (javascript:S4036).
 *
 * Default is applied inside the body so the parameter stays a partial env
 * bag. Defaulting to `process.env` would infer Cloudflare's required
 * `ProcessEnv` keys and reject the unit-test fixtures.
 * @param {{ npm_execpath?: string }} [env]
 */
export function pnpmCliPath(env) {
  const execPath = (env ?? process.env).npm_execpath?.trim()
  if (!execPath || !path.basename(execPath).startsWith('pnpm')) return undefined
  return execPath
}

function isJavascriptPnpmCli(cli) {
  return /\.[cm]?js$/i.test(cli)
}

/**
 * @param {string} root
 * @param {boolean} prodOnly
 * @param {{
 *   env?: { npm_execpath?: string }
 *   spawn?: (
 *     command: string,
 *     args: readonly string[],
 *     options: { cwd: string, encoding: BufferEncoding },
 *   ) => { status: number | null, stdout: string, stderr: string }
 * }} [opts]
 */
export function loadPnpmLicenses(
  root,
  prodOnly,
  { env, spawn = spawnSync } = {},
) {
  const cli = pnpmCliPath(env)
  if (!cli) {
    throw new Error(
      'generate-notices: no pnpm CLI in npm_execpath — run `pnpm notices:generate` or `pnpm notices:check`',
    )
  }
  // pnpm 12 ships a native binary (`pnpm-native`). Spawn that directly;
  // `node <elf>` throws SyntaxError. Older JS CLIs (`.cjs` / `.js` / `.mjs`)
  // still run through `process.execPath`.
  const jsCli = isJavascriptPnpmCli(cli)
  const command = jsCli ? process.execPath : cli
  const args = jsCli
    ? [cli, 'licenses', 'list', '--json', '--long']
    : ['licenses', 'list', '--json', '--long']
  if (prodOnly) args.push('--prod')
  const result = spawn(command, args, { cwd: root, encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(
      `generate-notices: pnpm licenses list failed (${result.status}): ${result.stderr || result.stdout || 'no output'}`,
    )
  }
  return parsePnpmLicensesJson(result.stdout)
}

export function parsePnpmLicensesJson(stdout) {
  const start = stdout.indexOf('{')
  if (start === -1) {
    throw new TypeError('generate-notices: no JSON in pnpm licenses output')
  }
  const parsed = JSON.parse(stdout.slice(start))
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new TypeError('generate-notices: unexpected pnpm licenses JSON')
  }
  return parsed
}

function finishNoticesWrite({
  check,
  exists,
  io,
  leave,
  markdown,
  noticesPath,
  packages,
  readFile,
  writeFile,
}) {
  if (check) {
    if (!exists(noticesPath)) {
      io.error(`generate-notices: missing ${NOTICES_FILE_NAME} — run pnpm notices:generate`)
      leave(1)
      return 1
    }
    if (!noticesAreCurrent(readFile(noticesPath, 'utf8'), markdown)) {
      io.error(
        `generate-notices: ${NOTICES_FILE_NAME} is stale relative to the lockfile. Run pnpm notices:generate and commit the result.`,
      )
      leave(1)
      return 1
    }
    io.log(`generate-notices: ${NOTICES_FILE_NAME} is current.`)
    return 0
  }
  writeFile(noticesPath, markdown)
  io.log(`generate-notices: wrote ${NOTICES_FILE_NAME} (${packages.length} packages).`)
  return 0
}

function hashFile(root, rel, readFile) {
  const contents = readFile(path.join(root, rel))
  const buf = typeof contents === 'string' ? Buffer.from(contents) : contents
  return createHash('sha256').update(buf).digest('hex')
}

export function isExecutedAsCli(metaUrl = import.meta.url, argv1 = process.argv[1]) {
  return Boolean(argv1) && metaUrl === pathToFileURL(path.resolve(argv1)).href
}

/**
 * @param {() => boolean} [isCli]
 * @param {() => unknown} [invoke]
 */
export function startCli(isCli = isExecutedAsCli, invoke = runGenerateNotices) {
  if (isCli()) invoke()
}

startCli()
