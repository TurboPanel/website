import { describe, expect, it } from 'vitest'
import { OPEN_SOURCE_LAUNCH_DATE } from '@/lib/site-dates'

describe('OPEN_SOURCE_LAUNCH_DATE', () => {
  it('is a calendar date shared by marketing pages', () => {
    expect(OPEN_SOURCE_LAUNCH_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(Date.parse(`${OPEN_SOURCE_LAUNCH_DATE}T00:00:00Z`))).toBe(false)
  })

  it('is the published open-source launch day in UTC', () => {
    expect(OPEN_SOURCE_LAUNCH_DATE).toBe('2026-08-01')
    const parsed = new Date(`${OPEN_SOURCE_LAUNCH_DATE}T00:00:00Z`)
    expect(parsed.getUTCFullYear()).toBe(2026)
    expect(parsed.getUTCMonth()).toBe(7)
    expect(parsed.getUTCDate()).toBe(1)
  })
})
