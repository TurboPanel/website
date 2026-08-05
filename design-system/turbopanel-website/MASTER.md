# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/turbopanel-website/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** TurboPanel Website  
**Generated:** 2026-07-25 (curated from ui-ux-pro-max + product console brand)  
**Category:** Developer Tool / DevOps Control Plane (B2B SaaS)  
**Stack:** Next.js 16 · Tailwind · Fumadocs · OpenNext Cloudflare  
**Design Dials:** Variance 4/10 (Balanced) | Motion 2/10 (Subtle) | Density 4/10 (Spacious marketing)

---

## North Star

TurboPanel marketing should feel **fast and trustworthy** — SSG content paints instantly, one blue CTA draws the eye, no decorative entrance choreography. Dual brand with the product console (`ui/design-system/turbopanel/MASTER.md`): **blue `#3366cc`** (primary chrome / links / CTAs) + **green** (HA / live secondary). Marketing stays **light-first** for docs readability while dark mode remains fully supported.

**Style blend:** Trust & Authority + Soft UI Evolution + **Liquid glass** (restrained frosted chrome) — not cyberpunk neon, not AI purple gradients, not wizard-stepper chrome, not iridescent chromatic aberration.

---

## Global Rules

### Color Palette

Canonical marketing tokens live in `src/app/globals.css` (`--tp-*`). Do not invent parallel hex in components.

| Role | Hex | Token / Notes |
|------|-----|---------------|
| Background (light) | `#f5f7fa` | `--tp-bg` |
| Surface | `#ffffff` / `#111a2b` | `--tp-surface` (light / dark) |
| Text primary | `#0f172a` / `#e2e8f0` | `--tp-text` |
| Text muted | `#475569` / `#a8b5cc` | `--tp-text-muted` |
| Blue (primary) | `#3366cc` | `--tp-blue` / `--tp-accent` — links, CTAs, docs primary, chrome |
| Green (secondary) | `#3dd68c` | `--tp-green` — HA cards, live / run accents |
| On blue | `#ffffff` | `--tp-accent-contrast` / `--tp-blue-contrast` (≥ 4.5:1 on blue) |
| On green | `#0b1220` | `--tp-green-contrast` (≥ 4.5:1 on green) |
| Hero glow A/B | blue + green rgba | `--tp-hero-a` (blue) / `--tp-hero-b` (green) |

**Color notes:** Dual brand `#3366cc` + green. Primary chrome, links, and CTAs are blue; green is secondary (HA / live). Brand stripe is blue→green. Align hex with `ui/src/lib/theme.ts`. Status/CTA never rely on color alone when paired with labels.

### Typography

| Role | Font | Notes |
|------|------|-------|
| Display / headings | Plus Jakarta Sans (`--font-display`) | Friendly SaaS; marketing H1–H2 |
| UI / body | Geist Sans (`--font-geist-sans`) | Continuity with docs chrome |
| Mono | Geist Mono | Terminal, phase numbers, prices |

- Base ≥ 16px on interactive inputs  
- Line-height ~1.5 body; tighter for dense table rows  
- Weights: 400 body, 500 labels, 600–700 titles/buttons

### Spacing (Density 4 — marketing)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Icon gaps |
| `--space-sm` | `8px` | Inline chips |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Section padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero padding |

Content max width: `max-w-6xl` on marketing pages.

### Elevation & Radius

- Prefer hairline borders (`--tp-border`) over heavy shadows  
- Card radius: `rounded-xl` (12px); buttons: `rounded-lg` (8px)  
- Soft card shadow only when already present — do not add decorative lift animations  
- Prefer **sections and lists** over card grids when content is sequential (roadmap, FAQ)

### Liquid glass (secondary polish)

