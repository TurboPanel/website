# TurboPanel Website & Docs

**Marketing site and canonical documentation** for [TurboPanel](https://turbopanel.io) — Next.js 16, Fumadocs MDX, deployed to Cloudflare Workers via OpenNext.

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=turbopanel_website&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=turbopanel_website)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=turbopanel_website&metric=coverage)](https://sonarcloud.io/component_measures?id=turbopanel_website&metric=coverage)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=turbopanel_website&metric=code_smells)](https://sonarcloud.io/project/issues?id=turbopanel_website&resolved=false&types=CODE_SMELL)

GitHub: [TurboPanel/website](https://github.com/TurboPanel/website)

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
3. Terminology: public name is **TurboPanel Control Plane** ([TurboPanel/turbopanel](https://github.com/TurboPanel/turbopanel)); keep `instance` for internal/runtime references only.
4. **Edit on GitHub** links and the MDX `<File>` chip resolve via [`src/lib/docs-github.ts`](./src/lib/docs-github.ts) (`TurboPanel/website`, branch `trunk`).

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

For API-integrated work, use the [TurboPanel Development Environment](https://github.com/TurboPanel/dev):

Clone the six sibling repos (including this one), then from the `dev` checkout:

```sh
vagrant up
vagrant ssh
# inside guest:
dev/console
```

That converges the website checkout alongside the control plane, daemon, and UI inside the Vagrant guest.

## Contributing

[Routing guide](https://github.com/TurboPanel/.github/blob/trunk/CONTRIBUTING.md) · [Contributor License Agreement](https://github.com/TurboPanel/.github/blob/trunk/CLA.md) · [Documentation issue template](https://github.com/TurboPanel/website/issues/new?template=documentation.yml)

Agent conventions, design system workflow, and file layout: [AGENTS.md](./AGENTS.md).

## License

Site and application code is licensed under the [Apache License 2.0](./LICENSE).
Documentation under `docs/` is licensed under [CC BY 4.0](./LICENSES/CC-BY-4.0.txt).
See [LICENSES/README.md](./LICENSES/README.md).

The TurboPanel name and logos are trademarks. See [TRADEMARKS.md](./TRADEMARKS.md).

Copyright (C) 2025-2026 TurboPanel contributors
