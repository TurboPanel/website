import { describe, expect, it } from 'vitest'
import {
  attachPnpmNoticeFiles,
  isExecutedAsCli,
  loadPnpmLicenses,
  parsePnpmLicensesJson,
  pnpmCliPath,
  readPnpmInstallLicense,
  runGenerateNotices,
} from './generate-notices.mjs'

const MIT_GROUPED = {
  MIT: [
    {
      name: 'left-pad',
      versions: ['1.3.0'],
      license: 'MIT',
      paths: ['node_modules/left-pad'],
    },
  ],
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

function memoryFs(files: Record<string, string>) {
  return {
    exists: (target: string) => Object.hasOwn(files, target),
    readFile: (target: string, _encoding?: BufferEncoding) => files[target] ?? '',
    writeFile: (target: string, contents: string) => {
      files[target] = contents
    },
  }
}

function licenseFs(files: Record<string, string>) {
  const { exists, readFile } = memoryFs(files)
  return { exists, readFile }
}

describe('pnpmCliPath', () => {
  it('returns the lifecycle CLI when npm_execpath is a pnpm binary', () => {
    expect(pnpmCliPath({ npm_execpath: '/opt/pnpm/pnpm' })).toBe('/opt/pnpm/pnpm')
    expect(pnpmCliPath({ npm_execpath: '  /opt/pnpm/pnpm.cjs  ' })).toBe(
      '/opt/pnpm/pnpm.cjs',
    )
  })

  it('rejects a missing or non-pnpm npm_execpath', () => {
    expect(pnpmCliPath({})).toBeUndefined()
    expect(pnpmCliPath({ npm_execpath: '' })).toBeUndefined()
    expect(pnpmCliPath({ npm_execpath: '/usr/bin/npm' })).toBeUndefined()
  })
})

describe('parsePnpmLicensesJson', () => {
  it('parses JSON after a non-JSON prefix', () => {
    const parsed = parsePnpmLicensesJson('notice\n{"MIT":[]}')
    expect(parsed).toEqual({ MIT: [] })
  })

  it('rejects output with no object', () => {
    expect(() => parsePnpmLicensesJson('no json here')).toThrow(TypeError)
    expect(() => parsePnpmLicensesJson('[]')).toThrow(TypeError)
    expect(() => parsePnpmLicensesJson('null')).toThrow(TypeError)
  })
})

describe('loadPnpmLicenses', () => {
  it('spawns Node with the absolute pnpm CLI rather than a PATH lookup', () => {
    let command = ''
    let args: string[] = []
    const parsed = loadPnpmLicenses('/repo', true, {
      env: { npm_execpath: '/opt/pnpm/pnpm.cjs' },
      spawn: (cmd: string, spawnArgs: readonly string[]) => {
        command = cmd
        args = [...spawnArgs]
        return { status: 0, stdout: '{"MIT":[]}', stderr: '' }
      },
    })
    expect(command).toBe(process.execPath)
    expect(args).toEqual([
      '/opt/pnpm/pnpm.cjs',
      'licenses',
      'list',
      '--json',
      '--long',
      '--prod',
    ])
    expect(parsed).toEqual({ MIT: [] })
  })

  it('spawns a native pnpm binary directly instead of through Node', () => {
    let command = ''
    let args: string[] = []
    const parsed = loadPnpmLicenses('/repo', false, {
      env: { npm_execpath: '/opt/pnpm/pnpm-native' },
      spawn: (cmd: string, spawnArgs: readonly string[]) => {
        command = cmd
        args = [...spawnArgs]
        return { status: 0, stdout: '{"MIT":[]}', stderr: '' }
      },
    })
    expect(command).toBe('/opt/pnpm/pnpm-native')
    expect(args).toEqual(['licenses', 'list', '--json', '--long'])
    expect(parsed).toEqual({ MIT: [] })
  })

  it('throws when npm_execpath is not a pnpm CLI', () => {
    expect(() => loadPnpmLicenses('/repo', false, { env: {} })).toThrow(
      /no pnpm CLI in npm_execpath/,
    )
  })

  it('throws when the pnpm child exits non-zero', () => {
    expect(() =>
      loadPnpmLicenses('/repo', false, {
        env: { npm_execpath: '/opt/pnpm/pnpm' },
        spawn: () => ({ status: 1, stdout: '', stderr: 'boom' }),
      }),
    ).toThrow(/pnpm licenses list failed \(1\): boom/)
  })
})

describe('readPnpmInstallLicense', () => {
  const pkg = { name: 'demo', version: '1.0.0', license: '', role: 'production' as const }

  it('returns undefined when the install path is unknown', () => {
    expect(
      readPnpmInstallLicense('/repo', {}, pkg, () => true, () => ''),
    ).toBeUndefined()
  })

  it('prefers package.json license, then licenses[].type', () => {
    const grouped = {
      MIT: [{ name: 'demo', versions: ['1.0.0'], paths: ['pkgs/demo'] }],
    }
    const files: Record<string, string> = {
      '/repo/pkgs/demo/package.json': JSON.stringify({ license: ' BSD-3-Clause ' }),
    }
    const fsApi = licenseFs(files)
    expect(
      readPnpmInstallLicense('/repo', grouped, pkg, fsApi.exists, fsApi.readFile),
    ).toBe('BSD-3-Clause')

    files['/repo/pkgs/demo/package.json'] = JSON.stringify({
      licenses: [{ type: 'ISC' }],
    })
    expect(
      readPnpmInstallLicense('/repo', grouped, pkg, fsApi.exists, fsApi.readFile),
    ).toBe('ISC')
  })

  it('falls back to LICENSE text markers after an unparseable manifest', () => {
    const grouped = {
      MIT: [{ name: 'demo', versions: ['1.0.0'], paths: ['/abs/demo'] }],
    }
    const files: Record<string, string> = {
      '/abs/demo/package.json': '{not json',
      '/abs/demo/LICENSE.md': 'Permission is hereby granted, free of charge',
    }
    const fsApi = licenseFs(files)
    expect(
      readPnpmInstallLicense('/repo', grouped, pkg, fsApi.exists, fsApi.readFile),
    ).toBe('MIT')
  })

  it('recognizes Apache-2.0 and ISC from LICENSE files', () => {
    const grouped = {
      MIT: [{ name: 'demo', versions: ['1.0.0'], paths: ['pkgs/demo'] }],
    }
    const files: Record<string, string> = {
      '/repo/pkgs/demo/LICENSE': 'Apache License\nVersion 2.0, January 2004',
    }
    const fsApi = licenseFs(files)
    expect(
      readPnpmInstallLicense('/repo', grouped, pkg, fsApi.exists, fsApi.readFile),
    ).toBe('Apache-2.0')

    delete files['/repo/pkgs/demo/LICENSE']
    files['/repo/pkgs/demo/LICENSE.txt'] = 'ISC License\n'
    expect(
      readPnpmInstallLicense('/repo', grouped, pkg, fsApi.exists, fsApi.readFile),
    ).toBe('ISC')
  })
})

describe('attachPnpmNoticeFiles', () => {
  it('inlines NOTICE text from the install directory', () => {
    const packages = [
      { name: 'left-pad', version: '1.3.0', license: 'MIT', role: 'production' as const },
    ]
    const attached = attachPnpmNoticeFiles(
      packages,
      MIT_GROUPED,
      '/repo',
      (target: string) => target === '/repo/node_modules/left-pad/NOTICE',
      (_target: string, _encoding?: BufferEncoding) => 'Third-party notice\n',
    )
    expect(attached[0]?.noticeText).toBe('Third-party notice')
  })
})

describe('runGenerateNotices', () => {
  it('writes notices and then accepts --check against the same graph', () => {
    const files: Record<string, string> = {
      '/repo/pnpm-lock.yaml': 'lockfileVersion: 9.0\n',
    }
    const fsApi = memoryFs(files)
    const io = recordIo()
    const shared = {
      root: '/repo',
      io,
      exit: () => {},
      spawnPnpmLicenses: () => MIT_GROUPED,
      exists: fsApi.exists,
      readFile: fsApi.readFile,
      writeFile: fsApi.writeFile,
    }
    expect(runGenerateNotices({ ...shared, argv: [] })).toBe(0)
    expect(files['/repo/THIRD_PARTY_NOTICES.md']).toContain('left-pad@1.3.0')
    expect(runGenerateNotices({ ...shared, argv: ['--check'] })).toBe(0)
    expect(io.logs.some((line) => line.includes('is current'))).toBe(true)
  })

  it('fails --check when the notices file is missing or stale', () => {
    const files: Record<string, string> = {
      '/repo/pnpm-lock.yaml': 'lockfileVersion: 9.0\n',
    }
    const fsApi = memoryFs(files)
    const missing = recordIo()
    expect(
      runGenerateNotices({
        root: '/repo',
        argv: ['--check'],
        io: missing,
        exit: () => {},
        spawnPnpmLicenses: () => MIT_GROUPED,
        exists: fsApi.exists,
        readFile: fsApi.readFile,
        writeFile: fsApi.writeFile,
      }),
    ).toBe(1)
    expect(missing.errors.join('\n')).toContain('missing THIRD_PARTY_NOTICES.md')

    files['/repo/THIRD_PARTY_NOTICES.md'] = 'stale\n'
    const stale = recordIo()
    expect(
      runGenerateNotices({
        root: '/repo',
        argv: ['--check'],
        io: stale,
        exit: () => {},
        spawnPnpmLicenses: () => MIT_GROUPED,
        exists: fsApi.exists,
        readFile: fsApi.readFile,
        writeFile: fsApi.writeFile,
      }),
    ).toBe(1)
    expect(stale.errors.join('\n')).toContain('is stale')
  })

  it('fails on an unreviewed production license and on a licenses spawn error', () => {
    const io = recordIo()
    expect(
      runGenerateNotices({
        root: '/repo',
        argv: [],
        io,
        exit: () => {},
        spawnPnpmLicenses: () => ({
          'GPL-3.0-only': [
            { name: 'copyleft', versions: ['1.0.0'], license: 'GPL-3.0-only' },
          ],
        }),
        exists: () => false,
        readFile: () => '',
        writeFile: () => {},
      }),
    ).toBe(1)
    expect(io.errors.join('\n')).toContain('unreviewed license class')

    const spawnIo = recordIo()
    expect(
      runGenerateNotices({
        root: '/repo',
        argv: [],
        io: spawnIo,
        exit: () => {},
        spawnPnpmLicenses: () => {
          throw new Error('licenses unavailable')
        },
        exists: () => false,
        readFile: () => '',
        writeFile: () => {},
      }),
    ).toBe(1)
    expect(spawnIo.errors.join('\n')).toContain('licenses unavailable')
  })
})

describe('isExecutedAsCli', () => {
  it('is true only when argv[1] resolves to the module URL', () => {
    const script = '/tmp/generate-notices.mjs'
    expect(isExecutedAsCli('file:///tmp/generate-notices.mjs', script)).toBe(true)
    expect(isExecutedAsCli('file:///tmp/generate-notices.mjs', '/tmp/other.mjs')).toBe(
      false,
    )
    expect(isExecutedAsCli('file:///tmp/generate-notices.mjs', '')).toBe(false)
  })
})
