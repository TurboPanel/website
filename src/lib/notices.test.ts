import { describe, expect, it } from 'vitest'
import {
  NOTICE_POLICY_REPO_LICENSE,
  attachLicensesFromMap,
  attachNoticeText,
  authorToCopyright,
  classifyLicense,
  defaultLicenseForPackageName,
  enrichMissingPackageLicenses,
  evaluateLicensePolicy,
  fillMissingLicenses,
  fingerprintCommentValue,
  formatPolicyFailures,
  mergeNoticePackages,
  needsLicenseLookup,
  noticesAreCurrent,
  packagesFromDenoLock,
  packagesFromNpmLockfile,
  packagesFromOrchestrationPins,
  packagesFromPnpmLicenses,
  packagesFromPodfileLock,
  pnpmLicenseKeys,
  pnpmPackagePaths,
  renderThirdPartyNotices,
  sortNoticePackages,
  type NoticePackage,
} from './notices'

const renderOpts = {
  repoLicense: 'Apache-2.0',
  productName: 'TurboPanel Website',
  regenerateCommand: 'pnpm notices:generate',
  lockfileFingerprints: { 'pnpm-lock.yaml': 'sha256:abc' },
} as const

function pkg(
  overrides: Partial<NoticePackage> & Pick<NoticePackage, 'name' | 'license'>,
): NoticePackage {
  return {
    version: '1.0.0',
    role: 'production',
    ...overrides,
  }
}

describe('packagesFromPnpmLicenses', () => {
  it('marks packages absent from the production listing as development-only', () => {
    const all = {
      MIT: [
        {
          name: 'react',
          versions: ['19.2.3'],
          license: 'MIT',
          author: 'Meta',
          homepage: 'https://react.dev',
        },
      ],
      'MPL-2.0': [
        {
          name: '@resvg/resvg-js',
          versions: ['2.6.2'],
          license: 'MPL-2.0',
        },
      ],
    }
    const prod = pnpmLicenseKeys({
      MIT: [{ name: 'react', versions: ['19.2.3'], license: 'MIT' }],
    })
    const packages = packagesFromPnpmLicenses(all, prod)
    const resvg = packages.find((row) => row.name === '@resvg/resvg-js')
    const react = packages.find((row) => row.name === 'react')
    if (!resvg || !react) {
      throw new TypeError('expected both packages')
    }
    expect(resvg.role).toBe('development')
    expect(react.role).toBe('production')
    expect(react.copyright).toBe('Meta')
  })
})

describe('packagesFromNpmLockfile', () => {
  it('treats lockfile dev:true as development-only', () => {
    const packages = packagesFromNpmLockfile({
      packages: {
        '': { name: 'tool' },
        'node_modules/wrangler': {
          version: '4.124.0',
          license: 'MIT',
          dev: true,
        },
        'node_modules/miniflare': {
          version: '4.0.0',
          license: 'MIT',
          dev: true,
        },
      },
    })
    expect(packages.every((row) => row.role === 'development')).toBe(true)
    expect(packages.map((row) => row.name).sort((a, b) => a.localeCompare(b))).toEqual([
      'miniflare',
      'wrangler',
    ])
  })
})

describe('packagesFromDenoLock', () => {
  it('emits jsr and npm ids with caller-supplied licenses', () => {
    const packages = packagesFromDenoLock(
      {
        jsr: { '@std/assert@1.0.19': {} },
        npm: { 'yaml@2.9.0': {} },
      },
      {
        '@std/assert@1.0.19': 'MIT',
        'yaml@2.9.0': 'ISC',
      },
    )
    expect(packages).toEqual([
      {
        name: '@std/assert',
        version: '1.0.19',
        license: 'MIT',
        role: 'production',
        source: 'deno.lock (jsr)',
      },
      {
        name: 'yaml',
        version: '2.9.0',
        license: 'ISC',
        role: 'production',
        source: 'deno.lock (npm)',
      },
    ])
  })
})

describe('packagesFromPodfileLock', () => {
  it('parses resolved CocoaPods versions', () => {
    const text = `PODS:
  - Expo (57.0.14):
    - ExpoModulesCore
  - hermes-engine (0.86.2)
`
    const pods = packagesFromPodfileLock(text)
    expect(pods.map((row) => `${row.name}@${row.version}`)).toEqual([
      'Expo@57.0.14',
      'hermes-engine@0.86.2',
    ])
    expect(pods.every((row) => row.role === 'native')).toBe(true)
  })
})

