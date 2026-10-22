import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Shape rules for .github/workflows: a red X on a pull request only ever
// means "this change is broken", every workflow says what its token may do,
// and every workflow reads as a title in the Actions list.

const WORKFLOWS = fileURLToPath(
  new URL("../.github/workflows/", import.meta.url),
);
const files = readdirSync(WORKFLOWS).filter((name) => name.endsWith(".yml"));
const read = (name: string) => readFileSync(path.join(WORKFLOWS, name), "utf8");

/**
 * The text of every `run:` step in a workflow file (single-line and block
 * scalars), found by indentation so no YAML parser is needed.
 */
function runBodies(source: string): string[] {
  const lines = source.split("\n");
  const bodies: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = /^(\s*)(?:- )?run:\s*(.*)$/.exec(lines[i]);
    if (!match) continue;
    const indent = match[1].length;
    if (!/^[|>][+-]?$/.test(match[2].trim())) {
      bodies.push(match[2]);
      continue;
    }
    const body: string[] = [];
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j];
      if (line.trim() !== "" && line.length - line.trimStart().length <= indent)
        break;
      body.push(line);
    }
    bodies.push(body.join("\n"));
  }
  return bodies;
}

/** Values an outsider can shape (a tag name, a dispatch input, a job output built from one). */
const SHELL_UNSAFE =
  /\$\{\{\s*(inputs\.|github\.ref_name|github\.head_ref|needs\.[\w-]+\.outputs\.)/;

// Words that stay lower case inside a Title Case name.
const SMALL_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "by",
]);

function isTitleCase(name: string): boolean {
  return name.split(/\s+/).every((word, index) => {
    const bare = word.replace(/^\(/, "");
    if (index > 0 && SMALL_WORDS.has(bare)) return true;
    return !/^[a-z]/.test(bare);
  });
}

describe("isTitleCase", () => {
  it("accepts titles and small words after the first", () => {
    expect(isTitleCase("Keep the RC PR Open")).toBe(true);
    expect(isTitleCase("Promote (Prepare)")).toBe(true);
  });

  it("refuses a lower-case word or a lower-case first word", () => {
    expect(isTitleCase("Publish rc")).toBe(false);
    expect(isTitleCase("Promote (prepare)")).toBe(false);
    expect(isTitleCase("the Next Version")).toBe(false);
  });
});

describe(".github/workflows", () => {
  it("has workflows to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s declares top-level permissions", (file) => {
    expect(read(file)).toMatch(/^permissions:/m);
  });

  it.each(files)("%s has a Title Case name", (file) => {
    const name = /^name: (.+)$/m.exec(read(file))?.[1];
    expect(name, `${file} has no top-level name`).toBeDefined();
    expect(isTitleCase(name ?? ""), `${file}: "${name}"`).toBe(true);
  });

  // Another repo's staging/live move on that repo's own release schedule, so
  // a comparison against them would go red for reasons outside this change.
  it.each(files)(
    "%s checks sibling repositories out at trunk or a pinned commit",
    (file) => {
      const blocks = read(file).split(/\n\s*- name: /);
      for (const block of blocks) {
        const repo = /repository: (TurboPanel\/[\w-]+)/.exec(block)?.[1];
        if (!repo) continue;
        const ref = /\n\s+ref: (\S+)/.exec(block)?.[1];
        expect(ref, `${file}: ${repo} checkout has no ref`).toBeDefined();
        expect(ref, `${file}: ${repo} at ${ref}`).toMatch(
          /^(trunk|[\da-f]{40})$/,
        );
      }
    },
  );

  it("ci-ok is red on a cancelled pull request but not on a cancelled push", () => {
    const text = read("verify.yml");
    expect(text).toMatch(
      /^ {2}ci-ok:\n {4}name: ci-ok\n {4}needs: \[[^\]]+\]\n {4}if: \$\{\{ \(github\.event_name == 'pull_request' && always\(\)\) \|\| \(!cancelled\(\) && !contains\(needs\.\*\.result, 'cancelled'\)\) \}\}$/m,
    );
    expect(text).not.toMatch(/^ {4}if: always\(\)$/m);
  });
});

// The tags work out the version (Road to 0.2.x, versioning Phase 3); the
// committed package.json must agree, and publish-rc.yml refuses an rc until it
// does. The bump is the "chore: start X.Y.Z" PR the Release App opens after a
// release (or Start Next Version opens for a minor or major), made with
// scripts/set-version.mjs. No minor gate, and no release step reads a version
// out of package.json.
const START_JOB = "\n  start-version-pr:\n";

/** One top-level job of a workflow file (empty when there is none). */
function jobText(source: string, name: string): string {
  const start = source.indexOf(`\n  ${name}:\n`);
  if (start < 0) return "";
  const rest = source.slice(start + 1);
  const end = rest.slice(1).search(/\n {2}[\w-]+:\n/);
  return end < 0 ? rest : rest.slice(0, end + 2);
}

/**
 * The jobs that call gh-promote-ok.yml. The Promote OK check pins its own dev
 * commit, so its fixes can ship without moving the rest of the promotion chain.
 */
const PROMOTE_OK_JOBS: Record<string, string> = {
  "promote-ok.yml": "evaluate",
  "promote-ok-recheck.yml": "dry-run",
};

