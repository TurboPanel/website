# TurboPanel Website

Next.js 16 marketing site and Fumadocs documentation for [TurboPanel](https://turbopanel.io).

## Stack

- **Next.js 16** (App Router, Turbopack for dev)
- **OpenNext Cloudflare** — production adapter (`open-next.config.ts`, `wrangler.jsonc`)
- **Fumadocs MDX** — docs under `docs/`
- **Tailwind CSS v4**

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | `next dev --port 19820` |
| `pnpm build` | `next build --webpack` |
| `pnpm preview` | OpenNext build + Wrangler preview |
| `pnpm deploy` | OpenNext build + Cloudflare deploy |
| `pnpm upload` | OpenNext build + Cloudflare upload |
| `pnpm cf-typegen` | Regenerate `cloudflare-env.d.ts` from Wrangler |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:19820](http://localhost:19820).

For agent-specific conventions and file layout, see [AGENTS.md](./AGENTS.md).