describe('classifyLicense', () => {
  it('allows the reviewed production classes', () => {
    for (const license of [
      'MIT',
      'MIT-0',
      'ISC',
      'Apache-2.0',
      'BSD-2-Clause',
      'BSD-3-Clause',
      '0BSD',
      'Unlicense',
      'OFL-1.1',
      'BlueOak-1.0.0',
      'CC0-1.0',
      'CC-BY-4.0',
      'Python-2.0',
      'Apache-2.0 WITH LLVM-exception',
      'MIT OR Apache-2.0',
      '(BSD-3-Clause OR MIT)',
    ]) {
      expect(classifyLicense(license, 'production')).toBeNull()
    }
  })

  it('allows MPL-2.0 as development-only and for reviewed lightningcss production', () => {
    expect(classifyLicense('MPL-2.0', 'development')).toBeNull()
    expect(classifyLicense('MPL-2.0', 'production')).toBe('mpl-production')
    expect(classifyLicense('MPL-2.0', 'production', 'lightningcss')).toBeNull()
    expect(classifyLicense('MPL-2.0', 'production', 'lightningcss-linux-x64-gnu')).toBeNull()
  })

  it('allows copyleft only for development-only or orchestration roles', () => {
    expect(classifyLicense('LGPL-3.0-or-later', 'development')).toBeNull()
    expect(classifyLicense('LGPL-3.0-or-later', 'production')).toBe(
      'copyleft-production',
    )
  })

  it('defaults @std and @tamagui package names to MIT', () => {
    expect(defaultLicenseForPackageName('@std/assert')).toBe('MIT')
    expect(defaultLicenseForPackageName('@tamagui/core')).toBe('MIT')
    expect(defaultLicenseForPackageName('react')).toBeUndefined()
  })

  it('allows GPL-3.0-or-later only for orchestration tooling', () => {
    expect(classifyLicense('GPL-3.0-or-later', 'orchestration')).toBeNull()
    expect(classifyLicense('GPL-3.0-or-later', 'production')).toBe(
      'copyleft-production',
    )
  })

  it('rejects AGPL-3.0-only production dependencies for this Apache-2.0 website', () => {
    expect(classifyLicense('AGPL-3.0-only', 'production')).toBe(
      'copyleft-production',
    )
    expect(classifyLicense('AGPL-3.0-only', 'production', 'third-party-agpl')).toBe(
      'copyleft-production',
    )
  })

  it('rejects unreviewed classes', () => {
    expect(classifyLicense('', 'production')).toBe('missing')
    expect(classifyLicense('UNKNOWN', 'production')).toBe('missing')
    expect(classifyLicense('SEE LICENSE IN LICENSE.md', 'production')).toBe(
      'see-license-in',
    )
    expect(classifyLicense('LicenseRef-Proprietary', 'production')).toBe('custom')
    expect(classifyLicense('CC-BY-NC-4.0', 'production')).toBe('noncommercial')
    expect(classifyLicense('BUSL-1.1', 'production')).toBe('source-available')
    expect(classifyLicense('LGPL-3.0-or-later', 'production')).toBe(
      'copyleft-production',
    )
    expect(classifyLicense('AGPL-3.0-or-later', 'production')).toBe(
      'copyleft-production',
    )
  })

  it('requires every AND operand to be allowed', () => {
    expect(classifyLicense('MIT AND ISC', 'production')).toBeNull()
    expect(classifyLicense('MIT AND GPL-3.0-only', 'production')).toBe(
      'copyleft-production',
    )
  })
})

describe('evaluateLicensePolicy', () => {
  it('formats production MPL as a policy failure', () => {
    const failures = evaluateLicensePolicy([
      pkg({ name: '@resvg/resvg-js', license: 'MPL-2.0', role: 'production' }),
    ])
    expect(failures).toHaveLength(1)
    expect(formatPolicyFailures(failures)).toContain('mpl-production')
  })

  it('fails AGPL-3.0-only production dependencies', () => {
    const failures = evaluateLicensePolicy([
      pkg({ name: 'third-party-agpl', license: 'AGPL-3.0-only', role: 'production' }),
    ])
    expect(failures).toHaveLength(1)
    expect(failures[0]?.reason).toBe('copyleft-production')
    expect(formatPolicyFailures(failures)).toContain('copyleft-production')
  })
})

