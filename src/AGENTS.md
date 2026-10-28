# UI Source (`src/`) — AGENTS.md

Repo context: `../AGENTS.md`.

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
| Master (global SoT) | [`design-system/turbopanel-website/MASTER.md`](design-system/turbopanel-website/MASTER.md) |
| Page overrides | `design-system/turbopanel-website/pages/<page>.md` when present (e.g. `home.md`, `setups.md`, `pricing.md`, `roadmap.md`, `about-logo.md`, `docs.md`; page wins over Master) |
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
- Display: **Plus Jakarta Sans** (`--font-display` / `.tp-display`); body stays Geist; wordmark “urboPanel”: **Figtree ExtraBold Italic** only (`src/lib/figtree-font.ts`, `--font-wordmark`, skew in `wordmark-lockup.ts`; downloads under `public/brand/fonts/`). Light mode adds a 0.025 em hairline outline in the ink color (`--tp-wordmark-stroke`, kept equal to `BRAND_WORDMARK_FONT.outlineLightEm` by a test) while the weight stays 800 in both themes, so the word never shifts between themes
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

### TypeScript style (SonarQube)

- Prefer **`String#replaceAll()`** over **`String#replace()` with a global regex** when replacing every occurrence of a substring (`typescript:S7781`).
- Use **`String.raw`** for string literals that contain backslashes so escapes stay readable and correct (`typescript:S7780`).
- Prefer **optional chaining** over manual null checks (`typescript:S6582`).
- Avoid **nested ternaries** — use `if`/`switch` or helpers (`typescript:S3358`).
- Extract helpers when **cognitive complexity** exceeds 15 (`typescript:S3776`).

