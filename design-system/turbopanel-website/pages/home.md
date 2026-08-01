# Home Page Overrides

> **PROJECT:** TurboPanel Website  
> Overrides `design-system/turbopanel-website/MASTER.md` for `/` only.

---

## Pattern

**Minimal Single Column + Hero-Centric** (ui-ux-pro-max landing / style):

1. Hero — plain-language product promise + price + one closing CTA (above the fold)
2. Platform benefits — what operators get (not infrastructure jargon)
3. Suggested setups teaser → `/setups` (HA, VPN, tunnels/edge)
4. Product surface + pricing band → final close

## Hero (commercial, always closing)

| Element | Rule |
|---------|------|
| Background | **No canvas grid** — `plainBackground` solid `--tp-bg` + soft brand wash only |
| Brand | Eyebrow is **TurboPanel** (product name is the first signal) |
| Headline | The outcome in plain English — one fast control plane for every server |
| Support | One short sentence: fast worldwide, always on, websites + apps + databases |
| Benefits | ≤3 check lines; operator outcomes, not Workers / JWT / Compose jargon |
| Price | **Above the fold** — omit dollar amounts during private early access; link `/pricing` |
| CTA | **One** primary close (`Get started now` → sign-up) + optional text link to pricing |
| Aside | No terminal / API mock on home — too techy for the first sell |

### Do not (home hero)

- ❌ Multiple button CTAs (“Read the architecture”, “Pricing”, “Self-hosted” as buttons)
- ❌ Gridline canvas showing through the first viewport
- ❌ Infrastructure stack language (Workers, Hyperdrive, daemon WSS, Ed25519, etc.)
- ❌ Pulsing more than one CTA

## Copy north star

Sell three promises repeatedly: **simple to start**, **fast worldwide**, and **affordable to grow**. TurboPanel High Availability is the default convenience path; **self-hosted is a first-class open-source option** with the same product — operators own infrastructure, uptime, and upgrades. Price and a single close belong in the first viewport. Never name the hosted or self-hosted runtime vendors on the home page.
