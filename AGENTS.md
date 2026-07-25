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

Co-located dev runs the docs site via **`turbopanel-website.service`** (systemd) as the **dev user**. Stdout/stderr append to **`/var/log/turbopanel/website/website.log`** and **`website.err.log`** (dev-user-owned); production deploys to Cloudflare Workers only.
| `pnpm build` | `next build --webpack` |
| `pnpm check:hosts` | Assert `wrangler.jsonc` `API_HOSTNAMES` match `src/lib/control-plane-hosts.ts` |
| `pnpm check:docs-ssr` | After build: assert docs HTML includes page body (not only `Loading…`) |
| `pnpm preview` | OpenNext build + Wrangler preview |
| `pnpm deploy` / `upload` | OpenNext Cloudflare deploy / upload |
| `pnpm cf-typegen` | `wrangler types` → `cloudflare-env.d.ts` |

## Marketing design

Visual source of truth for marketing pages: [`design-system/turbopanel-website/MASTER.md`](design-system/turbopanel-website/MASTER.md) (ui-ux-pro-max). Page overrides live under `design-system/turbopanel-website/pages/` (e.g. `roadmap.md`). Tokens: `--tp-*` in `src/app/globals.css` — CTA accent is product green `#3dd68c`. Display headings use **Plus Jakarta Sans** (`--font-display` / `.tp-display`); body stays Geist. **No entrance fade/slide animations** (SSG must paint instantly). At most one pulsing hero CTA per page (`MarketingPrimaryCta` with `emphasis` / class `tp-cta-emphasis`); honor `prefers-reduced-motion`. Shared CTAs: `src/components/marketing/MarketingPrimaryCta.tsx`. Roadmap uses a vertical timeline + featured “now” panel — never a wizard-style horizontal stepper.

## File layout

```
website/
├── design-system/        # Marketing MASTER (ui-ux-pro-max)
├── docs/                 # Fumadocs MDX (canonical)
├── src/app/              # App Router
├── src/components/       # Shared UI
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

- **Site chrome** (`src/components/StickySiteChrome.tsx`) — sticky banner + `SiteHeader` (Sign in, social icons, theme toggle). On scroll the evolving-fast banner collapses and the nav shrinks; `--tp-chrome-height` (via ResizeObserver) feeds Fumadocs `--fd-banner-height` and Scalar `--scalar-custom-header-height` so docs/API sidebars fill the remaining viewport without a dead scroll strip. Soft navigations that change `pathname` (and have no URL hash) scroll to top and expand the full-size chrome; hash/anchor targets leave scroll alone. Docs sidebar theme switch is disabled (`themeSwitch.enabled: false`) — theme lives only in the site nav.
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
