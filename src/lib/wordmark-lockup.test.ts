import { describe, expect, it } from 'vitest'
import {
  computeTurboPanelWordmarkLockup,
  TURBOPANEL_WORDMARK_BASELINE_EM,
  TURBOPANEL_WORDMARK_CHROME_SIZE,
  TURBOPANEL_WORDMARK_LOCKUP_TUNING,
  TURBOPANEL_WORDMARK_OVERSHOOT_EM,
  TURBOPANEL_WORDMARK_PROFILE,
  websiteWordmarkLockup,
  wordBaselineDropPx,
  wordmarkLetterSpacingPx,
} from '@/lib/wordmark-lockup'

/** Expected `bottom` for a word: profile/override nudge plus the baseline drop. */
const bottomFor = (wordSize: number, downPx: number): number =>
  -(downPx + wordBaselineDropPx(wordSize))

describe('wordBaselineDropPx', () => {
  it('drops the word by the baseline distance when the lockup sits on the base', () => {
    expect(TURBOPANEL_WORDMARK_LOCKUP_TUNING.wordBaselineOnMarkBase).toBe(true)
    // Figtree: ascent 0.95 em, descent 0.25 em -> 0.25 - (1.2 - 1) / 2.
    expect(TURBOPANEL_WORDMARK_BASELINE_EM).toBe(0.15)
    // The lowest letter (e) dips 12.74/1000 em below the baseline at weight 800.
    expect(TURBOPANEL_WORDMARK_OVERSHOOT_EM).toBe(0.0127)
    expect(wordBaselineDropPx(29)).toBeCloseTo(3.9817, 3)
    expect(wordBaselineDropPx(0)).toBe(0)
  })
})

describe('computeTurboPanelWordmarkLockup', () => {
  it('matches website chrome geometry at default size', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: TURBOPANEL_WORDMARK_CHROME_SIZE.website.default,
      profile: 'website',
    })

    expect(lockup).toMatchObject({
      lockupHeight: 32,
      wordSize: 33,
      wordBottomOffset: bottomFor(
        33,
        TURBOPANEL_WORDMARK_PROFILE.website.wordDownPx,
      ),
      skew: '-14deg',
      text: 'urboPanel',
    })
    // 33px word, no profile nudge: 33 * (0.15 - 0.0127).
    expect(lockup.wordBottomOffset).toBeCloseTo(-4.5309, 3)
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
      bottomFor(
        implied.wordSize,
        TURBOPANEL_WORDMARK_PROFILE.console.wordDownPx,
      ),
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
    expect(boosted.wordBottomOffset).toBe(bottomFor(boosted.wordSize, 5))
  })

  it('keeps the profile down offset when only wordBoostPx is set', () => {
    const boosted = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
      wordBoostPx: 8,
    })
    expect(boosted.wordBottomOffset).toBe(
      bottomFor(
        boosted.wordSize,
        TURBOPANEL_WORDMARK_PROFILE.website.wordDownPx,
      ),
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
    expect(lowered.wordBottomOffset).toBe(bottomFor(lowered.wordSize, 9))
  })

  it('sizes the full lockup wider than the mark when the word is present', () => {
    const lockup = computeTurboPanelWordmarkLockup({
      size: 30,
      profile: 'website',
    })
    expect(lockup.lockupWidth).toBeGreaterThan(lockup.markWidth)
    expect(lockup.letterSpacingEm).toBe(-0.01)
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
      bottomFor(
        withZeroBoost.wordSize,
        TURBOPANEL_WORDMARK_PROFILE.website.wordDownPx,
      ),
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
    expect(withZeroDown.wordBottomOffset).toBe(
      bottomFor(withZeroDown.wordSize, 0),
    )
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
    expect(lockup.lockupWidth).toBeLessThan(
      websiteWordmarkLockup(false).lockupWidth,
    )
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
  it('scales the tight letter spacing with the font size', () => {
    expect(wordmarkLetterSpacingPx(24)).toBeCloseTo(-0.24)
    expect(wordmarkLetterSpacingPx(0)).toBeCloseTo(0)
  })
})
