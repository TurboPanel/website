# AGENTS.md

**Package:** `@turbopanel/website` — Next.js 16 marketing + Fumadocs docs.

**Default branch:** `trunk`

**Docs content:** MDX under `docs/` (Fumadocs; `source.config.ts` → `dir: 'docs'`). Daemon-cell / Durable Object architecture docs must use the **SQLite-backed** Durable Object pricing model (rows read/written, `setAlarm()` = 1 row written, deletes = writes, KV-style methods billed as rows; compute requests incl. WS connect + 20:1 incoming-WS-message ratio + alarm invocations; 128 MB duration; hibernation) — **never legacy KV-backed DO pricing** — and the canonical source is `~/instance/AGENTS.md` (Daemon Cell). (Leave the actual docs/diagrams to the website-docs phase.)

## Pricing (copy source of truth)

Marketing and docs **must** match live product pages. Canonical public page: **https://turbopanel.io/pricing** (TurboPanel High Availability tiers: base **$X**/mo including first server, **$X**/mo per additional server, annual **pay X get X**; self-hosted control plane **free**, unlimited servers subject to customer infra). Dollar amounts on marketing surfaces are placeholders (`X`) until final pricing ships.

**Infrastructure metrics costs (distinct from product pricing):** Cloudflare Analytics Engine price constants, limits, formulas, and the verification date live in exactly one doc — [`docs/architecture/server-metrics.mdx`](docs/architecture/server-metrics.mdx) (Cost section). Keep that section dated when Cloudflare pricing changes; do not scatter AE pricing constants into app code or other pages.

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
| `pnpm check:hosts` | Assert `wrangler.jsonc` `API_HOSTNAMES` match `src/lib/control-plane-hosts.ts` |
| `pnpm check:docs-ssr` | After build: assert docs HTML includes page body (not only `Loading…`) |
| `pnpm preview` | OpenNext build + Wrangler preview |
| `pnpm deploy` / `upload` | OpenNext Cloudflare deploy / upload |
| `pnpm cf-typegen` | `wrangler types` → `cloudflare-env.d.ts` |

Co-located dev runs the docs site via **`turbopanel-website.service`** (systemd) as the **dev user**. Stdout/stderr append to **`/var/log/turbopanel/website/website.log`** and **`website.err.log`** (dev-user-owned); production deploys to Cloudflare Workers only.

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

Shared brand cue only: CTA / accent green `#3dd68c`. Do **not** copy OLED console density, Tamagui patterns, or console page overrides into this site — and do not apply this site’s spacious marketing layout to the console.

### When to use (mandatory)

Invoke the skill **before designing or changing visuals** when the task touches any of:

- Marketing pages (`src/app/page.tsx`, `/pricing`, `/roadmap`, heroes, landing sections)
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
| Page overrides | `design-system/turbopanel-website/pages/<page>.md` when present (e.g. `roadmap.md`; page wins over Master) |
| CSS tokens | `src/app/globals.css` (`--tp-*`, `--font-display`) |
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

- Tokens: `--tp-*` in `globals.css`; dual brand `--tp-green` `#3dd68c` + `--tp-blue` `#3366cc` (CTA stays green via `--tp-accent`); brand stripe green→blue
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

### TypeScript style (SonarQube)

- Prefer **`String#replaceAll()`** over **`String#replace()` with a global regex** when replacing every occurrence of a substring (`typescript:S7781`).
- Use **`String.raw`** for string literals that contain backslashes so escapes stay readable and correct (`typescript:S7780`).
- Prefer **optional chaining** over manual null checks (`typescript:S6582`).
- Avoid **nested ternaries** — use `if`/`switch` or helpers (`typescript:S3358`).
- Extract helpers when **cognitive complexity** exceeds 15 (`typescript:S3776`).

### Site & docs conventions

- **Site chrome** (`src/components/StickySiteChrome.tsx`) — sticky banner + `SiteHeader` (Sign in, social icons, theme toggle). Social icons (`SocialNavLinks`): GitHub (external) + Discord (`/discord` → invite via `next.config.js` redirects). On scroll the evolving-fast banner collapses and the nav shrinks; `--tp-chrome-height` (via ResizeObserver) feeds Fumadocs `--fd-banner-height` and Scalar `--scalar-custom-header-height` so docs/API sidebars fill the remaining viewport without a dead scroll strip. Soft navigations that change `pathname` (and have no URL hash) scroll to top and expand the full-size chrome; hash/anchor targets leave scroll alone. Docs sidebar theme switch is disabled (`themeSwitch.enabled: false`) — theme lives only in the site nav.
- **Control-plane URL for Sign in / API docs:** canonical map in `src/lib/control-plane-hosts.ts` (`WEBSITE_HOST_TO_CONTROL_PLANE` + `WRANGLER_API_HOSTNAMES`); helpers in `src/lib/env.ts`. Local website → `https://localhost:8443`; marketing hosts map to TurboPanel High Availability (`turbopanel.io` → `turbopanel.app`, `testing.turbopanel.io` → `testing.turbopanel.dev`, `staging.turbopanel.io` → `staging.turbopanel.dev`). Sign-in and `/docs/api` resolve locally from that map — do **not** fetch `/api/config` on every static page load. Wrangler `API_HOSTNAMES` (first entry) wins on the Worker when present; keep it aligned via `pnpm check:hosts`.
- **`/api/config`** remains for external consumers (Scalar embeds, tools). It sets `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` — see the file header in `src/app/api/config/route.ts`.
- **Docs SSR:** `DocsLayoutClient` always renders Fumadocs `DocsLayout` + children so SSG HTML includes the article body. Sidebar collapse is disabled (`sidebar.collapsible: false`) to avoid gating content behind a client mount. After `pnpm build`, run `pnpm check:docs-ssr`.
- **Mermaid diagrams:** client `<Mermaid>` lazy-loads the Mermaid chunk when a diagram nears the viewport (IntersectionObserver). Build-time SVG in `source.config.ts` is deferred because light/dark theme switching needs runtime re-render or dual SVGs — diagram pages still pay a large Mermaid chunk, but only after scroll proximity.
- **`editOnGithub`** on docs pages and the MDX `<File>` chip both use **`DOCS_GITHUB`** in `src/lib/docs-github.ts` (`turbopanel/website` on branch **`trunk`**); paths are `docs/…` (no monorepo prefix).
- **`resolveSessionCookieNameFromBaseUrl`** is inlined in `src/lib/scalar-session-cookie.ts` — no `@turbopanel/validation` dependency.
- **`getApiBaseUrl`** / control-plane localhost fallback is **`https://localhost:8443`** (Caddy HTTPS entrypoint; `CADDY_PORT` / `NEXT_PUBLIC_CADDY_PORT` from Tilt `dev/.env`). Wrangler (`INSTANCE_DEV_PORT`) is not browser-facing.
- **Scalar in local dev** targets **`https://localhost:8443`** (Caddy) for spec + try-it. Cross-origin from the docs site (`WEBSITE_PORT`, default 19820) requires **`TURBOPANEL_UI_CORS_ORIGINS`** on the instance (synced from `dev/.env` via `sync-env.sh`).
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
