# TurboPanel Website

Marketing site and documentation for [TurboPanel](https://turbopanel.io) — Next.js 16 + Fumadocs, deployed to Cloudflare Workers via OpenNext.

GitHub: [turbopanel/website](https://github.com/turbopanel/website). Local checkout: `~/website` (or `${TURBOPANEL_WEBSITE_REPO}`).

## Development

Do **not** bootstrap this repo on its own. The co-located stack is owned by **[turbopanel/dev](https://github.com/turbopanel/dev)**.

```sh
curl -fsSL trbp.nl/develop.sh | sh
```

That installs/updates `~/dev`, launches the developer console, and (after **Converge**) brings up the full environment — including this site as `turbopanel-website.service` (dev server on port **19820**).

Typical layout after converge:

| Path | Repo |
| --- | --- |
| `~/dev` | [turbopanel/dev](https://github.com/turbopanel/dev) — console + Ansible overlay |
| `~/daemon` | daemon |
| `~/instance` | control plane |
| `~/ui` | product console |
| `~/website` | this repo |

Edit sources in place under `$HOME`. Re-converge from the console when the stack needs refresh. Details: [dev README](https://github.com/turbopanel/dev#readme) and [Local development](https://turbopanel.io/docs/getting-started/development).

## What runs here

- **Marketing** — App Router pages under `src/app/`
- **Docs** — Fumadocs MDX under `docs/`
- **Production** — OpenNext → Cloudflare Workers (`pnpm deploy` / `pnpm upload`)

Agent conventions and file layout: [AGENTS.md](./AGENTS.md).