describe('renderThirdPartyNotices', () => {
  it('states that third-party code is not relicensed and fingerprints lockfiles', () => {
    const markdown = renderThirdPartyNotices(
      [
        pkg({
          name: 'react',
          license: 'MIT',
          copyright: 'Meta',
          homepage: 'https://react.dev',
        }),
        pkg({
          name: '@resvg/resvg-js',
          version: '2.6.2',
          license: 'MPL-2.0',
          role: 'development',
        }),
      ],
      renderOpts,
    )
    expect(markdown).toContain('are not relicensed by TurboPanel Website')
    expect(markdown).toContain('Apache-2.0')
    expect(markdown).toContain('pnpm-lock.yaml sha256:abc')
    expect(markdown).toContain('### react@1.0.0')
    expect(markdown).toContain('Development-only dependencies')
    expect(markdown).toContain('### @resvg/resvg-js@2.6.2')
    expect(markdown.startsWith('# Third-party notices\n')).toBe(true)
  })

  it('complements an existing first-party NOTICE rather than replacing it', () => {
    const markdown = renderThirdPartyNotices([], {
      ...renderOpts,
      repoLicense: 'Apache-2.0',
      productName: 'TurboPanel Website',
      complementNoticePath: 'NOTICE',
    })
    expect(markdown).toContain('complements `NOTICE`')
    expect(markdown).toContain('does not replace that file')
  })

  it('includes upstream NOTICE file excerpts', () => {
    const markdown = renderThirdPartyNotices(
      [
        pkg({
          name: 'foo',
          license: 'Apache-2.0',
          noticeText: 'Copyright 2020 Example\nThis product includes...',
        }),
      ],
      renderOpts,
    )
    expect(markdown).toContain('## Upstream NOTICE files')
    expect(markdown).toContain('Copyright 2020 Example')
  })
})

describe('noticesAreCurrent', () => {
  it('ignores trailing whitespace and CRLF', () => {
    const generated = renderThirdPartyNotices([], renderOpts)
    expect(noticesAreCurrent(`${generated.replaceAll('\n', '\r\n')}\n\n`, generated)).toBe(
      true,
    )
    expect(noticesAreCurrent(`${generated}stale`, generated)).toBe(false)
  })
})

describe('helpers', () => {
  it('sorts packages by name then version', () => {
    const sorted = sortNoticePackages([
      pkg({ name: 'b', version: '2.0.0', license: 'MIT' }),
      pkg({ name: 'a', version: '2.0.0', license: 'MIT' }),
      pkg({ name: 'a', version: '1.0.0', license: 'MIT' }),
    ])
    expect(sorted.map((row) => noticeKey(row))).toEqual([
      'a@1.0.0',
      'a@2.0.0',
      'b@2.0.0',
    ])
  })

  it('prefers production when merging the same coordinate', () => {
    const merged = mergeNoticePackages([
      [pkg({ name: 'yaml', license: 'ISC', role: 'development' })],
      [pkg({ name: 'yaml', license: 'ISC', role: 'production' })],
    ])
    expect(merged).toHaveLength(1)
    expect(merged[0]?.role).toBe('production')
  })

  it('attaches licenses from a lookup map', () => {
    const attached = attachLicensesFromMap(
      [pkg({ name: 'Expo', version: '57.0.14', license: '', role: 'native' })],
      { 'Expo@57.0.14': 'MIT' },
    )
    expect(attached[0]?.license).toBe('MIT')
  })

  it('reads author objects and fingerprints', () => {
    expect(authorToCopyright({ name: 'Ada' })).toBe('Ada')
    expect(authorToCopyright('  ')).toBeUndefined()
    expect(fingerprintCommentValue('deadbeef')).toBe('sha256:deadbeef')
  })

  it('maps pnpm license paths and attaches NOTICE text', () => {
    const paths = pnpmPackagePaths({
      'Apache-2.0': [
        {
          name: 'next',
          versions: ['16.2.9'],
          paths: ['node_modules/next'],
        },
      ],
    })
    expect(paths.get('next@16.2.9')).toBe('node_modules/next')
    const withNotice = attachNoticeText(
      pkg({ name: 'next', version: '16.2.9', license: 'Apache-2.0' }),
      '  Apache Next NOTICE  ',
    )
    expect(withNotice.noticeText).toBe('Apache Next NOTICE')
  })

  it('classifies orchestration pins as the reviewed GPL role', () => {
    const pins = packagesFromOrchestrationPins([
      { name: 'ansible-core', version: '2.20.*', license: 'GPL-3.0-or-later' },
    ])
    expect(pins[0]?.role).toBe('orchestration')
    expect(evaluateLicensePolicy(pins)).toEqual([])
  })
})

