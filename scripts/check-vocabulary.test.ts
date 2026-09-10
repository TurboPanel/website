import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FORBIDDEN_PHRASES, VOCABULARY_PHRASE_SOURCE } from '@/lib/vocabulary'
import {
  isExecutedAsCli,
  runVocabularyCheck,
  startCli,
  walk,
} from './check-vocabulary.mjs'

const SELF = 'scripts/check-vocabulary.mjs'

const tempRoots: string[] = []

function createTempRoot(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-vocabulary-'))
  tempRoots.push(dir)
  return dir
}

function writeTree(root: string, files: Readonly<Record<string, string>>): void {
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(root, rel)
    mkdirSync(path.dirname(abs), { recursive: true })
    writeFileSync(abs, body)
  }
}

function walkedRelPaths(root: string, selfRel = SELF): string[] {
  const yielded = [...walk(root, root, selfRel)]
  if (!yielded.every((abs) => typeof abs === 'string')) {
    throw new TypeError('walk() must yield string paths')
  }
  return yielded.map((abs) => path.relative(root, abs)).sort((a, b) => a.localeCompare(b))
}

function recordIo(): {
  errors: string[]
  logs: string[]
  error: (...args: unknown[]) => void
  log: (...args: unknown[]) => void
} {
  const errors: string[] = []
  const logs: string[] = []
  return {
    errors,
    logs,
    error: (...args: unknown[]) => {
      errors.push(args.map(String).join(' '))
    },
    log: (...args: unknown[]) => {
      logs.push(args.map(String).join(' '))
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  for (const dir of tempRoots.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

describe('walk', () => {
  it('recurses into nested directories and yields regular files', () => {
    const root = createTempRoot()
    writeTree(root, {
      'src/ok.md': 'the host daemon enrolls\n',
      'docs/guide.mdx': 'TurboPanel daemon docs\n',
    })

    expect(walkedRelPaths(root)).toEqual(['docs/guide.mdx', 'src/ok.md'])
  })

  it('skips skip-listed directories at the script layer', () => {
    const root = createTempRoot()
    writeTree(root, {
      'src/kept.md': 'kept\n',
      'node_modules/pkg/evil.md': 'should not be walked\n',
      '.git/config.md': 'should not be walked\n',
      'coverage/lcov.info': 'should not be walked\n',
    })

    expect(walkedRelPaths(root)).toEqual(['src/kept.md'])
  })

  it('skips lockfiles, generated types, the walker, and the phrase-source module', () => {
    const root = createTempRoot()
    writeTree(root, {
      'src/kept.md': 'kept\n',
      'pnpm-lock.yaml': 'lockfile\n',
      'cloudflare-env.d.ts': 'generated\n',
      [SELF]: 'this is the walker\n',
      [VOCABULARY_PHRASE_SOURCE]: 'phrase source\n',
    })

    expect(walkedRelPaths(root)).toEqual(['src/kept.md'])
  })

  it('skips installed skill packs and does not follow non-file entries', () => {
    const root = createTempRoot()
    writeTree(root, {
      'src/kept.md': 'kept\n',
      '.agents/skills/pack/SKILL.md': 'skill pack\n',
    })
    symlinkSync(path.join(root, 'src/kept.md'), path.join(root, 'alias.md'))

    expect(walkedRelPaths(root)).toEqual(['src/kept.md'])
  })

  it('throws ENOENT when the walk root is missing', () => {
    const missing = path.join(createTempRoot(), 'does-not-exist')
    try {
      walkedRelPaths(missing)
      throw new TypeError('expected walk() to throw on a missing path')
    } catch (error) {
      if (error instanceof TypeError) {
        throw error
      }
      expect(error).toBeInstanceOf(Error)
      expect((error as NodeJS.ErrnoException).code).toBe('ENOENT')
    }
  })
})

describe('runVocabularyCheck', () => {
  it('logs success and returns 0 for a clean tree', () => {
    const root = createTempRoot()
    writeTree(root, {
      'docs/ok.mdx': 'the host daemon enrolls\n',
      'notes.png': `binary ${FORBIDDEN_PHRASES[0]} should be ignored\n`,
    })
    const io = recordIo()
    const exits: number[] = []

    const code = runVocabularyCheck({
      root,
      selfRel: SELF,
      io,
      exit: (status: number) => {
        exits.push(status)
      },
    })

    expect(code).toBe(0)
    expect(exits).toEqual([])
    expect(io.logs).toEqual(['check-vocabulary: no forbidden phrasing found.'])
    expect(io.errors).toEqual([])
  })

  it('does not fail on skip-listed or allowlisted hits at the script layer', () => {
    const root = createTempRoot()
    const phrase = FORBIDDEN_PHRASES[0]
    writeTree(root, {
      'docs/ok.mdx': `User-Agent docs mention ${phrase}\n`,
      'node_modules/pkg/hit.md': `The ${phrase} must not ship.\n`,
      [SELF]: `The ${phrase} must not ship.\n`,
      [VOCABULARY_PHRASE_SOURCE]: `The ${phrase} must not ship.\n`,
      '.agents/skills/pack/SKILL.md': `The ${phrase} must not ship.\n`,
    })
    const io = recordIo()

    expect(
      runVocabularyCheck({
        root,
        selfRel: SELF,
        io,
        exit: () => {
          throw new TypeError('clean allowlisted/skip trees must not exit')
        },
      }),
    ).toBe(0)
    expect(io.logs).toHaveLength(1)
  })

  it('prints failures and exits 1 when a scanned file is dirty', () => {
    const root = createTempRoot()
    const phrase = FORBIDDEN_PHRASES[0]
    writeTree(root, {
      'docs/bad.mdx': `intro\nThe ${phrase} must not ship.\n`,
    })
    const io = recordIo()
    const exits: number[] = []

    const code = runVocabularyCheck({
      root,
      selfRel: SELF,
      io,
      exit: (status: number) => {
        exits.push(status)
      },
    })

    expect(code).toBe(1)
    expect(exits).toEqual([1])
    expect(io.logs).toEqual([])
    expect(io.errors[0]).toBe('Vocabulary check failed:\n')
    expect(io.errors[1]).toContain(`docs/bad.mdx:2 uses forbidden phrase "${phrase}"`)
    expect(io.errors[2]).toContain('1 problem(s) found.')
  })

  it('prints every formatted hit when several scanned files are dirty', () => {
    const root = createTempRoot()
    const phrase = FORBIDDEN_PHRASES[0]
    writeTree(root, {
      'docs/one.mdx': `The ${phrase} must not ship.\n`,
      'docs/two.mdx': `Also the ${phrase} is forbidden.\n`,
    })
    const io = recordIo()

    expect(
      runVocabularyCheck({
        root,
        selfRel: SELF,
        io,
        exit: () => {},
      }),
    ).toBe(1)
    expect(io.errors.filter((line) => line.includes('uses forbidden phrase'))).toHaveLength(
      2,
    )
    expect(io.errors.some((line) => line.includes('2 problem(s) found.'))).toBe(true)
  })

  it('logs success through console when io is omitted', () => {
    const root = createTempRoot()
    writeTree(root, { 'docs/ok.mdx': 'the host daemon enrolls\n' })
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    expect(runVocabularyCheck({ root, selfRel: SELF, exit: () => {} })).toBe(0)
    expect(log).toHaveBeenCalledWith('check-vocabulary: no forbidden phrasing found.')
  })

  it('calls process.exit(1) when a dirty tree omits exit', () => {
    const root = createTempRoot()
    const phrase = FORBIDDEN_PHRASES[0]
    writeTree(root, { 'docs/bad.mdx': `The ${phrase} must not ship.\n` })
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(runVocabularyCheck({ root, selfRel: SELF })).toBe(1)
    expect(exitSpy).toHaveBeenCalledWith(1)
    expect(error).toHaveBeenCalled()
  })

  it('throws ENOENT when the check root is missing', () => {
    const missing = path.join(createTempRoot(), 'does-not-exist')
    try {
      runVocabularyCheck({
        root: missing,
        selfRel: SELF,
        exit: () => {
          throw new TypeError('missing roots must throw before exit')
        },
      })
      throw new TypeError('expected runVocabularyCheck() to throw on a missing path')
    } catch (error) {
      if (error instanceof TypeError) {
        throw error
      }
      expect((error as NodeJS.ErrnoException).code).toBe('ENOENT')
    }
  })
})

describe('isExecutedAsCli', () => {
  it('is true only when argv[1] resolves to the module URL', () => {
    const script = '/tmp/check-vocabulary.mjs'
    expect(isExecutedAsCli('file:///tmp/check-vocabulary.mjs', script)).toBe(true)
    expect(isExecutedAsCli('file:///tmp/check-vocabulary.mjs', '/tmp/other.mjs')).toBe(false)
    expect(isExecutedAsCli('file:///tmp/check-vocabulary.mjs', '')).toBe(false)
    expect(isExecutedAsCli('file:///tmp/check-vocabulary.mjs')).toBe(false)
  })
})

describe('startCli', () => {
  it('invokes the check only when the CLI predicate is true', () => {
    const invoke = vi.fn()
    startCli(() => false, invoke)
    expect(invoke).not.toHaveBeenCalled()
    startCli(() => true, invoke)
    expect(invoke).toHaveBeenCalledOnce()
  })
})