Canonical tokens in `src/app/globals.css` (`--tp-glass-*`). Utility classes: `.tp-glass`, `.tp-glass-strong`. Align with console `ui/src/lib/glass.ts`.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--tp-glass-fill` | white ~62% | navy ~72% | Cards, chips |
| `--tp-glass-fill-strong` | bg ~78% | navy ~84% | Sticky site chrome |
| `--tp-glass-border` | slate 12% | white 12% | Glass rim |
| `--tp-glass-blur` / saturate | `16px` / `160%` | same | `backdrop-filter` |

**Where to use:** sticky site chrome, `.tp-card` / `.tp-eyebrow`, interactive marketing surfaces over the grid canvas.  
**Where not:** dense docs tables, code blocks, every nested inset.  
**A11y:** `@media (prefers-reduced-transparency: reduce)` falls back to solid `--tp-surface`. Keep text contrast ≥ 4.5:1.

---

## Motion Policy (marketing)

| Interaction | Duration | Notes |
|-------------|----------|-------|
| Page / section entrance | **None** | Content must be visible on first paint (SSG advantage) |
| One hero primary CTA | Subtle box-shadow pulse (~2.5s) | Class `tp-cta-emphasis`; **one per page** |
| Hover / focus | 150–200ms | Opacity / border / background only |
| Functional chrome | Existing | Banner collapse, theme toggle, header compact, docs sidebar |
| Reduced motion | Off / instant | Honor `prefers-reduced-motion` |

**Do not:** fade-up reveals, staggered card delays, GSAP ScrollTrigger, infinite decorative loops on non-CTA elements, wizard-style progress steppers for narrative content.

---

## Component Specs

### Buttons

- **Primary:** `MarketingPrimaryCta` — `bg-[var(--tp-accent)]`, `text-[var(--tp-accent-contrast)]`, optional `emphasis` for glow  
- **Secondary:** `MarketingSecondaryCta` — bordered surface, no glow  
- Hover: opacity ~90% (primary) or muted surface (secondary); `active:scale-[0.98]` ok with reduced-motion guard  
- Focus: visible ring via `--tp-ring`

### Logo / brand mark

- Official files under **`public/brand/`** (`turbopanel-logo.svg`, square + white/mono variants, PNGs)
- Site header uses `src/components/Logo.tsx` — T mark + Plus Jakarta Sans ExtraBold Italic “urboPanel” tucked under the blue crossbar (same lockup as the console). Geometry comes from `src/lib/wordmark-lockup.ts` (`computeTurboPanelWordmarkLockup` / `websiteWordmarkLockup`). Mark SVGs are **ink-tight** (`viewBox="0 0 628 370"`); ExtraBold Italic (800) + CSS `skewX(-15deg)`; typographic baseline matches the T stem tip. The mark **is** the T — never “TurboPanel” beside it. Scrolled/compact header fades the wordmark out (`markOnly`) and keeps the T mark only; footer may stay compact with the full lockup.
- Public kit + usage rules: **`/about/logo`** (see `pages/about-logo.md`)
- Favicon is the square mark (`public/favicon.svg`)

### Marketing hero

- Eyebrow chip (`tp-eyebrow`) → H1 → description → optional benefits / price → CTA  
- Home hero: **plain background** (`plainBackground`) so the canvas grid does **not** show in the first viewport — see `pages/home.md`  
- Optional `aside` or `TerminalPreview` on inner pages (lg+); home stays copy-first (no terminal)  
- Page canvas: subtle grid (`tp-marketing-canvas`) below / outside the home hero  
- Instant paint; no opacity:0 defaults  
- Brand name / product signal must remain strong in the first viewport  
- Commercial pages: at most **one** primary CTA in the hero; prefer a text link for secondary paths

### Cards & lists

- Feature grids use `MarketingCard` / `tp-card` with hover border accent (no scale transforms)  
- Accent tier: `tp-card-accent` or `accent` prop for highlighted plan tiles  
- Sequential product narratives (roadmap phases) use a **vertical timeline**, not a multi-step rail

---

## Style Guidelines

**Primary style:** Trust & Authority + Soft UI Evolution  
**Secondary polish:** Liquid glass (frosted sticky chrome + cards)  
**Keywords:** professional, fast, ops, blue primary, green live accent, hairline borders, frosted glass, transparent pricing, editorial timeline  

**Anti-patterns:**
- ❌ Entrance fade / slide animations
- ❌ AI purple/pink gradients
- ❌ Full iridescent / chromatic-aberration liquid-glass excess
- ❌ Playful / emoji-as-icon UI
- ❌ Multiple pulsing CTAs on one page
- ❌ Layout-shifting hover scales on cards
- ❌ Wizard progress steppers for roadmap / narrative pages
- ❌ Identical card soup for every section
- ❌ Glass blur on dense docs tables / code blocks

---

## Pre-Delivery Checklist

- [ ] No entrance animations on marketing pages
- [ ] At most one `tp-cta-emphasis` CTA per page
- [ ] `prefers-reduced-motion` disables CTA pulse
- [ ] Accent / primary is `#3366cc` with white contrast text; green reserved for HA / live
- [ ] `cursor-pointer` on clickable elements
- [ ] Hover/focus transitions 150–300ms
- [ ] Light mode contrast ≥ 4.5:1
- [ ] Responsive: 375px, 768px, 1024px, 1440px
