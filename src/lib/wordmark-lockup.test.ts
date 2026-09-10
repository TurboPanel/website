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

  it('keeps the profile down offset when only wordBoostPx is set', () => {
    const boosted = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      wordBoostPx: 8,
    })
    expect(boosted.wordBottomOffset).toBe(
      -TURBOPANEL_WORDMARK_PROFILE.website.wordDownPx,
    )
  })

  it('keeps the profile boost when only wordDownPx is set', () => {
    const baseline = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    const lowered = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      wordDownPx: 9,
    })
    expect(lowered.wordSize).toBe(baseline.wordSize)
    expect(lowered.wordBottomOffset).toBe(-9)
  })

  it('sizes the full lockup wider than the mark when the word is present', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    expect(lockup.lockupWidth).toBeGreaterThan(lockup.markWidth)
    expect(lockup.letterSpacingEm).toBe(0)
  })

  it('floors word size at 1px for a degenerate lockup', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: 0,
      wordBoostPx: 0,
      profile: 'website',
    })
    expect(lockup.wordSize).toBe(1)
  })

  it('treats explicit markOnly false like an omitted flag', () => {
    const omitted = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    const explicit = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      markOnly: false,
    })
    expect(explicit).toEqual(omitted)
    expect(explicit.lockupWidth).toBeGreaterThan(explicit.markWidth)
  })

  it('uses mark width when a crushed word is narrower than the mark', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: 100,
      wordBoostPx: -1000,
      profile: 'website',
    })
    expect(lockup.wordSize).toBe(1)
    expect(lockup.lockupWidth).toBe(lockup.markWidth)
    expect(lockup.markWidth).toBeGreaterThan(lockup.wordSize)
  })

  it('treats a zero boost override as a value, not a missing profile boost', () => {
    const withProfileBoost = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    const withZeroBoost = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      wordBoostPx: 0,
    })
    expect(withZeroBoost.wordSize).toBeLessThan(withProfileBoost.wordSize)
    expect(withZeroBoost.wordBottomOffset).toBe(
      -TURBOPANEL_WORDMARK_PROFILE.website.wordDownPx,
    )
  })

  it('treats a zero down offset override as a value, not a missing profile offset', () => {
    const withProfileDown = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    const withZeroDown = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      wordDownPx: 0,
    })
    expect(withZeroDown.wordBottomOffset).toBe(-0)
    expect(withZeroDown.wordSize).toBe(withProfileDown.wordSize)
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

  it('can emit a compact mark-only website lockup', () => {
    const lockup = websiteWordmarkLockup(true, true)
    const fullCompact = websiteWordmarkLockup(true)
    expect(lockup.lockupWidth).toBe(lockup.markWidth)
    expect(lockup.lockupWidth).toBeLessThan(fullCompact.lockupWidth)
    expect(lockup.lockupHeight).toBe(fullCompact.lockupHeight)
  })

  it('maps explicit markOnly false to the matching website chrome size', () => {
    const compact = websiteWordmarkLockup(true, false)
    const defaultLockup = websiteWordmarkLockup(false, false)

    expect(compact).toEqual(
      computeTurboPanelWordmarkLockup({
        size: TURBOPANEL_WORDMARK_CHROME_SIZE.website.compact,
        markOnly: false,
        profile: 'website',
      }),
    )
    expect(defaultLockup).toEqual(
      computeTurboPanelWordmarkLockup({
        size: TURBOPANEL_WORDMARK_CHROME_SIZE.website.default,
        markOnly: false,
        profile: 'website',
      }),
    )
    expect(compact.lockupWidth).toBeGreaterThan(compact.markWidth)
    expect(defaultLockup.lockupWidth).toBeGreaterThan(defaultLockup.markWidth)
  })
})

describe('wordmarkLetterSpacingPx', () => {
  it('returns zero when letter spacing is unset', () => {
    expect(wordmarkLetterSpacingPx(24)).toBe(0)
    expect(wordmarkLetterSpacingPx(0)).toBe(0)
  })
})