describe('fillMissingLicenses', () => {
  it('looks up only empty license strings', async () => {
    const filled = await fillMissingLicenses(
      [
        pkg({ name: 'yaml', license: 'ISC' }),
        pkg({ name: '@std/assert', license: '' }),
      ],
      async (row) => (row.name === '@std/assert' ? 'MIT' : 'SHOULD_NOT_RUN'),
    )
    expect(filled[0]?.license).toBe('ISC')
    expect(filled[1]?.license).toBe('MIT')
  })

  it('falls back to the known package default when lookup is blank', async () => {
    const filled = await fillMissingLicenses(
      [pkg({ name: 'khroma', license: 'UNKNOWN' })],
      async () => '   ',
    )
    expect(filled[0]?.license).toBe('MIT')
  })

  it('keeps the row unchanged when lookup and defaults are both empty', async () => {
    const row = pkg({ name: 'mystery', license: '' })
    const filled = await fillMissingLicenses([row], async () => '')
    expect(filled[0]).toEqual(row)
  })
})

describe('enrichMissingPackageLicenses', () => {
  it('fills Unknown licenses from a resolver or the package-name default', () => {
    const enriched = enrichMissingPackageLicenses(
      [
        pkg({ name: 'react', license: 'MIT' }),
        pkg({ name: 'expo-modules', license: 'UNKNOWN' }),
        pkg({ name: 'khroma', license: '' }),
        pkg({ name: 'mystery', license: 'NONE' }),
      ],
      (row) => (row.name === 'expo-modules' ? ' MIT ' : undefined),
    )
    expect(enriched[0]?.license).toBe('MIT')
    expect(enriched[1]?.license).toBe('MIT')
    expect(enriched[2]?.license).toBe('MIT')
    expect(enriched[3]?.license).toBe('NONE')
  })
})

describe('needsLicenseLookup', () => {
  it('treats empty and assertion placeholders as missing', () => {
    expect(needsLicenseLookup('')).toBe(true)
    expect(needsLicenseLookup('  UNKNOWN  ')).toBe(true)
    expect(needsLicenseLookup('MIT')).toBe(false)
  })
})

describe('defaultLicenseForPackageName', () => {
  it('maps reviewed registry rows without a license field', () => {
    expect(NOTICE_POLICY_REPO_LICENSE).toBe('Apache-2.0')
    expect(defaultLicenseForPackageName('khroma')).toBe('MIT')
    expect(defaultLicenseForPackageName('@vendor/khroma')).toBe('MIT')
  })
})

describe('packagesFromPnpmLicenses edge rows', () => {
  it('skips nameless entries, blank versions, and empty author strings', () => {
    const packages = packagesFromPnpmLicenses(
      {
        MIT: [
          { versions: ['1.0.0'], license: 'MIT' },
          { name: 'left-pad', versions: ['', ' 1.3.0 '], license: '' },
          {
            name: 'blank-versions',
            homepage: '   ',
            author: { name: '  ' },
          },
        ],
      },
      new Set(['left-pad@1.3.0']),
    )
    expect(packages).toEqual([
      {
        name: 'left-pad',
        version: '1.3.0',
        license: 'MIT',
        role: 'production',
        homepage: undefined,
        copyright: undefined,
      },
    ])
  })
})

describe('packagesFromNpmLockfile edge rows', () => {
  it('uses explicit names, skips incomplete rows, and marks production', () => {
    const packages = packagesFromNpmLockfile({
      packages: {
        '': { name: 'root' },
        'node_modules/@scope/pkg': {
          name: '@scope/pkg',
          version: '1.2.3',
          license: 'MIT',
        },
        'vendor/orphan': { version: '9.9.9', license: 'MIT' },
        'node_modules/': { version: '0.0.1', license: 'MIT' },
        'node_modules/no-version': { license: 'MIT' },
        'node_modules/unlicensed': { version: '2.0.0', license: undefined },
      },
    })
    expect(packages).toEqual([
      {
        name: '@scope/pkg',
        version: '1.2.3',
        license: 'MIT',
        role: 'production',
        source: 'package-lock.json',
      },
      {
        name: 'unlicensed',
        version: '2.0.0',
        license: '',
        role: 'production',
        source: 'package-lock.json',
      },
    ])
  })

  it('treats a missing packages map as empty', () => {
    expect(packagesFromNpmLockfile({})).toEqual([])
  })
})

