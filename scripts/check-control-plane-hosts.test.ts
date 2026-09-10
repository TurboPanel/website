import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  actualFromWrangler,
  extractWranglerApiHostnames,
  isCliEntry,
  main,
  readApiHostnamesValue,
  run,
  startCli,
} from './check-control-plane-hosts.mjs'

const ALIGNED = {
  development: 'dev.example.test,Dev',
  testing: 'test.example.test,Test',
  staging: 'stage.example.test,Stage',
  live: 'live.example.test,Live',
} as const

const tempDirs: string[] = []

afterEach(() => {
  vi.restoreAllMocks()
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()
    if (dir) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
})

function assertRecord(value: unknown): asserts value is Record<string, string | undefined | null> {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('expected a record')
  }
}

function assertExitCode(value: unknown): asserts value is 0 | 1 {
  if (value !== 0 && value !== 1) {
    throw new TypeError('expected a CLI exit code of 0 or 1')
  }
}

function hostsSourceFromMap(map: Record<string, string>): string {
  const entries = Object.entries(map).map(([key, value]) => `  ${key}: '${value}',`)
  return `export const WRANGLER_API_HOSTNAMES = {\n${entries.join('\n')}\n}\n`
}

function wranglerSourceFromMap(
  map: Partial<Record<keyof typeof ALIGNED, string>>,
  extras: { comments?: boolean; omitEnvs?: readonly string[] } = {},
): string {
  const omit = new Set(extras.omitEnvs ?? [])
  const testingBlock = omit.has('testing')
    ? ''
    : `"testing": {
      "vars": {
        "API_HOSTNAMES": "${map.testing ?? ALIGNED.testing}"
      }
    }`
  const stagingBlock = omit.has('staging')
    ? ''
    : `"staging": {
      "vars": {
        "API_HOSTNAMES": "${map.staging ?? ALIGNED.staging}"
      }
    }`
  const liveBlock = omit.has('live')
    ? ''
    : `"live": {
      "vars": {
        "API_HOSTNAMES": "${map.live ?? ALIGNED.live}"
      }
    }`
  const testingComment = extras.comments ? `// "testing" is a named Wrangler env\n    ` : ''
  const developmentComment = extras.comments ? '/* development vars */\n    ' : ''
  const envParts = [testingBlock, stagingBlock, liveBlock].filter((block) => block.length > 0)
  const developmentLine = omit.has('development')
    ? ''
    : `${developmentComment}"API_HOSTNAMES": "${map.development ?? ALIGNED.development}"`
  return `{
  "vars": {
    ${developmentLine}
  },
  "env": {
    ${testingComment}${envParts.join(',\n    ')}
  }
}
`
}

function writeRepoFixture(hosts: string, wrangler: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-hosts-'))
  tempDirs.push(dir)
  mkdirSync(path.join(dir, 'src/lib'), { recursive: true })
  writeFileSync(path.join(dir, 'src/lib/control-plane-hosts.ts'), hosts)
  writeFileSync(path.join(dir, 'wrangler.jsonc'), wrangler)
  return dir
}

function captureRun(
  options: Parameters<typeof run>[0],
): { code: 0 | 1; errors: string[]; logs: string[] } {
  const errors: string[] = []
  const logs: string[] = []
  const code = run({
    ...options,
    error: (message: unknown) => {
      errors.push(String(message))
    },
    log: (message: unknown) => {
      logs.push(String(message))
    },
  })
  assertExitCode(code)
  return { code, errors, logs }
}

describe('extractWranglerApiHostnames', () => {
  it('parses aligned single-quoted host entries', () => {
    const parsed = extractWranglerApiHostnames(hostsSourceFromMap(ALIGNED))
    assertRecord(parsed)
    expect(parsed).toEqual(ALIGNED)
  })

  it('skips comments, blank lines, and lines without a colon', () => {
    const source = `export const WRANGLER_API_HOSTNAMES = {
  // ignored comment
  development: '${ALIGNED.development}',

  leftover text
  testing: '${ALIGNED.testing}',
}
`
    const parsed = extractWranglerApiHostnames(source)
    assertRecord(parsed)
    expect(parsed).toEqual({
      development: ALIGNED.development,
      testing: ALIGNED.testing,
    })
  })

  it('skips quote mismatches (double quotes, missing open, missing close)', () => {
    const source = `export const WRANGLER_API_HOSTNAMES = {
  development: "dev.example.test,Dev",
  testing: ${ALIGNED.testing},
  staging: '${ALIGNED.staging}
  live: '${ALIGNED.live}',
}
`
    const parsed = extractWranglerApiHostnames(source)
    assertRecord(parsed)
    expect(parsed).toEqual({ live: ALIGNED.live })
  })

  it('throws when the WRANGLER_API_HOSTNAMES marker is missing', () => {
    expect(() => extractWranglerApiHostnames('export const OTHER = { live: "x" }')).toThrow(
      'WRANGLER_API_HOSTNAMES not found in control-plane-hosts.ts',
    )
  })

  it('throws when the object braces cannot be parsed', () => {
    expect(() =>
      extractWranglerApiHostnames('export const WRANGLER_API_HOSTNAMES = no-object'),
    ).toThrow('Could not parse WRANGLER_API_HOSTNAMES object')
    expect(() => extractWranglerApiHostnames('export const WRANGLER_API_HOSTNAMES = {')).toThrow(
      'Could not parse WRANGLER_API_HOSTNAMES object',
    )
  })
})

