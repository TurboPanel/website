# AGENTS.md

**Package:** `@turbopanel/website` — Next.js 16 marketing + Fumadocs docs.

**Default branch:** `trunk`

**Docs content:** MDX under `docs/` (Fumadocs; `source.config.ts` → `dir: 'docs'`).

## Pricing (copy source of truth)

Marketing and docs **must** match live product pages. Canonical public page: **https://turbopanel.io/pricing** (Edge-hosted tiers: base **$6**/mo including first server, **$4**/mo per additional server, annual **pay 10 get 12**; self-hosted control plane **free**, unlimited servers subject to customer infra).

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

- **`editOnGithub`** on docs pages points at the **`turbopanel/turbopanel-website`** repo on branch **`trunk`**; paths are `docs/…` (no monorepo prefix).
- **`resolveSessionCookieNameFromBaseUrl`** is inlined in `src/lib/scalar-session-cookie.ts` — no `@turbopanel/validation` dependency.
- **`getApiBaseUrl`** localhost fallback is **`https://localhost:8443`** (Caddy HTTPS entrypoint; `CADDY_PORT` / `NEXT_PUBLIC_CADDY_PORT` from Tilt `dev/.env`). Wrangler (`INSTANCE_DEV_PORT`) is not browser-facing.
- **Scalar in local dev** targets **`https://localhost:8443`** (Caddy) for spec + try-it. Cross-origin from the docs site (`WEBSITE_PORT`, default 19820) requires **`TURBOPANEL_CORS_ORIGINS`** on the instance (synced from `dev/.env` via `sync-env.sh`).

## Worker / limits

Node.js **runtime** on Workers (not Edge runtime). Size: check Wrangler compressed output after build. **Bindings:** see `wrangler.jsonc` (assets, images, etc.).

## Related

- Fumadocs https://fumadocs.vercel.app
- OpenNext Cloudflare https://opennext.js.org/cloudflare
