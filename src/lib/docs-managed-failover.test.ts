import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const DOCS = join(__dirname, "..", "..", "docs");

function readDoc(...parts: string[]): string {
  return readFileSync(join(DOCS, ...parts), "utf8");
}

describe("managed database failover docs", () => {
  const managed = readDoc("using", "managed-databases.mdx");
  const ingress = readDoc("architecture", "managed-database-ingress.mdx");
  const usingIndex = readDoc("using", "index.mdx");

  it("documents the failover expectations section and anchor", () => {
    expect(managed).toContain("## What to expect when a database fails over");
    expect(managed).toContain("what-to-expect-when-a-database-fails-over");
    expect(managed).toContain("backup_on_other_server");
    expect(managed).toContain("Promote anyway");
    expect(managed).toContain("managed.ingress.reconcile");
    expect(managed).toContain("topology database login");
    expect(managed).toContain("4 KiB");
  });

  it("states the failover behaviour the platform really has", () => {
    expect(managed).toContain("### Automatic failover");
    expect(managed).toContain("unable to verify previous primary is fenced");
    expect(managed).toContain("managed_member_is_primary");
    expect(managed).toContain("silent too long for an automatic failover to be safe");
    expect(managed).toMatch(/15 minutes/);
    expect(managed).toMatch(/about the first ten and a half minutes/);
    expect(managed).toMatch(/logical dumps[\s\S]*not point-in-time recovery/i);
    expect(managed).toMatch(
      /Until the platform has demoted and stopped the old database, it may still accept writes/,
    );
    // Claims that were checked against the code and found wrong.
    expect(managed).not.toContain("Bring the old server back or confirm it is off, then promote");
    expect(managed).not.toMatch(/point-in-time copy on the new writer/i);
    expect(managed).not.toMatch(/10 minutes[\s\S]*no recovery row|no journal entry/i);
    expect(managed).not.toContain("wait for automatic failover to retry");
    expect(managed).not.toContain("Because the old primary is stopped first, two writers never exist at the same time");
  });

  it("links the section from the using index and ingress architecture page", () => {
    expect(usingIndex).toContain(
      "/docs/using/managed-databases#what-to-expect-when-a-database-fails-over",
    );
    expect(ingress).toContain(
      "/docs/using/managed-databases#what-to-expect-when-a-database-fails-over",
    );
  });
});