describe('packagesFromDenoLock edge ids', () => {
  it('skips malformed ids and accepts license maps keyed by name@version', () => {
    const packages = packagesFromDenoLock(
      {
        jsr: { '@': {}, 'no-version@': {}, '@std/bytes@1.0.0': {} },
        npm: { '@': {}, 'left@': {}, 'left-pad@1.3.0': {} },
      },
      {
        '@std/bytes@1.0.0': 'MIT',
        'left-pad@1.3.0': 'WTFPL',
      },
    )
    expect(packages).toEqual([
      {
        name: '@std/bytes',
        version: '1.0.0',
        license: 'MIT',
        role: 'production',
        source: 'deno.lock (jsr)',
      },
      {
        name: 'left-pad',
        version: '1.3.0',
        license: 'WTFPL',
        role: 'production',
        source: 'deno.lock (npm)',
      },
    ])
  })

  it('emits empty licenses when neither key is present', () => {
    expect(packagesFromDenoLock({ jsr: { 'yaml@2.0.0': {} } }, {})).toEqual([
      {
        name: 'yaml',
        version: '2.0.0',
        license: '',
        role: 'production',
        source: 'deno.lock (jsr)',
      },
    ])
  })

  it('reads an npm-only lock when jsr is omitted', () => {
    expect(packagesFromDenoLock({ npm: { 'yaml@2.0.0': {} } }, {})).toEqual([
      {
        name: 'yaml',
        version: '2.0.0',
        license: '',
        role: 'production',
        source: 'deno.lock (npm)',
      },
    ])
  })
})

describe('packagesFromPodfileLock edge rows', () => {
  it('ignores unmatched lines and duplicate coordinates', () => {
    const text = `PODS:
DEPENDENCIES:
  - Expo (57.0.14):
    - ExpoModulesCore
  - Expo (57.0.14)
  - Blank ( )
not a pod line
`
    const pods = packagesFromPodfileLock(text)
    expect(pods).toHaveLength(1)
    expect(pods[0]?.name).toBe('Expo')
  })
})

describe('attachLicensesFromMap', () => {
  it('leaves unmatched rows alone and accepts a name-only key', () => {
    const attached = attachLicensesFromMap(
      [
        pkg({ name: 'Expo', version: '57.0.14', license: '', role: 'native' }),
        pkg({ name: 'mystery', license: '' }),
      ],
      { Expo: 'MIT' },
    )
    expect(attached[0]?.license).toBe('MIT')
    expect(attached[1]?.license).toBe('')
  })
})

describe('mergeNoticePackages field fill-in', () => {
  it('keeps attribution from the lower-ranked row when promoting role', () => {
    const merged = mergeNoticePackages([
      [
        pkg({
          name: 'yaml',
          license: 'ISC',
          role: 'development',
          noticeText: 'dev notice',
          copyright: 'Ada',
          homepage: 'https://example.test',
        }),
      ],
      [pkg({ name: 'yaml', license: 'ISC', role: 'production' })],
    ])
    expect(merged).toHaveLength(1)
    expect(merged[0]?.role).toBe('production')
    expect(merged[0]?.noticeText).toBe('dev notice')
    expect(merged[0]?.copyright).toBe('Ada')
    expect(merged[0]?.homepage).toBe('https://example.test')
  })
})

