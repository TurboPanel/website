import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  INVITATION_ACCEPT_ERROR_PAYLOADS,
  INVITATION_CREATE_GRANTS_DOC,
} from "./invitation-access-contract";

const DOCS = join(__dirname, "..", "..", "docs");

function readDoc(...parts: string[]): string {
  return readFileSync(join(DOCS, ...parts), "utf8");
}

describe("invitation access docs (no default organization manager grant)", () => {
  const access = readDoc("using", "access.mdx");
  const errors = readDoc("using", "reference", "errors.mdx");
  const index = readDoc("using", "index.mdx");
  const accounts = readDoc("getting-started", "accounts-and-access.mdx");

  it("access.mdx does not describe a default manager grant on accept", () => {
    expect(access).not.toMatch(
      /by default, an \*\*organization manager\*\* grant/i,
    );
    expect(access).not.toMatch(/Default invitation grant/i);
    expect(access).not.toMatch(/default grant an invitation gives/i);
  });

  it("access.mdx documents team-only app invites and explicit grants", () => {
    expect(access).toMatch(/no grants/i);
    expect(access).toMatch(/grants_require_owner/);
    expect(access).toMatch(/Invalid invitation grants/);
    expect(access).toMatch(/empty `grants: \[\]`/i);
    expect(access).toMatch(/grants` is an empty array/i);
  });

  it("access.mdx matches POST /invitations grants body rules", () => {
    expect(access).toContain(INVITATION_CREATE_GRANTS_DOC.omitStoresNone);
    expect(access).toContain(INVITATION_CREATE_GRANTS_DOC.nullOrNonArray);
    expect(access).toContain(INVITATION_CREATE_GRANTS_DOC.emptyArray);
    expect(access).not.toMatch(/omitted or `null` stores none/i);
    expect(access).not.toMatch(/Omitting `grants` or sending `null`/i);
  });

  it("access.mdx accept error rows use HTTP statuses from invitationAcceptErrorPayload", () => {
    for (const { status, error } of Object.values(
      INVITATION_ACCEPT_ERROR_PAYLOADS,
    )) {
      expect(access).toContain(`${status} (accept)`);
      expect(access).toContain(`| \`${error}\``);
    }
  });

  it("errors.mdx documents POST /invitations grants refusals", () => {
    expect(errors).toMatch(
      /\| `Invalid request`\s+\| 400\s+\| `POST \/invitations` sent `grants: null` or a non-array\./,
    );
    expect(errors).toMatch(
      /\| `Invalid invitation grants`\s+\| 400\s+\| `POST \/invitations` sent `grants: \[\]`/,
    );
  });

  it("errors.mdx documents accept wire bodies, not internal reason codes", () => {
    for (const { status, error } of Object.values(
      INVITATION_ACCEPT_ERROR_PAYLOADS,
    )) {
      expect(errors).toContain(`${status} (accept)`);
      expect(errors).toContain(`| \`${error}\``);
    }
    expect(errors).not.toMatch(/\| `invalid_grant`\s+\|/);
    expect(errors).not.toMatch(/\| `gone`\s+\|/);
  });

  it("access.mdx documents team membership only after accept", () => {
    expect(access).toMatch(/team membership\*\* only/i);
  });

  it("accounts-and-access invite diagram shows a single Join step for new users", () => {
    expect(accounts).toMatch(
      /Join \(creates account, accepts invitation, signs in\)/i,
    );
    expect(accounts).not.toMatch(/Verify email, sign in/);
  });

  it("using index and accounts-and-access align with membership without implicit manage", () => {
    expect(index).not.toMatch(/default grant an invitation gives/i);
    expect(index).toMatch(/team membership only/i);
    expect(accounts).not.toMatch(
      /organization access follows from team membership/i,
    );
    expect(accounts).toMatch(/does not grant \*\*Manage\*\*/i);
  });
});
