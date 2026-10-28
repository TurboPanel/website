# App Router (`src/app/`) — AGENTS.md

Repo context: `../../AGENTS.md`.

## Pricing (copy source of truth, continued)

The maturity label and the both-offerings rule are in the root `AGENTS.md`.

Marketing and docs **must** match live product pages. Canonical public page: **https://turbopanel.io/pricing**.

| Surface | Presentation |
| --- | --- |
| **TurboPanel High Availability** | **Private alpha · Not yet available** — no dollar figures on marketing pages; no waitlist or sign-up CTA (there is no waiting list); never "request access now" / "get started now" phrasing |
| **Self-hosted control plane** | **Private alpha · Not yet available** — planned to be **free, unlimited servers** once it ships; CTA is **`Preview self-hosted docs`** (`/docs/deployment/self-hosted`), not "install now" / "self-host today" phrasing |

**Exception — the tier ladder:** the S1–S7/SX per-server **price ladder** (`$X.XX` per tier plus the hard-floor / recommended placement rules) may appear on `/pricing` as *planned* pricing for TurboPanel High Availability. This is the one place dollar figures are permitted on a marketing page. It does not change maturity status or the CTA: the card and the tier table keep the **Private alpha · Not yet available** label, there is still no waitlist or sign-up CTA, and no copy next to the table may imply a purchase path ("Buy now", "Subscribe", "Choose S3", "Start on S1"). The ladder is informational; `/pricing` is not a checkout. The ladder never applies to self-hosted — that card stays "Free, unlimited servers" with no dollar figures. Canonical ladder values (cores/RAM ceilings, prices, slot entitlements) come from the control-plane repo (`turbopanel/src/features/tiers/ladder.ts`, the one matrix the placement bands and the billing catalogue both read); the page override is `design-system/turbopanel-website/pages/pricing.md`; the operator-facing explanation is [`docs/deployment/tiers.mdx`](../../docs/deployment/tiers.mdx).

Do not reintroduce `$X` placeholders or pay-X-get-X copy on `src/app/**` outside the tier ladder above. Do not use CTA copy that implies either path is usable today (e.g. "Get started now", "Request early access", "Start on TurboPanel High Availability", "Install self-hosted") — use private-alpha / preview-docs language instead, and do not add a waitlist (there isn't one). On the roadmap, the internal `Complete` phase status maps to the public label **Built**, not "Shipped" (see `design-system/turbopanel-website/pages/roadmap.md`) — no status label should imply a public release has happened yet.

## Marketing routes (App Router)

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Home |
| `/setups` | `src/app/setups/page.tsx` | Architecture patterns (single server → unlimited mesh); nav label "Patterns" |
| `/pricing` | `src/app/pricing/page.tsx` | Managed vs self-hosted positioning + the planned S1–S7/SX tier ladder |
| `/roadmap` | `src/app/roadmap/page.tsx` | Product phases (vertical timeline) |
| `/open-source` | `src/app/open-source/page.tsx` | License table (incl. per-release third-party notices), repo map, third-party marks, FAQ |
| `/security` | `src/app/security/page.tsx` | Supported versions, private reporting |
| `/changelog` | `src/app/changelog/page.tsx` | Human-written release highlights |
| `/about/logo` | `src/app/about/logo/page.tsx` | Brand guidelines |

Register new marketing routes in `SiteHeader` (`ActivePage` + `LINKS` when nav-visible — `LINKS` also feeds the mobile `MobileNavMenu` panel), `SiteFooter` (`FOOTER_LINKS`), and `src/app/sitemap.ts`.

Screenshots for READMEs: `public/screenshots/` (served at `https://turbopanel.io/screenshots/…`). Social preview sources: `public/brand/social/` (the five `*-og.svg` cards). They carry the T mark and the Figtree wordmark as outlined paths, not live text, because share platforms do not load web fonts; the outlines use the header lockup geometry from `src/lib/wordmark-lockup.ts` (31 px word, +0.02 em spacing, −14° skew, lowest ink on the base of the T; the light website card also carries the 0.025 em outline, drawn as a 0.775 stroke in lockup units), so redraw them when those constants change.