describe('readApiHostnamesValue', () => {
  it('reads the quoted value after the key', () => {
    expect(readApiHostnamesValue(`"API_HOSTNAMES": "${ALIGNED.development}"`)).toBe(
      ALIGNED.development,
    )
  })

  it('returns null when the key, colon, or quotes are missing', () => {
    expect(readApiHostnamesValue('{"vars":{}}')).toBeNull()
    expect(readApiHostnamesValue('"API_HOSTNAMES" "dev.example.test,Dev"')).toBeNull()
    expect(readApiHostnamesValue('"API_HOSTNAMES": unquoted')).toBeNull()
    expect(readApiHostnamesValue('"API_HOSTNAMES": "unclosed')).toBeNull()
  })

  it('starts the key search at fromIndex', () => {
    const source = `"API_HOSTNAMES": "${ALIGNED.development}" later "API_HOSTNAMES": "${ALIGNED.testing}"`
    const secondKey = source.indexOf('"API_HOSTNAMES"', 1)
    expect(readApiHostnamesValue(source, secondKey)).toBe(ALIGNED.testing)
  })
})

describe('actualFromWrangler', () => {
  it('reads development plus named env hostnames', () => {
    const actual = actualFromWrangler(wranglerSourceFromMap(ALIGNED))
    assertRecord(actual)
    expect(actual).toEqual(ALIGNED)
  })

  it('still aligns when wrangler.jsonc has comments', () => {
    const actual = actualFromWrangler(wranglerSourceFromMap(ALIGNED, { comments: true }))
    assertRecord(actual)
    expect(actual).toEqual(ALIGNED)
  })

  it('omits named envs that are missing or have no API_HOSTNAMES value', () => {
    const actual = actualFromWrangler(
      wranglerSourceFromMap(ALIGNED, { omitEnvs: ['staging', 'live'] }),
    )
    assertRecord(actual)
    expect(actual.development).toBe(ALIGNED.development)
    expect(actual.testing).toBe(ALIGNED.testing)
    expect(actual.staging).toBeUndefined()
    expect(actual.live).toBeUndefined()
  })

  it('leaves named env values unset when the env key is absent', () => {
    const actual = actualFromWrangler(`{
  "vars": {
    "API_HOSTNAMES": "${ALIGNED.development}"
  },
  "env": {}
}
`)
    assertRecord(actual)
    expect(actual.development).toBe(ALIGNED.development)
    expect(actual.testing).toBeUndefined()
    expect(actual.staging).toBeUndefined()
    expect(actual.live).toBeUndefined()
  })

  it('ignores a named env whose API_HOSTNAMES value cannot be read', () => {
    const actual = actualFromWrangler(`{
  "vars": {
    "API_HOSTNAMES": "${ALIGNED.development}"
  },
  "env": {
    "testing": { "vars": { "OTHER": "x" } }
  }
}
`)
    assertRecord(actual)
    expect(actual.development).toBe(ALIGNED.development)
    expect(actual.testing).toBeUndefined()
  })
})

