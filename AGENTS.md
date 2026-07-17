# AGENTS.md

**Package:** `@turbopanel/website` — Next.js 16 marketing + Fumadocs docs.

**Default branch:** `trunk`

**Docs content:** MDX under `docs/` (Fumadocs; `source.config.ts` → `dir: 'docs'`). Daemon-cell / Durable Object architecture docs must use the **SQLite-backed** Durable Object pricing model (rows read/written, `setAlarm()` = 1 row written, deletes = writes, KV-style methods billed as rows; compute requests incl. WS connect + 20:1 incoming-WS-message ratio + alarm invocations; 128 MB duration; hibernation) — **never legacy KV-backed DO pricing** — and the canonical source is `~/instance/AGENTS.md` (Daemon Cell). (Leave the actual docs/diagrams to the website-docs phase.)

## Pricing (copy source of truth)

Marketing and docs **must** match live product pages. Canonical public page: **https://turbopanel.io/pricing** (Edge-hosted tiers: base **$X**/mo including first server, **$X**/mo per additional server, annual **pay X get X**; self-hosted control plane **free**, unlimited servers subject to customer infra). Dollar amounts on marketing surfaces are placeholders (`X`) until final pricing ships.

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
| `pnpm preview` | OpenNext build + Wrangler preview |
| `pnpm deploy` / `upload` | OpenNext Cloudflare deploy / upload |
| `pnpm cf-typegen` | `wrangler types` → `cloudflare-env.d.ts` |

## File layout

```
website/
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

- **`editOnGithub`** on docs pages and the MDX `<File>` chip both use **`DOCS_GITHUB`** in `src/lib/docs-github.ts` (`turbopanel/website` on branch **`trunk`**); paths are `docs/…` (no monorepo prefix).
- **`resolveSessionCookieNameFromBaseUrl`** is inlined in `src/lib/scalar-session-cookie.ts` — no `@turbopanel/validation` dependency.
- **`getApiBaseUrl`** localhost fallback is **`https://localhost:8443`** (Caddy HTTPS entrypoint; `CADDY_PORT` / `NEXT_PUBLIC_CADDY_PORT` from Tilt `dev/.env`). Wrangler (`INSTANCE_DEV_PORT`) is not browser-facing.
- **Scalar in local dev** targets **`https://localhost:8443`** (Caddy) for spec + try-it. Cross-origin from the docs site (`WEBSITE_PORT`, default 19820) requires **`TURBOPANEL_UI_CORS_ORIGINS`** on the instance (synced from `dev/.env` via `sync-env.sh`).
- **Scalar auth is surface-specific:** Client API docs use cookie auth only (`buildScalarCookieAuthentication`); Daemon API docs use Bearer JWT only (`buildScalarBearerAuthentication`). Pass an **array of configs** (one document each) to `ApiReferenceReact` / `Scalar.createApiReference` — do not use a shared `sources` list with both schemes in one `authentication` object (that lets users switch between cookie and Bearer on every surface).

## Worker / limits

Node.js **runtime** on Workers (not Edge runtime). Size: check Wrangler compressed output after build. **Bindings:** see `wrangler.jsonc` (assets, images, self-reference).

### Caching (cost + speed)

This site is mostly SSG (marketing pages + Fumadocs with `generateStaticParams`). `open-next.config.ts` uses OpenNext’s **static-assets incremental cache** + **cache interception** so prerendered HTML is served from Workers Static Assets (free/unlimited requests) and cache hits skip loading Next.js page JS. Do **not** add R2 / KV / D1 / Durable Object queue bindings unless we introduce ISR or `revalidateTag` / `revalidatePath`.

`public/_headers` sets immutable caching for `/_next/static/*`. Observability logs are sampled (`head_sampling_rate: 0.1`) to limit Workers Logs volume.

**Cloudflare dashboard:** no extra resources to create for this caching path — only the existing Workers (`website`, `testing-website`, `staging-website`) and custom domains. `IMAGES` is declared for future `next/image` use; unused transforms cost nothing.

## Related

- Fumadocs https://fumadocs.vercel.app
- OpenNext Cloudflare https://opennext.js.org/cloudflare
