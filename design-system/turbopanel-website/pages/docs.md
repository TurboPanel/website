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

## Article typography

Fumadocs' `prose` layer (via `DocsBody`) is the baseline; the TurboPanel treatment sits on top of it in
`src/app/globals.css` under `#nd-page .prose`. The goal is *approachable but professional* — a reader should be able
to tell, at a glance and without reading, what kind of thing they are looking at.

| Element | Treatment |
| --- | --- |
| H1 | Plus Jakarta 600, `clamp(2rem, …, 2.5rem)`, tracking `-0.03em` |
| Lead (first `<p>`) | `1.0625rem`, muted, `2rem` bottom margin |
| H2 | `1.5rem` 600 with a **top hairline rule** — this is what turns a long page into scannable chapters |
| H3 / H4 | `1.1875rem` / `1rem`, 600, no rule |
| Tables | Bordered rounded container owns the frame; uppercase header band on `--tp-surface-muted`, horizontal row rules, zebra rows, full-contrast first column. No vertical grid lines. `8.5rem` column floor so wide tables scroll instead of collapsing to one word per line |
| Code blocks | Recessed `--tp-surface-muted` surface (not a white card) with a mono uppercase header bar naming the language |
| Inline code | Blue-tinted chip with a hairline border; plain and borderless inside table cells |
| Blockquote | A card — surface fill, brand-blue leading rule, upright (not italic), no quote glyphs |
| Diagrams | Framed on `--tp-surface` with an optional centered caption |
| Callouts | Hairline border, no `shadow-md` |

Anti-patterns: unstyled headings that match body weight, tables without a header band, code blocks that differ from
prose only by font, and glass/blur on any dense surface.

## Tokens

Reuse `--tp-*` for article H1, lead, card surfaces, and link accent. Do not invent a second docs palette.
