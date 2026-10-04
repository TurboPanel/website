import { describe, expect, it } from 'vitest'
import {
  FORBIDDEN_PHRASES,
  formatVocabularyFailure,
  formatVocabularyWarning,
  GENERATED_TYPE_FILES,
  isAllowlisted,
  isSkippedDirName,
  isSkippedFileName,
  isSkippedPath,
  scanTextForForbiddenPhrases,
  scanTextForWarnings,
  shouldScanFile,
  SKIP_DIR_NAMES,
  SKIP_FILENAMES,
  VOCABULARY_PHRASE_SOURCE,
} from '@/lib/vocabulary'

const SELF = 'scripts/check-vocabulary.mjs'

describe('isSkippedPath', () => {
  it('skips the walker script and the phrase-source module', () => {
    expect(isSkippedPath(SELF, SELF)).toBe(true)
    expect(isSkippedPath(VOCABULARY_PHRASE_SOURCE, SELF)).toBe(true)
    expect(isSkippedPath('src/lib/docs-ssr.ts', SELF)).toBe(false)
  })

  it('skips installed agent-skill packs at any depth', () => {
    expect(isSkippedPath('.agents/skills', SELF)).toBe(true)
    expect(isSkippedPath('.agents/skills/', SELF)).toBe(true)
    expect(isSkippedPath('.agents/skills/ui-ux-pro-max/SKILL.md', SELF)).toBe(true)
    expect(isSkippedPath('vendor/.agents/skills/pack/x.ts', SELF)).toBe(true)
    expect(isSkippedPath('.agents/other/file.ts', SELF)).toBe(false)
    expect(isSkippedPath('.agents/skillsfoo/x.ts', SELF)).toBe(false)
    expect(isSkippedPath('foo.agents/skills/x.ts', SELF)).toBe(false)
  })
})

describe('isSkippedDirName', () => {
  it('skips known generated and vendor directories', () => {
    for (const name of SKIP_DIR_NAMES) {
      expect(isSkippedDirName(name, name, SELF)).toBe(true)
    }
    expect(isSkippedDirName('src', 'src', SELF)).toBe(false)
    expect(isSkippedDirName('skills', '.agents/skills', SELF)).toBe(true)
  })
})

describe('isSkippedFileName', () => {
  it('skips lockfiles and generated type declarations', () => {
    for (const name of SKIP_FILENAMES) {
      expect(isSkippedFileName(name, name, SELF)).toBe(true)
    }
    for (const name of GENERATED_TYPE_FILES) {
      expect(isSkippedFileName(name, name, SELF)).toBe(true)
    }
    expect(isSkippedFileName('vocabulary.ts', VOCABULARY_PHRASE_SOURCE, SELF)).toBe(true)
    expect(isSkippedFileName('AGENTS.md', 'AGENTS.md', SELF)).toBe(false)
  })
})

describe('shouldScanFile', () => {
  it('matches hand-authored source and docs extensions', () => {
    expect(shouldScanFile('docs/architecture.mdx')).toBe(true)
    expect(shouldScanFile('src/lib/vocabulary.ts')).toBe(true)
    expect(shouldScanFile('scripts/check-vocabulary.mjs')).toBe(true)
    expect(shouldScanFile('src/app/page.tsx')).toBe(true)
    expect(shouldScanFile('src/lib/env.js')).toBe(true)
    expect(shouldScanFile('src/components/Logo.jsx')).toBe(true)
    expect(shouldScanFile('scripts/legacy.cjs')).toBe(true)
    expect(shouldScanFile('docs/guide.md')).toBe(true)
    expect(shouldScanFile('.github/workflows/verify.yml')).toBe(true)
    expect(shouldScanFile('orchestration/playbook.yaml')).toBe(true)
    expect(shouldScanFile('package.json')).toBe(true)
    expect(shouldScanFile('scripts/run.sh')).toBe(true)
    expect(shouldScanFile('src/app/globals.css')).toBe(true)
    expect(shouldScanFile('tsconfig.jsonc')).toBe(false)
    expect(shouldScanFile('public/brand/turbopanel-logo.svg')).toBe(false)
    expect(shouldScanFile('README.TS')).toBe(false)
    expect(shouldScanFile('LICENSE')).toBe(false)
  })
})

