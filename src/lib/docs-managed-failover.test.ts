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

  it("matches control-plane host-loss engine policy (ha-host-loss)", () => {
    expect(managed).toContain("metadata.detector = host-loss");
    expect(managed).toContain("PostgreSQL, MySQL, and MariaDB");
    expect(managed).toContain("host-loss-attested");
    expect(managed).toContain("fullyApplied === true");
    expect(managed).not.toMatch(
      /MySQL, MariaDB[\s\S]*Never[\s\S]*engine_unsupported/,
    );
    expect(managed).not.toContain("MySQL and MariaDB are probed like Postgres");
    expect(managed).toContain("managed-ha-boot-hold-v1");
    expect(managed).toContain("TURBOPANEL_HOST_LOSS_WINDOW_SECONDS");
    expect(managed).toContain("### Failover by scenario");
    expect(managed).not.toMatch(
      /an automatic failover does not proceed when the old primary is unreachable/i,
    );
    expect(managed).not.toContain(
      "Because the old primary is stopped first, two writers never exist at the same time",
    );
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
