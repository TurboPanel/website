# Page Override: Logo & brand (`/about/logo`)

> Overrides MASTER for the public graphics / logo guidelines page.

**Route:** `/about/logo`  
**Job:** Official downloads + usage rules (WordPress-style brand kit), not a marketing feature pitch.

---

## Layout

- Hero: eyebrow **Brand**, title **Graphics & logos**, one short supporting sentence — no pulsing CTA, no terminal aside
- Sections in order: Downloads → Brand colors → Clear space & sizing / wordmark → Don't (incorrect use)
- Downloads: one block per variant (standard landscape, square); preview on light + dark swatches; download chips (SVG/PNG), not a card grid of features
- Prefer sections/lists over decorative card stacks; hairline borders only

## Assets

- Canonical static files live under **`public/brand/`** (`turbopanel-logo*`)
- Catalog for the page: `src/lib/brand-assets.ts`
- Site chrome: `src/components/Logo.tsx` → T mark + italic Plus Jakarta Sans `urboPanel` under the blue crossbar (same lockup as the console; mark is the T)
- Favicon: `public/favicon.svg` (square mark)

## Style

- Light-first marketing tokens (`--tp-*`); dual brand blue `#3366cc` (primary) + green `#3dd68c` (secondary) documented as swatches
- Instant paint; no entrance motion
- Download chips: bordered surface, hover border toward accent — interaction containers only

## Copy

- Product name: **TurboPanel** (one word) in prose; lockup wordmark letters are **urboPanel** (the T mark supplies the T)
- Do not call assets “final” — filenames use `turbopanel-logo`
- Avoid trademark legalese beyond a short “use in accordance with these guidelines” line
