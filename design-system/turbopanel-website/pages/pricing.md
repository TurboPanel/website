# Pricing Page Overrides

> **PROJECT:** TurboPanel Website  
> Overrides `design-system/turbopanel-website/MASTER.md` for `/pricing` only.

---

## Pattern

**Two-plan comparison + informational tier ladder**, in this order:

1. Hero — HA slogan (*We run the panel. You run what matters.*) + one waitlist CTA
2. Plan cards — TurboPanel High Availability (green accent) beside Self-hosted (blue accent); both carry the **Private alpha · Not yet available** badge
3. **Tier ladder** — the S1–S7/SX table for TurboPanel High Availability (see below)
4. Total cost of ownership — bordered comparison table
5. Closing band — waitlist CTA + roadmap link
6. FAQ — two-column definition list

## Tier ladder (the one place with dollar figures)

The ladder is **planned pricing, not a purchase flow**. `AGENTS.md` → *Pricing (copy source of truth)* carves this table out of the "no dollar figures on marketing pages" rule and nothing else.

| Element | Rule |
|---------|------|
| Treatment | Reuses the existing bordered-table pattern from the TCO section: `rounded-2xl border border-[var(--tp-border)] bg-[var(--tp-surface)]`, `thead` on `--tp-surface-muted`, hairline `border-t` rows. **No new visual language**, no glass, no card-per-tier grid |
| Columns | Tier · Machine (the hard ceiling in cores / RAM) · Price · A recognisable machine at that size |
| Price cell | Geist Mono (`font-mono`), semibold, `--tp-text`; SX reads **Contact us**, never a number |
| Tier cell | Mono tier label (`S1`…`SX`) in `--tp-green` — the HA accent, because the ladder belongs to the HA offering only |
| Scope | Placed directly under the plan cards with an eyebrow that names **TurboPanel High Availability**. Never imply it applies to self-hosted (that card stays *Free*) |
| Badge | The section header repeats **Private alpha · Not yet available** as a chip beside the eyebrow |
| Placement rules | A two-item list beneath the table: **cores and RAM are a hard floor** (physical cores only); **NICs, drives, GPUs only raise the recommended tier** and never block access |
| CTA | None inside the section. No "Buy", "Subscribe", "Choose", or "Start on Sn" affordances anywhere near the table. The page's only CTAs remain `Join the waitlist` + secondary docs links |
| Responsive | Table scrolls horizontally inside `overflow-x-auto` below `sm`; the page body never scrolls sideways |

## Typography

- Section title: display font, tight tracking (`tp-section-title`)
- Table body: 14px, `--tp-text` for tier/machine, `--tp-text-muted` for the example column
- Prices: mono so the column aligns

## Anti-patterns (page)

- ❌ One card per tier (eight cards is a wall, and it reads as a checkout)
- ❌ A "most popular" highlight or a recommended-tier badge — placement is per machine, not a preference
- ❌ Dollar figures anywhere else on the page (hero, cards, TCO, FAQ)
- ❌ Any copy implying the ladder is purchasable today
