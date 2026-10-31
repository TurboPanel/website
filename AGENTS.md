# AGENTS.md

**Package:** `@turbopanel/website` — Next.js 16 marketing + Fumadocs docs.

**Public name:** TurboPanel Website & Docs → [TurboPanel/website](https://github.com/TurboPanel/website). **License:** Apache-2.0 (site/application code); CC BY 4.0 (`docs/`); trademarks excluded ([`TRADEMARKS.md`](./TRADEMARKS.md), [`LICENSES/README.md`](./LICENSES/README.md)). Third-party components keep their own licenses ([`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md); complements first-party [`NOTICE`](./NOTICE)). **Published licensing story:** marketing [`/open-source`](./src/app/open-source/page.tsx) plus docs [`docs/getting-started/licensing.mdx`](./docs/getting-started/licensing.mdx) — keep both aligned with `LICENSES/README.md` and [`.github/CONTRIBUTING.md`](https://github.com/TurboPanel/.github/blob/trunk/CONTRIBUTING.md). **Maturity:** **Private alpha**. README is product-facing; AGENTS.md is maintainer-facing.

**Default branch:** `trunk`


## Nested Guides

The nearest `AGENTS.md` to the file you edit applies on top of this one:

- [`docs/AGENTS.md`](./docs/AGENTS.md) — editing MDX under `docs/`: the user guide shape, metrics cost and glossary pages, the database stub, inline MDX components.
- [`src/AGENTS.md`](./src/AGENTS.md) — editing `src/` UI: the marketing and docs design contract, TypeScript style, site chrome, docs layout, Scalar and control-plane URL wiring.
- [`src/app/AGENTS.md`](./src/app/AGENTS.md) — editing routes under `src/app/`: pricing copy rules and the marketing route table.
- [`.github/AGENTS.md`](./.github/AGENTS.md) — editing workflows or releases: promotion (including the break-glass form) and Sonar analysis.
- [`scripts/vps/AGENTS.md`](./scripts/vps/AGENTS.md) — editing the production hosting scripts for `alpha.turbopanel.net`.

## Pricing (copy source of truth)

**Maturity label:** **Private alpha** — use this exact term on README status callouts, roadmap eyebrow, and release notes. The site top banner (`PreDevBanner`) says **Currently in Private Alpha** (title-case Alpha) and must not imply anything is publicly available (no "shipped" framing).

**Neither offering is publicly available yet.** TurboPanel High Availability and self-hosted are **both** in private alpha and both **not yet publicly available** — we are working toward a beta release. Every surface that names one must name both with that same status; never present self-hosted as ready-to-use today just because the docs/install steps exist.

The price table, tier ladder exception and CTA rules live in [`src/app/AGENTS.md`](./src/app/AGENTS.md).

## Messaging (brand voice source of truth)

Three layers — each line has one job; do not blend or reword them:

| Layer | Line | Job | Where |
| --- | --- | --- | --- |
| **Definition** | **Host more. Manage less.** + "Run websites, apps, databases, and servers from one fast, always-on control plane." | Answers "what is TurboPanel?" | Home hero, site `<title>`, GitHub org description, README taglines |
| **Brand slogan** | **Everything you host. One place to run it.** | The memorable line | Footer, closing sections, brand assets |
| **HA slogan** | **We run the panel. You run what matters.** | Answers "why not just self-host for free?" | Pricing hero, High Availability sections |

Supporting line for the self-hosted split: *"Self-host it when you need to; let us run it when you don't."* Self-hosted is the power-user exception, not a co-equal default.

Voice rules:

- Plain words a developer would say out loud: **host, run, one place, fast, always-on, your servers**. "Control plane" belongs in technical and docs copy; headlines prefer "panel" or "one place".
- **Names for the parts** live on `docs/getting-started/terminology.mdx` and apply to docs, app copy, errors, emails and installer output: **control plane** (the program), **web interface** (what you sign in to; a customer's own *app* is a different thing), **daemon**, **server**, **administrator**, **Self-hosted** and **TurboPanel High Availability**. Never write *console*, *panel* for the app, *instance* in customer copy, *hosted instance*, *node*, *dashboard* or *fleet* in new copy. The brand slogans above keep "panel" as written.
- Machine-brochure vocabulary is **banned and enforced**: `pnpm check:vocabulary` fails on the marketing-phrase block in `src/lib/vocabulary.ts` (kept in sync across sibling repos). Beyond the enforced stems, also avoid: streamline, unlock, unified platform, cloud-native, cutting-edge, leverage, robust.
- **Infrastructure story:** TurboPanel High Availability runs on **"a global edge network"** — close to users and their servers, fast and always on, worldwide. Never name the underlying vendor or its products in marketing/docs copy.
- **Claim boundary:** "always-on" and "High Availability" describe the **control plane only**. Never imply customer workloads become highly available automatically — "always-on hosting" and "your apps never go down" are off-limits.
- Open source is a trust property, not the pitch. Never lead with "open-source" as the product definition.

## Stack

- **Next.js 16** App Router; **Turbopack** for `pnpm dev` (port **19820**) and `pnpm build`
- **Docs:** Fumadocs MDX, `mdx-components.tsx`, Tailwind v4, next-themes
- **Production:** vanilla `next build` with `output: 'standalone'`, `node server.js` behind Caddy on `alpha.turbopanel.net` (see `scripts/vps/`)

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | `next dev --port 19820` |
| `pnpm build` | `next build` (`output: 'standalone'`) |
| `pnpm start` | `next start` (local; VPS units run standalone `server.js`) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` (runs `fumadocs-mdx` first) |
| `pnpm test` | Vitest once |
| `pnpm test:coverage` | Vitest + LCOV (`coverage/lcov.info`) — CI `verify.yml` runs this, then SonarCloud |
| `pnpm check:vocabulary` | Reject daemon-as-agent and Apple-associated chrome phrasing (`src/lib/vocabulary.ts` + `scripts/check-vocabulary.mjs`) |
| `pnpm notices:generate` | Write `THIRD_PARTY_NOTICES.md` from the resolved pnpm graph (complements first-party `NOTICE`; captures upstream NOTICE files) |
| `pnpm notices:check` | Fail when notices are stale vs the lockfile, or a production dependency has an unreviewed license class |
| `pnpm check:docs-ssr` | After build: assert docs HTML includes page body (`src/lib/docs-ssr.ts`) |

**Secret scan:** the pre-commit hook and CI (`--all`) run it. `scripts/scan-secrets.sh`, `scripts/scan-secrets.patterns` and `scripts/scan-secrets.selftest.sh` are byte-identical in turbopanel, turbopaneld, ui, website and dev: change all five together (each repo keeps a copy because the pre-commit hook runs it locally). The rules in the patterns file cover private key blocks, vendor tokens, JWTs, connection URLs with credentials, secret-looking assignments and forbidden file names (dotenv files, `*.pem`, `*.key`, daemon identity files, …); the scanner reports the rule id and location, never the matching text. `--all` scans the tree; `--range BASE..HEAD` scans every line the PR's commits added, so a secret added and removed inside a PR is still caught (CI runs it on PRs into trunk). Allowlist entries in `.secretscan-allowlist` are `path:full line text` (or `@path exact/file` for a forbidden file name), each needs a `# reason:` comment above it, and wildcards are rejected. The self-test builds its fixtures at run time from fragments; dev's `src/lib/scan-secrets.test.ts` runs it and, with the siblings checked out in dev CI, fails if any copy drifts.

Co-located dev runs the docs site via **`turbopanel-website.service`** (systemd) as the **dev user**. Stdout/stderr append to **`/var/log/turbopanel/website/website.log`** and **`website.err.log`** (dev-user-owned). Production is vanilla Next on `alpha.turbopanel.net` (`scripts/vps/`), not Cloudflare Workers. `pnpm-workspace.yaml` `allowBuilds` must keep Next native postinstalls (`esbuild`, `sharp`, …) approved; pnpm 12 `strictDepBuilds` otherwise fails `pnpm install` with `ERR_PNPM_IGNORED_BUILDS`.

**Where to run tests:** host VirtFS checkouts lack a usable Node/pnpm tree.
Run lint/typecheck/tests **inside the Vagrant guest** from the host `dev`
checkout (`../dev/AGENTS.md` → Testing). Do not run `pnpm typecheck` /
`pnpm lint` / `pnpm test` on the host.

```bash
vagrant ssh -c 'export PATH="/opt/turbopanel/vendor/node/current/bin:$PATH"; cd ~/website && pnpm test'
vagrant ssh -c 'export PATH="/opt/turbopanel/vendor/node/current/bin:$PATH"; cd ~/website && pnpm test:coverage'
vagrant ssh -c 'export PATH="/opt/turbopanel/vendor/node/current/bin:$PATH"; cd ~/website && pnpm verify:ci'
```

**No flaky tests:** a test must give the same result on every run. Do not use unseeded randomness (`crypto.randomUUID`, `Math.random`, random bytes) as input where an assertion or a fake keys on the content, prefix, order or collision of the value (a random hex string can contain any short letter run, and a base64 one can contain `+` or `/`); use a fixed value, or a seeded one. Do not rely on tight real-time margins (a `setTimeout` of a few ms, an elapsed-time `>=`): wait for the condition with a polling helper and a generous ceiling, or inject a clock. Do not make wall-clock expectations without a fixed clock (`Date.now()`, `new Date()`, midnight, month and DST edges). Do not depend on test order or on state shared between tests.

**CI:** `.github/workflows/verify.yml` runs lint, `check:vocabulary`, `notices:check`, typecheck, `pnpm build`, `check:docs-ssr`, `pnpm test:coverage`, then a SonarCloud scan with `sonar.qualitygate.wait=true` (`SONAR_TOKEN` required). Automatic Analysis must stay **off** for `turbopanel_website`. Triggers on `trunk`, `staging`, and `live`. A final `ci-ok` job `needs:` `verify` and fails unless it succeeded; it is the one check the rulesets will require, so a new PR-time job must be added to its `needs:`.

**Vitest convention:** place suites at `src/**/*.test.ts`. Import `describe` / `it` / `expect` from `vitest`. Unit coverage targets `src/lib/**/*.ts` only (`vitest.config.ts`); Next routes and marketing/docs chrome stay out of the Sonar denominator via `sonar.coverage.exclusions`.

## Key conventions

- **Vocabulary CI guard:** forbidden daemon-as-agent and Apple-associated chrome phrases, skip/allowlist, and per-file scan live in `src/lib/vocabulary.ts` (keep the list aligned with the daemon, instance, UI, and `.github` copies). `scripts/check-vocabulary.mjs` walks the tree and exits non-zero on hits.
- **Third-party notices:** `pnpm notices:generate` writes `THIRD_PARTY_NOTICES.md` from the resolved pnpm graph. It complements first-party `NOTICE` (Apache-2.0 attribution) and inlines dependency NOTICE files; it does not replace `NOTICE`. CI `pnpm notices:check` fails on a stale file or an unreviewed production license class. Product-facing copy that describes licenses must also name this file (and that third-party marks are never covered by TurboPanel licenses or the UI App Store additional permission). Canonical operator doc: [`docs/getting-started/licensing.mdx`](./docs/getting-started/licensing.mdx). When bumping a dependency from a Mac, regenerate with `scripts/notices-in-container.sh` (and `--check` to verify) instead of `pnpm notices:generate`. The file lists packages for the platform it is generated on, and CI checks on Linux, so a host-side generate can fail that check.

## File layout

```
website/
├── .agents/skills/ui-ux-pro-max/   # Installed design skill (SKILL.md + search.py)
├── design-system/turbopanel-website/  # MASTER.md + optional pages/
├── docs/                 # Fumadocs MDX (canonical)
│   └── database/         # Stub page: descriptions live in the database as COMMENT ON (see `docs/AGENTS.md`)
├── src/app/              # App Router (+ globals.css tokens)
├── src/components/       # Shared UI (marketing/ docs chrome)
├── src/lib/              # env, source, scalar helpers
├── public/
├── next.config.js
├── source.config.ts
├── mdx-components.tsx
├── scripts/vps/          # Caddyfile, hook, deploy.sh, systemd units for alpha.turbopanel.net
└── AGENTS.md
```

## Related

- Fumadocs https://fumadocs.vercel.app
- Next.js standalone output https://nextjs.org/docs/app/building-your-application/deploying#nodejs-server
