import { describe, expect, it } from "vitest";
import {
  CLIENT_INVITATION_ACCEPT_PATH,
  INVITATION_ACCEPT_ERROR_PAYLOADS,
  INVITATION_CREATE_GRANTS_DOC,
} from "./invitation-access-contract";

describe("invitation-access-contract", () => {
  it("mirrors invitationAcceptErrorPayload wire bodies", () => {
    expect(INVITATION_ACCEPT_ERROR_PAYLOADS.invalid_grant).toEqual({
      status: 400,
      error: "Invalid invitation grants",
    });
    expect(INVITATION_ACCEPT_ERROR_PAYLOADS.gone).toEqual({
      status: 410,
      error: "Invitation expired or already used",
    });
  });

  it("names the versioned accept route", () => {
    expect(CLIENT_INVITATION_ACCEPT_PATH).toBe(
      "/api/client/v1/invitations/{id}/accept",
    );
  });

  it("documents create grants rules aligned with OpenAPI", () => {
    expect(INVITATION_CREATE_GRANTS_DOC.omitStoresNone).toBe(
      "Omitting `grants` stores none",
    );
    expect(INVITATION_CREATE_GRANTS_DOC.emptyArray).toContain(
      "Invalid invitation grants",
    );
  });
});
