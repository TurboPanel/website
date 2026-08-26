#!/usr/bin/env node
/**
 * Vocabulary check (CI guard).
 *
 * Scans human-authored marketing copy, docs (MDX), and maintainer docs for
 * forbidden daemon-as-agent phrasing. Phrase list, skip/allowlist, and
 * per-file scan live in `src/lib/vocabulary.ts`.
 *
 * Usage:
 *   node scripts/check-vocabulary.mjs
 *   pnpm check:vocabulary
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  formatVocabularyFailure,
  isSkippedDirName,
  isSkippedFileName,
  scanTextForForbiddenPhrases,
  shouldScanFile,
} from '../src/lib/vocabulary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SELF = path.relative(ROOT, fileURLToPath(import.meta.url))

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    const rel = path.relative(ROOT, abs)
    if (entry.isDirectory()) {
      if (isSkippedDirName(entry.name, rel, SELF)) continue
      yield* walk(abs)
    } else if (entry.isFile() && !isSkippedFileName(entry.name, rel, SELF)) {
      yield abs
    }
  }
}

const failures = []

for (const file of walk(ROOT)) {
  if (!shouldScanFile(file)) continue
  const rel = path.relative(ROOT, file)
  const text = fs.readFileSync(file, 'utf8')
  for (const failure of scanTextForForbiddenPhrases(rel, text)) {
    failures.push(formatVocabularyFailure(failure))
  }
}

if (failures.length > 0) {
  console.error('Vocabulary check failed:\n')
  for (const failure of failures) {
    console.error(`  \u2717 ${failure}`)
  }
  console.error(
    `\n${failures.length} problem(s) found. The TurboPanel daemon is a "daemon" / "host daemon" / "turbopaneld", never an "agent". ` +
      'Update the allowlist in src/lib/vocabulary.ts (and the daemon/instance copies) if this is a legitimate coding-agent or third-party reference.',
  )
  process.exit(1)
}

console.log('check-vocabulary: no daemon-as-agent phrasing found.')
