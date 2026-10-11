import { describe, expect, it } from 'vitest'
import {
  LICENSE_TIER_CLEAR_SHEET_TITLE,
  LICENSE_TIER_CONFIRM_SHEET_TITLE,
  LICENSE_TIER_PUT_FORBIDDEN,
  LICENSE_TIER_PUT_REFUSALS,
} from './license-tier-pick-contract'

describe('license-tier-pick-contract', () => {
  it('mirrors license-tier-routes refusal statuses', () => {
    expect(LICENSE_TIER_PUT_REFUSALS).toEqual([
      { code: 'invalid_body', status: 400 },
      { code: 'tier_below_required', status: 422 },
      { code: 'tier_not_found', status: 404 },
      { code: 'server_not_licensed', status: 404 },
    ])
    expect(LICENSE_TIER_PUT_FORBIDDEN).toEqual({ error: 'Forbidden', status: 403 })
  })

  it('mirrors server-tier-placement-panel sheet titles', () => {
    expect(LICENSE_TIER_CONFIRM_SHEET_TITLE).toBe('Confirm license tier')
    expect(LICENSE_TIER_CLEAR_SHEET_TITLE).toBe('Clear license tier pick')
  })
})
