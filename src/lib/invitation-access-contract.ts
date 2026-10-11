/**
 * Wire contract for invitation create/accept documented in access docs.
 * Keep in sync with:
 * - `turbopanel/src/client/access/routes-helpers.ts` (`invitationAcceptErrorPayload`)
 * - `turbopanel/src/client/openapi/access.ts` (`CreateInvitationRequest.grants`)
 */
export const CLIENT_INVITATION_ACCEPT_PATH =
  "/api/client/v1/invitations/{id}/accept";

/** Response `{ error }` bodies for accept failures (not internal reason codes). */
export const INVITATION_ACCEPT_ERROR_PAYLOADS = {
  invalid_grant: { status: 400, error: "Invalid invitation grants" },
  gone: { status: 410, error: "Invitation expired or already used" },
} as const;

/** Documented `POST /invitations` `grants` body rules (OpenAPI + parseCreateInvitationBody). */
export const INVITATION_CREATE_GRANTS_DOC = {
  omitStoresNone: "Omitting `grants` stores none",
  nullOrNonArray:
    "`grants: null` or any non-array is refused (`Invalid request`, 400)",
  emptyArray:
    "An empty `grants: []` is refused (`Invalid invitation grants`, 400)",
} as const;
