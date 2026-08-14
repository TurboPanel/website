# Setups Page Overrides

> **PROJECT:** TurboPanel Website  
> Overrides `design-system/turbopanel-website/MASTER.md` for `/setups` only.

---

## Pattern

**Vertical scenario list with a diagram per pattern** (not a card grid, not a wizard stepper):

1. Hero — one footprint-agnostic pitch + one HA CTA
2. Intro line — every pattern below runs the identical TurboPanel console
3. Numbered architecture patterns (01–04), each with a hand-drawn topology
   diagram (`components/marketing/setups/setup-diagrams.tsx`) alternating
   sides left/right, plus a closing **N — Unlimited** pattern styled as a
   dashed-border "anything goes" card
4. Closing band — join the waitlist for TurboPanel High Availability

## Content rules

| Element | Rule |
|---------|------|
| Framing | Every pattern is achievable on **either** TurboPanel High Availability or the self-hosted control plane — do not brand a pattern by runtime/hosting choice, and do not use the words "self-hosted" or "High Availability" as a pattern name or distinguishing feature. Those terms may only appear inside CTA button copy. Both paths are currently private alpha and not yet publicly available — CTAs read "Join the waitlist," never "Start on..." |
| Patterns are physical topology, not hosting choice | 01 single server → 02 multi-server mesh in one datacenter (+ managed DB replica for failover) → 03 frontend/backend split across two datacenters → 04 encrypted site-to-site mesh with regional read replicas and a redundant write primary → N unlimited/custom |
| Tone | Confident, high-tech, a little fun — "funky and fresh," not corporate-bland. Short punchy taglines per pattern are encouraged. Avoid vendor/runtime jargon (no "Workers," "Deno," "Durable Object," etc.) |
| Diagrams | Each numbered pattern gets a decorative topology SVG in a `tp-card` with a Compute (blue) / Data (green) legend — static, no animation, `aria-hidden` |
| Layout | Sequential sections with mono index (`01`…, `N`), alternating diagram side (`reverse` prop) for visual rhythm; hairline dividers between patterns |
| Unlimited pattern | Styled distinctly (dashed accent border, centered copy, its own freeform/scattered diagram) to signal "this one breaks the pattern on purpose" |
| CTA | At most **one** pulsing primary CTA (hero); later CTAs reuse the same "Join the waitlist" label at `emphasis={false}` |

## Do not

- ❌ Naming or grouping setups by "self-hosted" vs "TurboPanel High Availability" — every pattern works on both
- ❌ Horizontal stepper / "choose your adventure" wizard chrome
- ❌ Identical feature-card grid for every scenario
- ❌ Implying every server needs a public IP for the private-mesh or split-region patterns
- ❌ Overstating unshipped capability — read replicas and site-to-site mesh are real, shipped primitives (managed cluster members + promote, TurboFabric); phrase copy at the "what you can build" level, not as a literal 1:1 feature checklist