describe('isAllowlisted', () => {
  it('allows HTTP User-Agent, skill packs, and coding-agent policy copy', () => {
    expect(isAllowlisted('User-Agent: curl/8.0')).toBe(true)
    expect(isAllowlisted('See .agents/skills/ui-ux-pro-max')).toBe(true)
    expect(isAllowlisted('### Agent policy')).toBe(true)
    expect(isAllowlisted('coding-agent tooling lives under AGENTS.md')).toBe(true)
    expect(isAllowlisted('coding agent maintenance notes')).toBe(true)
    expect(isAllowlisted('Keep agent maintenance docs current.')).toBe(true)
    expect(isAllowlisted('depends on https-proxy-agent')).toBe(true)
    expect(isAllowlisted('import "@scalar/agent-chat"')).toBe(true)
    expect(isAllowlisted('agent-cli-detector')).toBe(true)
    expect(isAllowlisted('peer of agent-base')).toBe(true)
    expect(isAllowlisted('  ## Agent notes')).toBe(true)
    expect(isAllowlisted('#Agent tight heading')).toBe(true)
    expect(isAllowlisted('## agents plural heading')).toBe(false)
    expect(isAllowlisted('Plain daemon copy')).toBe(false)
  })
})

describe('scanTextForForbiddenPhrases', () => {
  it('flags every forbidden phrase and reports 1-based lines', () => {
    for (const phrase of FORBIDDEN_PHRASES) {
      const failures = scanTextForForbiddenPhrases(
        'docs/example.mdx',
        `intro\nThe ${phrase} must not ship.\n`,
      )
      if (failures.length !== 1) {
        throw new TypeError(`expected one failure for ${phrase}`)
      }
      expect(failures[0]).toEqual({
        rel: 'docs/example.mdx',
        line: 2,
        phrase,
      })
    }
  })

  it('is case-insensitive and can report several phrases on one line', () => {
    const [first, second] = FORBIDDEN_PHRASES
    const failures = scanTextForForbiddenPhrases(
      'src/copy.ts',
      `${first.toUpperCase()} and ${second}`,
    )
    expect(failures.map((row) => row.phrase).sort((a, b) => a.localeCompare(b))).toEqual(
      [first, second].sort((a, b) => a.localeCompare(b)),
    )
  })

  it('does not flag allowlisted lines that contain a forbidden substring', () => {
    const phrase = FORBIDDEN_PHRASES[0]
    expect(
      scanTextForForbiddenPhrases('AGENTS.md', `User-Agent docs mention ${phrase}`),
    ).toEqual([])
  })

  it('does not flag camelCase expo-glass-effect identifiers', () => {
    expect(
      scanTextForForbiddenPhrases(
        'src/components/glass/glass-surface.tsx',
        'return isLiquidGlassAvailable() && isGlassEffectAPIAvailable()',
      ),
    ).toEqual([])
  })

  it('returns no failures for empty or blank files', () => {
    expect(scanTextForForbiddenPhrases('docs/empty.mdx', '')).toEqual([])
    expect(scanTextForForbiddenPhrases('docs/blank.mdx', '\n\n   \n')).toEqual([])
  })
})

describe('formatVocabularyFailure', () => {
  it('renders the CLI failure line', () => {
    expect(
      formatVocabularyFailure({
        rel: 'docs/x.mdx',
        line: 4,
        phrase: FORBIDDEN_PHRASES[0],
      }),
    ).toBe(
      `docs/x.mdx:4 uses forbidden phrase "${FORBIDDEN_PHRASES[0]}"`,
    )
  })
})

describe('scanTextForWarnings (warn mode)', () => {
  it('reports the retired customer words', () => {
    const text = [
      'Sign in to the console.',
      'Ask the instance owner.',
      'Instance CA downloaded',
      'On a hosted instance.',
      'Enrol a remote node.',
      'Update the fleet.',
    ].join('\n')
    expect(scanTextForWarnings('src/x.tsx', text).map((w) => w.phrase)).toEqual([
      'the console',
      'instance owner',
      'Instance CA',
      'hosted instance',
      'remote node',
      'fleet',
    ])
  })

  it('leaves tool names and identifiers alone', () => {
    const text = [
      'console.log("the console")',
      'Run ./console from the dev checkout',
      'The dev console converges the stack.',
      "case 'fleet':",
      'fleet-capacity.ts and fleet.mass_disconnect and summarizeFleetSteps',
    ].join('\n')
    expect(scanTextForWarnings('src/x.ts', text)).toEqual([])
  })

  it('skips the glossary page and formats a warning line', () => {
    expect(scanTextForWarnings('docs/terminology.mdx', 'console fleet the console')).toEqual([])
    expect(formatVocabularyWarning({ rel: 'a.md', line: 3, phrase: 'fleet' })).toBe(
      'a.md:3 says "fleet" (see the terminology page)',
    )
  })
})