describe('run', () => {
  it('returns 0 when fixture hosts are aligned', () => {
    const { code, logs, errors } = captureRun({
      hostsSource: hostsSourceFromMap(ALIGNED),
      wranglerSource: wranglerSourceFromMap(ALIGNED, { comments: true }),
    })
    expect(code).toBe(0)
    expect(errors).toEqual([])
    expect(logs).toEqual([
      'check-control-plane-hosts: wrangler.jsonc matches control-plane-hosts.ts',
    ])
  })

  it('returns 1 when a wrangler value is missing or mismatched', () => {
    const { code, errors, logs } = captureRun({
      hostsSource: hostsSourceFromMap(ALIGNED),
      wranglerSource: wranglerSourceFromMap(
        { ...ALIGNED, testing: 'other.example.test,Other' },
        { omitEnvs: ['live'] },
      ),
    })
    expect(code).toBe(1)
    expect(logs).toEqual([])
    expect(errors.some((line) => line.includes('API_HOSTNAMES mismatch for live'))).toBe(true)
    expect(errors.some((line) => line.includes('(missing)'))).toBe(true)
    expect(errors.some((line) => line.includes('API_HOSTNAMES mismatch for testing'))).toBe(true)
    expect(errors.some((line) => line.includes('other.example.test,Other'))).toBe(true)
  })

  it('reads a fixture repo layout from root', () => {
    const dir = writeRepoFixture(
      hostsSourceFromMap(ALIGNED),
      wranglerSourceFromMap(ALIGNED, { comments: true }),
    )
    const { code, logs } = captureRun({ root: dir })
    expect(code).toBe(0)
    expect(logs[0]).toContain('matches control-plane-hosts.ts')
  })

  it('reads explicit hostsPath and wranglerPath', () => {
    const dir = writeRepoFixture(hostsSourceFromMap(ALIGNED), wranglerSourceFromMap(ALIGNED))
    const { code } = captureRun({
      hostsPath: path.join(dir, 'src/lib/control-plane-hosts.ts'),
      wranglerPath: path.join(dir, 'wrangler.jsonc'),
    })
    expect(code).toBe(0)
  })

  it('throws when the hosts file is missing the map', () => {
    expect(() =>
      run({
        hostsSource: 'export const WEBSITE_HOST_TO_CONTROL_PLANE = {}',
        wranglerSource: wranglerSourceFromMap(ALIGNED),
      }),
    ).toThrow('WRANGLER_API_HOSTNAMES not found in control-plane-hosts.ts')
  })

  it('returns 1 when wrangler quotes are unclosed or the key has no colon', () => {
    const wrangler = `{
  "vars": {
    "API_HOSTNAMES"
  },
  "env": {
    "testing": { "vars": { "API_HOSTNAMES": "${ALIGNED.testing}" } },
    "staging": { "vars": { "API_HOSTNAMES": "unclosed
}
`
    const { code, errors } = captureRun({
      hostsSource: hostsSourceFromMap(ALIGNED),
      wranglerSource: wrangler,
    })
    expect(code).toBe(1)
    expect(errors.some((line) => line.includes('mismatch for development'))).toBe(true)
    expect(errors.some((line) => line.includes('(missing)'))).toBe(true)
    expect(errors.some((line) => line.includes('mismatch for staging'))).toBe(true)
  })

  it('logs success through console when log is omitted', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    expect(
      run({
        hostsSource: hostsSourceFromMap(ALIGNED),
        wranglerSource: wranglerSourceFromMap(ALIGNED),
      }),
    ).toBe(0)
    expect(log).toHaveBeenCalledWith(
      'check-control-plane-hosts: wrangler.jsonc matches control-plane-hosts.ts',
    )
  })

  it('reports mismatches through console.error when error is omitted', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(
      run({
        hostsSource: hostsSourceFromMap(ALIGNED),
        wranglerSource: wranglerSourceFromMap({
          ...ALIGNED,
          testing: 'other.example.test,Other',
        }),
      }),
    ).toBe(1)
    expect(error.mock.calls.some((args) => String(args[0]).includes('mismatch for testing'))).toBe(
      true,
    )
  })

  it('returns 0 against this checkout when sources are not injected', () => {
    const { code, logs } = captureRun({})
    expect(code).toBe(0)
    expect(logs[0]).toContain('matches control-plane-hosts.ts')
  })
})

describe('isCliEntry', () => {
  it('is true only when argv[1] resolves to the module URL', () => {
    const script = '/tmp/check-control-plane-hosts.mjs'
    expect(isCliEntry(script, 'file:///tmp/check-control-plane-hosts.mjs')).toBe(true)
    expect(isCliEntry('/tmp/other.mjs', 'file:///tmp/check-control-plane-hosts.mjs')).toBe(
      false,
    )
    expect(isCliEntry('', 'file:///tmp/check-control-plane-hosts.mjs')).toBe(false)
    expect(isCliEntry()).toBe(false)
  })
})

describe('main', () => {
  it('does not call exit on success', () => {
    const exit = vi.fn()
    expect(
      main(
        {
          hostsSource: hostsSourceFromMap(ALIGNED),
          wranglerSource: wranglerSourceFromMap(ALIGNED),
          log: () => {},
        },
        exit,
      ),
    ).toBe(0)
    expect(exit).not.toHaveBeenCalled()
  })

  it('forwards a mismatch status to process.exit', () => {
    const exit = vi.fn()
    expect(
      main(
        {
          hostsSource: hostsSourceFromMap(ALIGNED),
          wranglerSource: wranglerSourceFromMap({
            ...ALIGNED,
            live: 'other.example.test,Other',
          }),
          error: () => {},
        },
        exit,
      ),
    ).toBe(1)
    expect(exit).toHaveBeenCalledWith(1)
  })

  it('uses process.exit when a mismatch omits the exit argument', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(
      main({
        hostsSource: hostsSourceFromMap(ALIGNED),
        wranglerSource: wranglerSourceFromMap({
          ...ALIGNED,
          live: 'other.example.test,Other',
        }),
      }),
    ).toBe(1)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})

describe('startCli', () => {
  it('invokes main only when the CLI predicate is true', () => {
    const invoke = vi.fn()
    startCli(() => false, invoke)
    expect(invoke).not.toHaveBeenCalled()
    startCli(() => true, invoke)
    expect(invoke).toHaveBeenCalledOnce()
  })
})