### Site & docs conventions
- **Site chrome** (`src/components/StickySiteChrome.tsx`) — sticky banner + `SiteHeader` (Sign in, social icons, theme toggle). Social icons (`SocialNavLinks`): GitHub (external) + Discord (`/discord` → invite via `next.config.js` redirects). Theme toggle visuals follow `html.dark` via Tailwind `dark:` (no mount-gated light→dark FOUC). On scroll the evolving-fast banner collapses and the nav shrinks; `--tp-chrome-height` (via ResizeObserver) feeds Fumadocs `--fd-banner-height` and Scalar `--scalar-custom-header-height` so docs/API sidebars fill the remaining viewport without a dead scroll strip. Soft navigations that change `pathname` (and have no URL hash) scroll to top and expand the full-size chrome; hash/anchor targets leave scroll alone. Docs sidebar theme switch is disabled (`themeSwitch.enabled: false`) — theme lives only in the site nav. **Responsive:** the full nav row needs ~800px beside the logo, so below `lg` the links, social icons, and theme toggle move into `MobileNavMenu` (hamburger disclosure; panel is `absolute` inside the header, scrim portalled to `<body>` because the chrome's `backdrop-filter` is a containing block). The Sign in CTA stays in the bar down to 360px and lives only in the panel below that.
- **Control-plane URL for Sign in / API docs:** canonical map in `src/lib/control-plane-hosts.ts` (`WEBSITE_HOST_TO_CONTROL_PLANE` for origins, `CONTROL_PLANE_SERVER_LABELS` for the Scalar server labels); helpers in `src/lib/env.ts` (`getControlPlaneBaseUrl`, `getControlPlaneServers`). Local website → `https://localhost:8443` (label `Local Dev`); marketing hosts map to TurboPanel High Availability (`turbopanel.io` → `turbopanel.app`, `testing.turbopanel.io` → `testing.turbopanel.dev`, `staging.turbopanel.io` → `staging.turbopanel.dev`). Sign-in and `/docs/api` resolve locally from that map — do **not** fetch `/api/config` on every static page load. The API routes derive the same values from the request `Host`; there is no `API_HOSTNAMES` deployment variable (removed — add one back only for a genuine emergency override, and then re-thread it through `env.ts`).
- **`/api/config`** remains for external consumers (Scalar embeds, tools). It sets `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` — see the file header in `src/app/api/config/route.ts`.
- **Docs typography:** MDX bodies **must** stay wrapped in Fumadocs' `DocsBody` (`src/app/docs/(main)/[[...slug]]/page.tsx`) — that wrapper is the only thing that applies the `prose` layer. Rendering the MDX directly inside `DocsPage` drops it, and headings collapse to 16px/400 while tables lose every border and cell padding. The TurboPanel treatment layered on top lives under `#nd-page .prose` in `globals.css` (display-font headings, ruled `h2` sections, banded tables, recessed code blocks, card blockquotes, framed diagrams). Target `.prose`, not `article` — `DocsPage` renders no `<article>`. Fumadocs tags **heading anchor links** with `data-card` as well as real `<Card>`s, so card rules must be scoped with `.block`.
- **Code block labels:** `rehypeCodeOptions.addLanguageClass` (`source.config.ts`) keeps `language-*` on the inner `<code>`; `mdx-components.tsx` maps it to a human label and passes it as the block's `title`, which is what makes Fumadocs render the header bar. Add new languages to `LANGUAGE_LABELS` there.
- **Docs SSR:** `DocsLayoutClient` always renders Fumadocs `DocsLayout` + children so SSG HTML includes the article body. Sidebar collapse is disabled (`sidebar.collapsible: false`) to avoid gating content behind a client mount. HTML evaluation lives in `src/lib/docs-ssr.ts`; after `pnpm build`, run `pnpm check:docs-ssr` (`scripts/check-docs-ssr.mjs` reads the built introduction page). `nav.title` is set so Fumadocs' nav-title slot is not an empty `<a>` in the sidebar header and the mobile `#nd-subnav`.
- **Docs grid widths:** never pin `--fd-sidebar-width` in `globals.css`. Fumadocs holds it at `0px` and raises it to 268px only from `md:` up (the sidebar placeholder is `max-md:hidden`); a hard value reserves the sidebar column on phones and pushes the article into a narrow strip. `--fd-layout-width` is `100%`, not `100vw`, so the main column does not overrun by the scrollbar width. The mobile sidebar drawer (`#nd-sidebar-mobile` + its overlay) is lifted to `z-index: 60` so it clears the z-50 sticky site chrome.
- **Mermaid diagrams:** client `<Mermaid>` lazy-loads the Mermaid chunk when a diagram nears the viewport (IntersectionObserver). Build-time SVG in `source.config.ts` is deferred because light/dark theme switching needs runtime re-render or dual SVGs — diagram pages still pay a large Mermaid chunk, but only after scroll proximity.
- **`editOnGithub`** on docs pages and the MDX `<File>` chip both use **`DOCS_GITHUB`** in `src/lib/docs-github.ts` (`TurboPanel/website` on branch **`trunk`**); paths are `docs/…` (no monorepo prefix).
- **`resolveSessionCookieNameFromBaseUrl`** is inlined in `src/lib/scalar-session-cookie.ts` — no `@turbopanel/validation` dependency.
- **`getApiBaseUrl`** / control-plane localhost fallback is **`https://localhost:8443`** (Caddy HTTPS entrypoint; `CADDY_PORT` / `NEXT_PUBLIC_CADDY_PORT` are set on `turbopanel-website.service` by the daemon's `instance-launch` Ansible role). Wrangler is not browser-facing.
- **Scalar in local dev** targets **`https://localhost:8443`** (Caddy) for spec + try-it. Cross-origin from the docs site (`WEBSITE_PORT`, default 19820) requires **`TURBOPANEL_UI_CORS_ORIGINS`** on the instance (Ansible injects it into `turbopanel-instance.service` on co-located dev).
- **Scalar auth is surface-specific:** Client API docs use cookie auth only (`buildScalarCookieAuthentication`); Daemon API docs use Bearer JWT only (`buildScalarBearerAuthentication`). Pass an **array of configs** (one document each) to `ApiReferenceReact` / `Scalar.createApiReference` — do not use a shared `sources` list with both schemes in one `authentication` object (that lets users switch between cookie and Bearer on every surface).
