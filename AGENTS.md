# AGENTS.md

**Package:** `@turbopanel/website` — Next.js 16 marketing + Fumadocs docs.

**Public name:** TurboPanel Website & Docs → [TurboPanel/website](https://github.com/TurboPanel/website). **License:** Apache-2.0 (site/application code); CC BY 4.0 (`docs/`); trademarks excluded ([`TRADEMARKS.md`](./TRADEMARKS.md), [`LICENSES/README.md`](./LICENSES/README.md)). Third-party components keep their own licenses ([`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md); complements first-party [`NOTICE`](./NOTICE)). **Published licensing story:** marketing [`/open-source`](./src/app/open-source/page.tsx) plus docs [`docs/getting-started/licensing.mdx`](./docs/getting-started/licensing.mdx) — keep both aligned with `LICENSES/README.md` and [`.github/CONTRIBUTING.md`](https://github.com/TurboPanel/.github/blob/trunk/CONTRIBUTING.md). **Maturity:** **Private alpha**. README is product-facing; AGENTS.md is maintainer-facing.

**Default branch:** `trunk`

**Docs content:** MDX under `docs/` (Fumadocs; `source.config.ts` → `dir: 'docs'`). Daemon-cell / Durable Object architecture docs must use the **SQLite-backed** Durable Object pricing model (rows read/written, `setAlarm()` = 1 row written, deletes = writes, KV-style methods billed as rows; compute requests incl. WS connect + 20:1 incoming-WS-message ratio + alarm invocations; 128 MB duration; hibernation) — **never legacy KV-backed DO pricing** — and the canonical source is `~/turbopanel/AGENTS.md` (Daemon Cell). (Leave the actual docs/diagrams to the website-docs phase.)

## Pricing (copy source of truth)

**Maturity label:** **Private alpha** — use this exact term on README status callouts, roadmap eyebrow, and release notes. The site top banner (`PreDevBanner`) says **Currently in Private Alpha** (title-case Alpha) and must not imply anything is publicly available (no "shipped" framing).

**Neither offering is publicly available yet.** TurboPanel High Availability and self-hosted are **both** in private alpha and both **not yet publicly available** — we are working toward a beta release. Every surface that names one must name both with that same status; never present self-hosted as ready-to-use today just because the docs/install steps exist.

Marketing and docs **must** match live product pages. Canonical public page: **https://turbopanel.io/pricing**.

| Surface | Presentation |
| --- | --- |
| **TurboPanel High Availability** | **Private alpha · Not yet available** — no dollar figures on marketing pages; single CTA is **`Join the waitlist`** (`/sign-up`), never "request access now" / "get started now" phrasing |
| **Self-hosted control plane** | **Private alpha · Not yet available** — planned to be **free, unlimited servers** once it ships; CTA is **`Preview self-hosted docs`** (`/docs/deployment/self-hosted`), not "install now" / "self-host today" phrasing |

Do not reintroduce `$X` placeholders or pay-X-get-X copy on `src/app/**`. Do not use CTA copy that implies either path is usable today (e.g. "Get started now", "Request early access", "Start on TurboPanel High Availability", "Install self-hosted") — use waitlist / preview-docs language instead. On the roadmap, the internal `Complete` phase status maps to the public label **Built**, not "Shipped" (see `design-system/turbopanel-website/pages/roadmap.md`) — no status label should imply a public release has happened yet.

**Infrastructure metrics costs (distinct from product pricing):** Cloudflare Analytics Engine price constants, limits, formulas, and the verification date live in exactly one doc — [`docs/architecture/server-metrics.mdx`](docs/architecture/server-metrics.mdx) (Cost section). Keep that section dated when Cloudflare pricing changes; do not scatter AE pricing constants into app code or other pages.

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
- Machine-brochure vocabulary is **banned and enforced**: `pnpm check:vocabulary` fails on the marketing-phrase block in `src/lib/vocabulary.ts` (kept in sync across sibling repos). Beyond the enforced stems, also avoid: streamline, unlock, unified platform, cloud-native, cutting-edge, leverage, robust.
- **Infrastructure story:** TurboPanel High Availability runs on **"a global edge network"** — close to users and their servers, fast and always on, worldwide. Never name the underlying vendor or its products in marketing/docs copy.
- **Claim boundary:** "always-on" and "High Availability" describe the **control plane only**. Never imply customer workloads become highly available automatically — "always-on hosting" and "your apps never go down" are off-limits.
- Open source is a trust property, not the pitch. Never lead with "open-source" as the product definition.

## Marketing routes (App Router)

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Home |
| `/setups` | `src/app/setups/page.tsx` | Architecture patterns (single server → unlimited mesh); nav label "Patterns" |
| `/pricing` | `src/app/pricing/page.tsx` | Managed vs self-hosted positioning |
| `/roadmap` | `src/app/roadmap/page.tsx` | Product phases (vertical timeline) |
| `/open-source` | `src/app/open-source/page.tsx` | License table (incl. per-release third-party notices), repo map, third-party marks, FAQ |
| `/security` | `src/app/security/page.tsx` | Supported versions, private reporting |
| `/changelog` | `src/app/changelog/page.tsx` | Human-written release highlights |
| `/about/logo` | `src/app/about/logo/page.tsx` | Brand guidelines |

Register new marketing routes in `SiteHeader` (`ActivePage` + `LINKS` when nav-visible — `LINKS` also feeds the mobile `MobileNavMenu` panel), `SiteFooter` (`FOOTER_LINKS`), and `src/app/sitemap.ts`.

Screenshots for READMEs: `public/screenshots/` (served at `https://turbopanel.io/screenshots/…`). Social preview sources: `public/brand/social/`.

## Stack

- **Next.js 16** App Router; **Turbopack** for `pnpm dev` (port **19820**); **webpack** for `next build --webpack` (OpenNext Cloudflare)
- **Adapter:** `@opennextjs/cloudflare` — `open-next.config.ts`, `wrangler.jsonc`
- **Docs:** Fumadocs MDX, `mdx-components.tsx`, Tailwind v4, next-themes
- **Cloudflare in dev:** optional `NEXT_DEV_CLOUDFLARE=1` (see `next.config.js` / OpenNext bindings docs)

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | `next dev --port 19820` |
| `pnpm build` | `next build --webpack` |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` (runs `fumadocs-mdx` first) |
| `pnpm test` | Vitest once |
| `pnpm test:coverage` | Vitest + LCOV (`coverage/lcov.info`) — CI `verify.yml` runs this, then SonarCloud |
| `pnpm check:hosts` | Assert `wrangler.jsonc` `API_HOSTNAMES` match `src/lib/control-plane-hosts.ts` |
| `pnpm check:vocabulary` | Reject daemon-as-agent and Apple-associated chrome phrasing (`src/lib/vocabulary.ts` + `scripts/check-vocabulary.mjs`) |
| `pnpm notices:generate` | Write `THIRD_PARTY_NOTICES.md` from the resolved pnpm graph (complements first-party `NOTICE`; captures upstream NOTICE files) |
| `pnpm notices:check` | Fail when notices are stale vs the lockfile, or a production dependency has an unreviewed license class |
| `pnpm check:docs-ssr` | After build: assert docs HTML includes page body (`src/lib/docs-ssr.ts`) |
| `pnpm preview` | OpenNext build + Wrangler preview |
| `pnpm deploy` / `upload` | OpenNext Cloudflare deploy / upload |
| `pnpm cf-typegen` | `wrangler types` → `cloudflare-env.d.ts` |

Co-located dev runs the docs site via **`turbopanel-website.service`** (systemd) as the **dev user**. Stdout/stderr append to **`/var/log/turbopanel/website/website.log`** and **`website.err.log`** (dev-user-owned); production deploys to Cloudflare Workers only.

**Where to run tests:** host VirtFS checkouts lack a usable Node/pnpm tree.
Run lint/typecheck/tests **inside the Vagrant guest** from the host `dev`
checkout (`../dev/AGENTS.md` → Testing). Do not run `pnpm typecheck` /
`pnpm lint` / `pnpm test` on the host.

```bash
vagrant ssh -c 'export PATH="/opt/turbopanel/vendor/node/current/bin:$PATH"; cd ~/website && pnpm test'
vagrant ssh -c 'export PATH="/opt/turbopanel/vendor/node/current/bin:$PATH"; cd ~/website && pnpm test:coverage'
```

**CI:** `.github/workflows/verify.yml` runs lint, `check:hosts`, `check:vocabulary`, `notices:check`, typecheck, `pnpm test:coverage`, then a SonarCloud scan with `sonar.qualitygate.wait=true` (`SONAR_TOKEN` required). Automatic Analysis must stay **off** for `turbopanel_website`.

**Vitest convention:** place suites at `src/**/*.test.ts`. Import `describe` / `it` / `expect` from `vitest`. Unit coverage targets `src/lib/**/*.ts` only (`vitest.config.ts`); Next routes and marketing/docs chrome stay out of the Sonar denominator via `sonar.coverage.exclusions`.

## Marketing & docs UI design (ui-ux-pro-max)

This repo is the **public marketing + docs site**, not the signed-in product console. Visual work here must follow the installed **ui-ux-pro-max** skill and the persisted TurboPanel Website design system. Do not invent a parallel look from generic SaaS defaults.

### This repo vs product console (`~/ui`)

| | **website** (this repo) | **ui** (`~/ui`) |
| --- | --- | --- |
| Surface | Marketing pages, landing/heroes, docs chrome, pricing/roadmap | Org console, admin, install/sign-in product UI |
| North star | Fast, trustworthy, **light-first** marketing + readable docs; dark mode supported | Dark-first OLED ops console, dense tables |
| Design system | `design-system/turbopanel-website/` | `design-system/turbopanel/` |
| Skill path | `.agents/skills/ui-ux-pro-max/` | `.agents/skills/ui-ux-pro-max/` |
| Tokens | `--tp-*` in `src/app/globals.css` | `src/lib/theme.ts` (Tamagui) |
| Stack search | `--stack nextjs` (also `react` / `html-tailwind` as needed) | `--stack react-native` |

Shared brand cues: primary blue `#3366cc`, secondary green `#3dd68c`. Do **not** copy OLED console density, Tamagui patterns, or console page overrides into this site — and do not apply this site’s spacious marketing layout to the console.

### When to use (mandatory)

Invoke the skill **before designing or changing visuals** when the task touches any of:

- Marketing pages (`src/app/page.tsx`, `/setups`, `/pricing`, `/roadmap`, heroes, landing sections)
- Docs chrome / layout visuals (site header, sticky chrome, Fumadocs shell theming, sidebar chrome — not pure MDX prose edits)
- Typography, color, spacing, elevation, motion, or CTA treatment
- New or refactored marketing components under `src/components/marketing/`
- Visual review / consistency passes on public pages

Skip the skill for pure content/MDX copy, API/config wiring, Workers/deploy scripts, or non-visual refactors — unless the change alters how something looks, moves, or is interacted with.

### Canonical paths

| What | Path |
| --- | --- |
| Skill (read first) | [`.agents/skills/ui-ux-pro-max/SKILL.md`](.agents/skills/ui-ux-pro-max/SKILL.md) |
| Search CLI | `.agents/skills/ui-ux-pro-max/scripts/search.py` |
| Cursor rule | [`.cursor/rules/ui-ux-pro-max.mdc`](.cursor/rules/ui-ux-pro-max.mdc) |
| Master (global SoT) | [`design-system/turbopanel-website/MASTER.md`](design-system/turbopanel-website/MASTER.md) |
| Page overrides | `design-system/turbopanel-website/pages/<page>.md` when present (e.g. `home.md`, `setups.md`, `roadmap.md`, `about-logo.md`, `docs.md`; page wins over Master) |
| CSS tokens | `src/app/globals.css` (`--tp-*`, `--tp-glass-*`, `--font-display`) |
| Shared CTAs | `src/components/marketing/MarketingPrimaryCta.tsx` (+ secondary / primitives nearby) |

### Mandatory first steps

From the **website repo root**, before building or restyling UI:

1. **Read** `design-system/turbopanel-website/MASTER.md`, then `pages/<page>.md` if it exists (page overrides Master). These are the curated site contract — do not let later skill searches override them.
2. **Read** `.agents/skills/ui-ux-pro-max/SKILL.md` (workflow, domains, anti-pattern priorities).
3. **Search** the skill DB only as a supplemental aid (prefer `python3` if `python` is missing). Searches fill gaps for a11y, interaction, UX, and `--stack nextjs`; they must **not** override Master, page overrides, or product constraints:

```bash
# Persisted site system — supplemental; curated Master / pages win
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "developer tool devops control plane B2B" --design-system -p "TurboPanel Website"

# Domain deep-dives as needed
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain color
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain typography
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain landing
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain icons

# Stack guidance for this repo
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs
```

4. **Reuse** existing marketing primitives (`MarketingPrimaryCta`, `MarketingPageShell`, hero/canvas helpers) before inventing new ones.
5. **Implement** with `--tp-*` tokens — no one-off hex in components.

Do **not** regenerate Master with `--persist --force` unless an explicit redesign was requested. Master already exists and is curated.

### Decision order

Apply in this order (later steps only fill gaps; they do not override earlier project rules):

1. **Product constraints** (below) — non-negotiable brand / tokens / motion rules
2. Page override `design-system/turbopanel-website/pages/<page>.md` (if present)
3. Master `design-system/turbopanel-website/MASTER.md`
4. Skill guidance (`SKILL.md` + `search.py`) — required for a11y, interaction, UX, and `--stack nextjs`; do **not** let generic skill palettes replace `--tp-*` tokens or curated Master / page decisions
5. Existing marketing / docs chrome components in this repo
6. New code

### Product constraints (keep)

These are non-negotiable for this site (detail + checklist live in Master):

- Tokens: `--tp-*` in `globals.css`; dual brand `--tp-blue` `#3366cc` (primary via `--tp-accent` — links, CTAs, docs) + `--tp-green` `#3dd68c` (secondary HA / live); brand stripe blue→green; restrained **frosted chrome** via `--tp-glass-*` / `.tp-glass` (sticky chrome, cards — not dense docs tables)
- Logo kit: static files in `public/brand/` (`turbopanel-logo*`); site chrome via `src/components/Logo.tsx`; public guidelines at **`/about/logo`**
- Display: **Plus Jakarta Sans** (`--font-display` / `.tp-display`); body stays Geist
- **No entrance fade/slide animations** — SSG content must paint instantly
- At most **one** pulsing hero CTA per page (`MarketingPrimaryCta` `emphasis` / `tp-cta-emphasis`); honor `prefers-reduced-motion`
- Roadmap / narrative: **vertical timeline** + featured “now” panel — never a wizard-style horizontal stepper
- Prefer sections/lists over decorative card grids; hairline borders over heavy shadows

### Anti-patterns / do-not

- Skip the skill and freestyle a purple/indigo SaaS or cream+serif “AI default” look
- Apply `~/ui` OLED console / Tamagui / dense-ops patterns to marketing or docs chrome
- Raw hex in components when a `--tp-*` token exists
- Entrance choreography, staggered reveals, GSAP scroll theaters, multiple pulsing CTAs
- Emoji-as-icons; layout-shifting hover scales on cards
- Silent `--persist --force` of Master (discards curated decisions)
- Fetch `/api/config` on every static page just to theme or link Sign in (use `control-plane-hosts` / `env` helpers)

## File layout

```
website/
├── .agents/skills/ui-ux-pro-max/   # Installed design skill (SKILL.md + search.py)
├── design-system/turbopanel-website/  # MASTER.md + optional pages/
├── docs/                 # Fumadocs MDX (canonical)
├── src/app/              # App Router (+ globals.css tokens)
├── src/components/       # Shared UI (marketing/ docs chrome)
├── src/lib/              # env, source, scalar helpers
├── public/
├── next.config.js
├── source.config.ts
├── mdx-components.tsx
├── open-next.config.ts
├── wrangler.jsonc
└── AGENTS.md
```

## Key conventions

### SonarQube (CI-based analysis)

- Analysis runs in GitHub Actions (`.github/workflows/verify.yml`) with
  `SONAR_TOKEN` and `sonar-project.properties`
  (`sonar.projectKey=turbopanel_website`, `sonar.organization=turbopanel`). The job
  runs lint + checks + typecheck + **`pnpm test:coverage`** (Vitest v8 LCOV at
  `coverage/lcov.info`), then scans with
  `sonar.javascript.lcov.reportPaths=coverage/lcov.info`. The scan waits on the
  quality gate (`sonar.qualitygate.wait=true`); if the gate fails, the workflow
  stops.
- Vitest coverage `include` is `src/lib/**/*.ts` (`vitest.config.ts`).
  `sonar.coverage.exclusions` must keep Next routes (`src/app/**`), marketing/docs
  chrome (`src/components/**`), `**/*.tsx`, and the Fumadocs loader wiring
  (`src/lib/source.ts`) out of the coverage denominator so untested pages do
  not fail Sonar-way **Coverage on New Code ≥ 80%**. Font options
  (`wordmark-font.ts`) and the client-mount snapshot hook
  (`use-client-mounted.ts`) are unit-tested.
- **`sonar.sources` / `sonar.tests` / `sonar.test.inclusions`** must stay set in
  `sonar-project.properties` (and mirrored in vestigial
  `.sonarcloud.properties`). Tests are co-located (`**/*.test.ts` under `src`).
- **Automatic Analysis must stay off** for `turbopanel_website` (SonarCloud →
  project **Administration → Analysis Method**). CI and Automatic Analysis
  cannot run together — Automatic Analysis enabled makes the CI scanner fail.
- Sonar-way **Coverage on New Code ≥ 80%** needs LCOV on CI. After switching
  from Automatic Analysis, reset **New Code** (Administration → New Code) so the
  baseline is not months of uncovered history, or the gate will fail even with
  fresh coverage reports.

### TypeScript style (SonarQube)

- Prefer **`String#replaceAll()`** over **`String#replace()` with a global regex** when replacing every occurrence of a substring (`typescript:S7781`).
- Use **`String.raw`** for string literals that contain backslashes so escapes stay readable and correct (`typescript:S7780`).
- Prefer **optional chaining** over manual null checks (`typescript:S6582`).
- Avoid **nested ternaries** — use `if`/`switch` or helpers (`typescript:S3358`).
- Extract helpers when **cognitive complexity** exceeds 15 (`typescript:S3776`).

### Site & docs conventions

- **Site chrome** (`src/components/StickySiteChrome.tsx`) — sticky banner + `SiteHeader` (Sign in, social icons, theme toggle). Social icons (`SocialNavLinks`): GitHub (external) + Discord (`/discord` → invite via `next.config.js` redirects). Theme toggle visuals follow `html.dark` via Tailwind `dark:` (no mount-gated light→dark FOUC). On scroll the evolving-fast banner collapses and the nav shrinks; `--tp-chrome-height` (via ResizeObserver) feeds Fumadocs `--fd-banner-height` and Scalar `--scalar-custom-header-height` so docs/API sidebars fill the remaining viewport without a dead scroll strip. Soft navigations that change `pathname` (and have no URL hash) scroll to top and expand the full-size chrome; hash/anchor targets leave scroll alone. Docs sidebar theme switch is disabled (`themeSwitch.enabled: false`) — theme lives only in the site nav. **Responsive:** the full nav row needs ~800px beside the logo, so below `lg` the links, social icons, and theme toggle move into `MobileNavMenu` (hamburger disclosure; panel is `absolute` inside the header, scrim portalled to `<body>` because the chrome's `backdrop-filter` is a containing block). The Sign in CTA stays in the bar down to 360px and lives only in the panel below that.
- **Control-plane URL for Sign in / API docs:** canonical map in `src/lib/control-plane-hosts.ts` (`WEBSITE_HOST_TO_CONTROL_PLANE` + `WRANGLER_API_HOSTNAMES`); helpers in `src/lib/env.ts`. Local website → `https://localhost:8443`; marketing hosts map to TurboPanel High Availability (`turbopanel.io` → `turbopanel.app`, `testing.turbopanel.io` → `testing.turbopanel.dev`, `staging.turbopanel.io` → `staging.turbopanel.dev`). Sign-in and `/docs/api` resolve locally from that map — do **not** fetch `/api/config` on every static page load. Wrangler `API_HOSTNAMES` (first entry) wins on the Worker when present; keep it aligned via `pnpm check:hosts`.
- **`/api/config`** remains for external consumers (Scalar embeds, tools). It sets `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` — see the file header in `src/app/api/config/route.ts`.
- **Docs typography:** MDX bodies **must** stay wrapped in Fumadocs' `DocsBody` (`src/app/docs/(main)/[[...slug]]/page.tsx`) — that wrapper is the only thing that applies the `prose` layer. Rendering the MDX directly inside `DocsPage` drops it, and headings collapse to 16px/400 while tables lose every border and cell padding. The TurboPanel treatment layered on top lives under `#nd-page .prose` in `globals.css` (display-font headings, ruled `h2` sections, banded tables, recessed code blocks, card blockquotes, framed diagrams). Target `.prose`, not `article` — `DocsPage` renders no `<article>`. Fumadocs tags **heading anchor links** with `data-card` as well as real `<Card>`s, so card rules must be scoped with `.block`.
- **Code block labels:** `rehypeCodeOptions.addLanguageClass` (`source.config.ts`) keeps `language-*` on the inner `<code>`; `mdx-components.tsx` maps it to a human label and passes it as the block's `title`, which is what makes Fumadocs render the header bar. Add new languages to `LANGUAGE_LABELS` there.
- **MDX inline components:** keep `<File>` (and other inline JSX) on the *same line* as the surrounding prose. A JSX tag starting its own line is parsed as a block, which splits the paragraph and strands punctuation on its own row.
- **Docs SSR:** `DocsLayoutClient` always renders Fumadocs `DocsLayout` + children so SSG HTML includes the article body. Sidebar collapse is disabled (`sidebar.collapsible: false`) to avoid gating content behind a client mount. HTML evaluation lives in `src/lib/docs-ssr.ts`; after `pnpm build`, run `pnpm check:docs-ssr` (`scripts/check-docs-ssr.mjs` reads the built introduction page). `nav.title` is set so Fumadocs' nav-title slot is not an empty `<a>` in the sidebar header and the mobile `#nd-subnav`.
- **Docs grid widths:** never pin `--fd-sidebar-width` in `globals.css`. Fumadocs holds it at `0px` and raises it to 268px only from `md:` up (the sidebar placeholder is `max-md:hidden`); a hard value reserves the sidebar column on phones and pushes the article into a narrow strip. `--fd-layout-width` is `100%`, not `100vw`, so the main column does not overrun by the scrollbar width. The mobile sidebar drawer (`#nd-sidebar-mobile` + its overlay) is lifted to `z-index: 60` so it clears the z-50 sticky site chrome.
- **Vocabulary CI guard:** forbidden daemon-as-agent and Apple-associated chrome phrases, skip/allowlist, and per-file scan live in `src/lib/vocabulary.ts` (keep the list aligned with the daemon, instance, UI, and `.github` copies). `scripts/check-vocabulary.mjs` walks the tree and exits non-zero on hits.
- **Third-party notices:** `pnpm notices:generate` writes `THIRD_PARTY_NOTICES.md` from the resolved pnpm graph. It complements first-party `NOTICE` (Apache-2.0 attribution) and inlines dependency NOTICE files; it does not replace `NOTICE`. CI `pnpm notices:check` fails on a stale file or an unreviewed production license class. Product-facing copy that describes licenses must also name this file (and that third-party marks are never covered by TurboPanel licenses or the UI App Store additional permission). Canonical operator doc: [`docs/getting-started/licensing.mdx`](./docs/getting-started/licensing.mdx).
- **Mermaid diagrams:** client `<Mermaid>` lazy-loads the Mermaid chunk when a diagram nears the viewport (IntersectionObserver). Build-time SVG in `source.config.ts` is deferred because light/dark theme switching needs runtime re-render or dual SVGs — diagram pages still pay a large Mermaid chunk, but only after scroll proximity.
- **`editOnGithub`** on docs pages and the MDX `<File>` chip both use **`DOCS_GITHUB`** in `src/lib/docs-github.ts` (`TurboPanel/website` on branch **`trunk`**); paths are `docs/…` (no monorepo prefix).
- **`resolveSessionCookieNameFromBaseUrl`** is inlined in `src/lib/scalar-session-cookie.ts` — no `@turbopanel/validation` dependency.
- **`getApiBaseUrl`** / control-plane localhost fallback is **`https://localhost:8443`** (Caddy HTTPS entrypoint; `CADDY_PORT` / `NEXT_PUBLIC_CADDY_PORT` are set on `turbopanel-website.service` by the daemon's `instance-launch` Ansible role). Wrangler (`INSTANCE_DEV_PORT`) is not browser-facing.
- **Scalar in local dev** targets **`https://localhost:8443`** (Caddy) for spec + try-it. Cross-origin from the docs site (`WEBSITE_PORT`, default 19820) requires **`TURBOPANEL_UI_CORS_ORIGINS`** on the instance (Ansible injects it into `turbopanel-instance.service` on co-located dev).
- **Scalar auth is surface-specific:** Client API docs use cookie auth only (`buildScalarCookieAuthentication`); Daemon API docs use Bearer JWT only (`buildScalarBearerAuthentication`). Pass an **array of configs** (one document each) to `ApiReferenceReact` / `Scalar.createApiReference` — do not use a shared `sources` list with both schemes in one `authentication` object (that lets users switch between cookie and Bearer on every surface).

## Worker / limits

Node.js **runtime** on Workers (not Edge runtime). Size: check Wrangler compressed output after build. **Bindings:** see `wrangler.jsonc` (assets, images, self-reference).

### Caching (cost + speed)

This site is mostly SSG (marketing pages + Fumadocs with `generateStaticParams`). `open-next.config.ts` uses OpenNext’s **static-assets incremental cache** + **cache interception** so prerendered HTML is served from Workers Static Assets (free/unlimited requests) and cache hits skip loading Next.js page JS. Do **not** add R2 / KV / D1 / Durable Object queue bindings unless we introduce ISR or `revalidateTag` / `revalidatePath`.

`public/_headers` sets immutable caching for `/_next/static/*`.

**Cloudflare dashboard:** no extra resources to create for this caching path — only the existing Workers (`website`, `testing-website`, `staging-website`) and custom domains. `IMAGES` is declared for future `next/image` use; unused transforms cost nothing.

### Observability (Workers Logs)

Sampling is **per environment** in `wrangler.jsonc` (named envs do not inherit top-level observability):

| Env | `head_sampling_rate` | `invocation_logs` |
| --- | --- | --- |
| development (default) | `0.25` | on |
| testing | `0.25` | on |
| staging | `0.1` | on |
| **live** | `0.01` | **off** |

Live disables routine invocation logs so high traffic does not dominate Workers Logs cost; a 1% head sample still captures explicit `console.*` lines when diagnosis is needed.

**Incident bump (live):** temporarily set `env.live.observability.logs.invocation_logs` to `true` and/or raise `head_sampling_rate` (e.g. `0.1`–`1`), redeploy (`pnpm deploy` / upload with `--env live`), gather logs, then restore the cheap defaults above and redeploy again. Do not leave elevated live sampling after the incident.

## Related

- Fumadocs https://fumadocs.vercel.app
- OpenNext Cloudflare https://opennext.js.org/cloudflare