describe("versions from tags", () => {
  const GONE = [
    /gh-next-version/,
    /gh-minor-gate|minor-gate/,
    /start-minor/,
    /--label minor/,
    /--title "Start /,
  ];

  it.each(files)(
    "%s has none of the old Start PR or minor gate steps and reads no version out of package.json",
    (file) => {
      for (const gone of GONE) expect(read(file)).not.toMatch(gone);
      expect(read(file)).not.toMatch(
        /contents\/package\.json|version-file:|json\.load\(open\("package\.json"\)\)/,
      );
    },
  );

  it("publishes an rc numbered from the tags", () => {
    const text = read("publish-rc.yml");
    expect(text).toMatch(
      /uses: TurboPanel\/dev\/\.github\/actions\/version@[\da-f]{40} # dev#\d+\n {8}with:\n {10}mode: base\n/,
    );
    expect(text).toContain("BASE_VERSION: ${{ steps.base.outputs.base }}");
  });

  it("refuses an rc whose committed version is not the version from the tags", () => {
    const text = read("publish-rc.yml");
    const resolve = text.indexOf("\n  resolve:\n");
    const checkout = text.indexOf("- name: Check out the merged commit");
    const check = text.indexOf(
      "- name: Refuse an rc whose committed version disagrees",
    );
    const prepare = text.indexOf("\n  prepare:\n");
    expect(resolve).toBeGreaterThan(0);
    expect(checkout).toBeGreaterThan(
      text.indexOf("- name: Find the merged PR"),
    );
    expect(check).toBeGreaterThan(checkout);
    expect(prepare).toBeGreaterThan(check);
    expect(text.slice(checkout, check)).toContain(
      "ref: ${{ steps.r.outputs.commit }}",
    );
    const step = text.slice(check, prepare);
    expect(step).toContain("if: steps.r.outputs.proceed == 'true'");
    expect(step).toContain("VERSION: ${{ steps.r.outputs.version }}");
    expect(step).toContain(
      'run: node scripts/set-version.mjs --check "$VERSION"',
    );
  });

  it("pins one TurboPanel/dev commit across the promotion workflows", () => {
    const pins = new Set<string>();
    for (const file of [
      "publish-rc.yml",
      "publish-release.yml",
      "promote-prs.yml",
      "promote-ok.yml",
      "promote-ok-recheck.yml",
    ]) {
      // The start-version-pr job's dev actions and the Promote OK jobs are
      // pinned on their own.
      let promote = read(file).split(START_JOB)[0];
      const ok = jobText(promote, PROMOTE_OK_JOBS[file] ?? "");
      if (ok) promote = promote.replace(ok, "");
      expect(promote).not.toContain("gh-promote-ok.yml@");
      for (const m of promote.matchAll(
        /TurboPanel\/dev\/\.github\/(?:workflows\/[\w.-]+|actions\/version)@([\da-f]{40})/g,
      )) {
        pins.add(m[1]);
      }
      for (const m of promote.matchAll(
        /^ +(?:dev-)?ref: ([\da-f]{40})(?: #.*)?$/gm,
      ))
        pins.add(m[1]);
    }
    expect([...pins]).toHaveLength(1);
  });

  it("pins the Promote OK jobs to one TurboPanel/dev commit, handed on as dev-ref", () => {
    const pins = new Set<string>();
    for (const [file, name] of Object.entries(PROMOTE_OK_JOBS)) {
      const job = jobText(read(file), name);
      const uses = [
        ...job.matchAll(/gh-promote-ok\.yml@([\da-f]{40}) # dev#\d+$/gm),
      ];
      const refs = [...job.matchAll(/^ +dev-ref: ([\da-f]{40})(?: #.*)?$/gm)];
      expect(uses, `${file} ${name}`).toHaveLength(1);
      expect(refs, `${file} ${name}`).toHaveLength(1);
      pins.add(uses[0][1]);
      pins.add(refs[0][1]);
    }
    expect([...pins]).toHaveLength(1);
  });

  it('opens the "chore: start" PR for the next patch after the release is finalized', () => {
    const release = read("publish-release.yml");
    const job = release.split(START_JOB)[1] ?? "";
    expect(job).toMatch(/^ {4}needs: \[prepare, finalize\]$/m);
    expect(job).toMatch(/^ {6}contents: read/m);
    expect(job).toContain(
      "uses: actions/create-github-app-token@64ab729a6294000f5aa4a4bc0b73d1f32bc45510 # v3.3.0",
    );
    expect(job).toContain("repositories: ${{ github.event.repository.name }}");
    expect(job).toMatch(
      /uses: TurboPanel\/dev\/\.github\/actions\/version@[\da-f]{40} # dev#\d+\n {8}with:\n {10}mode: base\n/,
    );
    expect(job).toContain("NEWEST: ${{ steps.next.outputs.release }}");
    expect(job).toContain("RELEASED: ${{ needs.prepare.outputs.version }}");
    expect(job).toMatch(
      /uses: TurboPanel\/dev\/\.github\/actions\/start-version-pr@[\da-f]{40} # dev#\d+\n/,
    );
    expect(job).toContain("version: ${{ steps.next.outputs.base }}");
    expect(job).toContain("github-token: ${{ steps.app.outputs.token }}");
    expect(job).toContain(
      "reason: It was opened after v${{ needs.prepare.outputs.version }} was released.",
    );
    expect(job).toContain('auto-merge: "true"');
    // One dev commit for both of the job's actions.
    const pins = new Set(
      [
        ...job.matchAll(
          /TurboPanel\/dev\/\.github\/actions\/[\w-]+@([\da-f]{40})/g,
        ),
      ].map((m) => m[1]),
    );
    expect([...pins]).toHaveLength(1);
    expect(release).not.toContain('Nothing opens a "Start <next>" PR');
  });
});

describe("shell safety", () => {
  it.each(files)(
    "%s passes inputs, the ref name and job outputs through env:",
    (f) => {
      for (const body of runBodies(read(f)))
        expect(body).not.toMatch(SHELL_UNSAFE);
    },
  );
});
