/**
 * Wire + UI contract for organization owner license tier picks.
 * Keep in sync with:
 * - `turbopanel/src/client/servers/license-tier-routes.ts` (`feat/server-license-tier-pick`)
 * - `ui/src/components/org/server-tier-placement-panel.tsx`
 * - `ui/src/lib/server-license-tier-copy.ts`
 */
export const LICENSE_TIER_CONFIRM_SHEET_TITLE = 'Confirm license tier'
export const LICENSE_TIER_CLEAR_SHEET_TITLE = 'Clear license tier pick'

/** Non-owners: `assertOrgOwnerOr403` → generic Forbidden (no stable `code`). */
export const LICENSE_TIER_PUT_FORBIDDEN = {
  error: 'Forbidden',
  status: 403,
} as const

export const LICENSE_TIER_PUT_REFUSALS = [
  { code: 'invalid_body', status: 400 },
  { code: 'tier_below_required', status: 422 },
  { code: 'tier_not_found', status: 404 },
  { code: 'server_not_licensed', status: 404 },
] as const
