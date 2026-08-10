# TurboPanel Website & Docs

**Marketing site and canonical documentation** for [TurboPanel](https://turbopanel.io) — Next.js 16, Fumadocs MDX, deployed to Cloudflare Workers via OpenNext.

[![License: AGPL-3.0-only](https://img.shields.io/badge/License-AGPL--3.0--only-blue.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/live-turbopanel.io%2Fdocs-3366cc)](https://turbopanel.io/docs)
[![Status: Private alpha](https://img.shields.io/badge/status-private%20alpha-3dd68c)](https://turbopanel.io/roadmap)

GitHub: [turbopanel/website](https://github.com/turbopanel/website)

## Easiest first contribution

Documentation fixes and copy improvements are high-impact and review quickly. Most pages are MDX under `docs/` — no control-plane checkout required.

| Content | Location |
| --- | --- |
| **Documentation (canonical)** | `docs/**/*.mdx` + `meta.json` navigation |
| **Marketing pages** | `src/app/` (home, pricing, roadmap, open-source, security, …) |
| **Shared marketing components** | `src/components/marketing/` |
| **Design system** | `design-system/turbopanel-website/` |

Live site: **[turbopanel.io](https://turbopanel.io)** · **[turbopanel.io/docs](https://turbopanel.io/docs)**

## Fix a documentation page

1. Edit the MDX file under `docs/` (frontmatter `title` / `description` required).
2. Update the parent `meta.json` if you add or rename a page.
3. Terminology: public name is **TurboPanel Control Plane** ([turbopanel/turbopanel](https://github.com/turbopanel/turbopanel)); keep `instance` for internal/runtime references only.
4. **Edit on GitHub** links and the MDX `<File>` chip resolve via [`src/lib/docs-github.ts`](./src/lib/docs-github.ts) (`turbopanel/website`, branch `trunk`).

Preview locally:

```sh
pnpm install
pnpm dev   # http://localhost:19820
```

Production build checks:

```sh
pnpm build
pnpm check:docs-ssr
pnpm check:hosts
```

## Marketing accuracy

Claims on `src/app/**` must match shipped product behavior. Check the [roadmap](https://turbopanel.io/roadmap) and sibling repo READMEs before asserting features. Pricing copy follows [AGENTS.md](./AGENTS.md) — coordinate with `/pricing` when changing commercial messaging.

Larger information-architecture changes: ask in [Discord](https://turbopanel.io/discord) or open an issue first with the proposed nav / page split.

## Deployment (contributors)

Production deploy uses OpenNext + Wrangler — detail in [docs/development/website-deploy.mdx](https://turbopanel.io/docs/development/website-deploy) (contributor doc). Co-located dev runs `turbopanel-website.service` on port **19820**.

## Full stack development

For API-integrated work, use the [TurboPanel Development Environment](https://github.com/turbopanel/dev):

```sh
curl -fsSL dev.turbopanel.sh | sh
```

That converges `~/website` alongside the control plane, daemon, and UI.

## Contributing

[Routing guide](https://github.com/turbopanel/.github/blob/trunk/CONTRIBUTING.md) · [Documentation issue template](https://github.com/turbopanel/website/issues/new?template=documentation.yml)

Agent conventions, design system workflow, and file layout: [AGENTS.md](./AGENTS.md).

## License

TurboPanel Website is licensed under the [GNU Affero General Public License v3.0 only (AGPL-3.0-only)](./LICENSE).

Copyright (C) 2025 TurboPanel contributors
