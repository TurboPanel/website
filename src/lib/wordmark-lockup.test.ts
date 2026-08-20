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
})

describe('websiteWordmarkLockup', () => {
  it('uses the compact chrome size when requested', () => {
    const compact = websiteWordmarkLockup(true)
    const defaultLockup = websiteWordmarkLockup(false)

    expect(compact.lockupHeight).toBeLessThan(defaultLockup.lockupHeight)
  })
})

describe('wordmarkLetterSpacingPx', () => {
  it('returns zero when letter spacing is unset', () => {
    expect(wordmarkLetterSpacingPx(24)).toBe(0)
  })
})
