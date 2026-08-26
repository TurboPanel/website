import { describe, expect, it } from 'vitest'
import { OPEN_SOURCE_LAUNCH_DATE } from '@/lib/site-dates'

describe('OPEN_SOURCE_LAUNCH_DATE', () => {
  it('is a calendar date shared by marketing pages', () => {
    expect(OPEN_SOURCE_LAUNCH_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(Date.parse(`${OPEN_SOURCE_LAUNCH_DATE}T00:00:00Z`))).toBe(false)
  })
})