describe('classifyLicense remaining classes', () => {
  it('allows first-party AGPL when the repo license matches', () => {
    expect(
      classifyLicense('AGPL-3.0-only', 'production', 'self', {
        repoLicense: 'AGPL-3.0-only',
      }),
    ).toBeNull()
  })

  it('allows reviewed sharp LGPL production bindings', () => {
    expect(classifyLicense('LGPL-3.0-or-later', 'production', '@img/sharp')).toBeNull()
    expect(
      classifyLicense('LGPL-3.0-or-later', 'production', '@img/sharp-linux-x64'),
    ).toBeNull()
  })

  it('rejects remaining copyleft SPDX tokens in production', () => {
    for (const license of ['EUPL-1.2', 'OSL-3.0', 'CPL-1.0', 'Sleepycat', 'CDDL-1.0']) {
      expect(classifyLicense(license, 'production')).toBe('copyleft-production')
    }
  })

  it('rejects missing, noncommercial, source-available, and unknown SPDX', () => {
    expect(classifyLicense('NONE', 'production')).toBe('missing')
    expect(classifyLicense('NOASSERTION', 'production')).toBe('missing')
    expect(classifyLicense('UNLICENSED', 'production')).toBe('missing')
    expect(classifyLicense('Unlicensed License', 'production')).toBe('missing')
    expect(classifyLicense('non-commercial research', 'production')).toBe('noncommercial')
    expect(classifyLicense('commons-clause', 'production')).toBe('noncommercial')
    expect(classifyLicense('SSPL-1.0', 'production')).toBe('source-available')
    expect(classifyLicense('FSL-1.1-MIT', 'production')).toBe('source-available')
    expect(classifyLicense('Fair Source License', 'production')).toBe('source-available')
    expect(classifyLicense('Elastic-2.0', 'production')).toBe('source-available')
    expect(classifyLicense('PolyForm-Noncommercial-1.0.0', 'production')).toBe(
      'noncommercial',
    )
    expect(classifyLicense('SEE TERMS', 'production')).toBe('custom')
    expect(classifyLicense('WTFPL', 'production')).toBe('custom')
  })

  it('returns the first failing OR operand when every alternative is disallowed', () => {
    expect(classifyLicense('GPL-3.0-only OR AGPL-3.0-only', 'production')).toBe(
      'copyleft-production',
    )
  })

  it('splits nested SPDX groups without treating inner operators as top-level', () => {
    expect(classifyLicense('MIT OR (Apache-2.0 OR ISC)', 'production')).toBeNull()
    expect(classifyLicense('MIT AND (ISC AND Apache-2.0)', 'production')).toBeNull()
    expect(classifyLicense('(MIT) extra OR ISC', 'production')).toBeNull()
    expect(classifyLicense('(MIT)(ISC)', 'production')).toBe('custom')
  })
})

describe('authorToCopyright', () => {
  it('returns undefined for missing or blank object authors', () => {
    expect(authorToCopyright(undefined)).toBeUndefined()
    expect(authorToCopyright({ name: '  ' })).toBeUndefined()
    expect(authorToCopyright({})).toBeUndefined()
  })
})

describe('renderThirdPartyNotices remaining sections', () => {
  it('renders preamble, empty role sections, source, and missing licenses', () => {
    const markdown = renderThirdPartyNotices(
      [
        pkg({
          name: 'ansible-core',
          license: 'GPL-3.0-or-later',
          role: 'orchestration',
          source: 'orchestration',
        }),
        pkg({
          name: 'Expo',
          version: '57.0.14',
          license: '',
          role: 'native',
        }),
      ],
      {
        ...renderOpts,
        extraPreamble: 'Extra attribution note.',
        lockfileFingerprints: {
          'pnpm-lock.yaml': 'sha256:abc',
          'package-lock.json': 'sha256:def',
        },
      },
    )
    expect(markdown).toContain('Extra attribution note.')
    expect(markdown).toContain('_None._')
    expect(markdown).toContain('Orchestration tooling')
    expect(markdown).toContain('- Source: orchestration')
    expect(markdown).toContain('- License: (missing)')
    expect(markdown).toContain('### Expo@57.0.14')
    expect(markdown).toContain('package-lock.json sha256:def')
    expect(markdown.indexOf('package-lock.json')).toBeLessThan(
      markdown.indexOf('pnpm-lock.yaml'),
    )
  })
})

describe('pnpmPackagePaths and attachNoticeText skips', () => {
  it('skips incomplete path rows and blank NOTICE text', () => {
    const paths = pnpmPackagePaths({
      MIT: [
        { name: 'no-path', versions: ['1.0.0'] },
        { versions: ['1.0.0'], paths: ['node_modules/orphan'] },
        { name: 'blank-ver', versions: [''], paths: ['node_modules/blank'] },
        { name: 'blank-path', versions: ['1.0.0'], paths: ['   '] },
        { name: 'no-versions', paths: ['node_modules/no-versions'] },
        { name: 'next', versions: ['16.2.9'], paths: ['  node_modules/next  '] },
      ],
    })
    expect(paths.size).toBe(1)
    expect(paths.get('next@16.2.9')).toBe('node_modules/next')

    const row = pkg({ name: 'next', license: 'Apache-2.0' })
    expect(attachNoticeText(row, undefined)).toEqual(row)
    expect(attachNoticeText(row, '   ')).toEqual(row)
  })
})

function noticeKey(row: NoticePackage): string {
  return `${row.name}@${row.version}`
}
