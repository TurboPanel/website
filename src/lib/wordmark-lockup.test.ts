import { describe, expect, it } from 'vitest'
import {
  computeTurboPanelWordmarkLockup,
  TURBOPANEL_WORDMARK_CHROME_SIZE,
  TURBOPANEL_WORDMARK_PROFILE,
  websiteWordmarkLockup,
  wordmarkLetterSpacingPx,
} from '@/lib/wordmark-lockup'

describe('computeTurboPanelWordmarkLockup', () => {
  it('matches website chrome geometry at default size', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: TURBOPANEL_WORDMARK_CHROME_SIZE.website.default,
      profile: 'website',
    })

    expect(lockup).toMatchObject({
      lockupHeight: 32,
      wordSize: 26,
      wordBottomOffset: -TURBOPANEL_WORDMARK_PROFILE.website.wordDownPx,
      skew: '-15deg',
      text: 'urboPanel',
    })
  })

  it('honours mark-only width', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: 30,
      markOnly: true,
      profile: 'website',
    })

    expect(lockup.lockupWidth).toBe(lockup.markWidth)
  })

  it('defaults to the console profile when none is given', () => {
    const implied = computeTurboPanelWordmarkLockup({ size: 40 })
    const explicit = computeTurboPanelWordmarkLockup({
      size: 40,
      profile: 'console',
    })
    expect(implied).toEqual(explicit)
    expect(implied.wordBottomOffset).toBe(
      -TURBOPANEL_WORDMARK_PROFILE.console.wordDownPx,
    )
  })

  it('applies wordBoostPx and wordDownPx overrides', () => {
    const baseline = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    const boosted = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      wordBoostPx: 8,
      wordDownPx: 5,
    })
    expect(boosted.wordSize).toBeGreaterThan(baseline.wordSize)
    expect(boosted.wordBottomOffset).toBe(-5)
  })

  it('floors word size at 1px for a degenerate lockup', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: 0,
      wordBoostPx: 0,
      profile: 'website',
    })
    expect(lockup.wordSize).toBe(1)
  })
})

describe('websiteWordmarkLockup', () => {
  it('uses the compact chrome size when requested', () => {
    const compact = websiteWordmarkLockup(true)
    const defaultLockup = websiteWordmarkLockup(false)

    expect(compact.lockupHeight).toBeLessThan(defaultLockup.lockupHeight)
  })

  it('can emit a mark-only website lockup', () => {
    const lockup = websiteWordmarkLockup(false, true)
    expect(lockup.lockupWidth).toBe(lockup.markWidth)
    expect(lockup.lockupWidth).toBeLessThan(websiteWordmarkLockup(false).lockupWidth)
  })
})

describe('wordmarkLetterSpacingPx', () => {
  it('returns zero when letter spacing is unset', () => {
    expect(wordmarkLetterSpacingPx(24)).toBe(0)
  })
})
