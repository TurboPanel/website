# Docs — Page Override

> Overrides `design-system/turbopanel-website/MASTER.md` for `/docs/*` (Fumadocs).

## Intent

Docs should feel like the same product as the marketing site: fast, trustworthy, light-first — not a generic grey wiki and not the OLED ops console.

## Voice (intro pages)

Lead with what operators get, not jargon:

- Prefer: *Connect your servers and deploy websites, applications, and databases from one fast control plane.*
- Avoid: runtime vendors, internal architecture names, “centralized control surface”, “flexible deployment options to suit different use cases”, and “dockerized applications” in the first screen.

Keep architecture detail after the lead. Use **TurboPanel High Availability** (never bare “HA”) in user-facing copy, position it as the easiest default, and keep self-hosted secondary.

## Docs home layout (`/docs`)

One composition after the lead — do not stack marketing-style feature lists, comparison tables, repo tables, and “external resources” on the landing page.

1. **H1 + lead** — Plus Jakarta title, muted lead
2. **Path cards** — four destinations max (`Cards`), even 2×2 grid
3. **Control plane** — short prose + `ControlPlaneOptions` (two columns under a hairline, not dual gradient cards or markdown tables)
4. **Source** — one short paragraph with links; repo inventory belongs in [Development architecture](/docs/architecture/development-architecture)

No entrance animations. Search stays in the sidebar. Theme toggle stays in site chrome only (`themeSwitch.enabled: false` in docs layout).

## Tokens

Reuse `--tp-*` for article H1, lead, card surfaces, and link accent. Do not invent a second docs palette.
