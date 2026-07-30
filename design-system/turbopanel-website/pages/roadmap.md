# Roadmap Page Overrides

> **PROJECT:** TurboPanel Website  
> Overrides `design-system/turbopanel-website/MASTER.md` for `/roadmap` only.

---

## Pattern

**Real-Time / Operations landing** (ui-ux-pro-max), adapted for a product roadmap:

1. Hero — product signal + honest promise (what shipped / what’s next)
2. Status strip — three metrics (shipped / building / ahead), not a wizard stepper
3. Now building — featured current phase (one job)
4. Timeline — vertical editorial list of all phases
5. CTA — docs + pricing

## Layout

- **No horizontal phase rail / stepper** — reads as form UX, not product narrative
- Max width stays `max-w-6xl`
- Timeline spine on the left; content to the right
- Current phase gets a single featured panel above the full timeline (not a third card grid of the same content)

## Status language

| Internal | User-facing |
|----------|-------------|
| Complete | Shipped |
| In Progress | Building now |
| Planned | Next up |
| Future | Later |

Status always pairs color with a text label (never color alone).

## Typography

- Hero title: display font, tight tracking
- Phase titles: display / semibold
- Focus bullets: body muted, checkmarks in primary accent blue

## Anti-patterns (page)

- ❌ Multi-step progress circles with connecting lines
- ❌ Duplicate legend + rail + identical phase cards repeating the same story three ways
- ❌ Crowding the first viewport with stats + legend + rail + CTAs
