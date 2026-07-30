# Setups Page Overrides

> **PROJECT:** TurboPanel Website  
> Overrides `design-system/turbopanel-website/MASTER.md` for `/setups` only.

---

## Pattern

**Vertical scenario list** (not a card grid, not a wizard stepper):

1. Hero — what “suggested setups” means + one HA CTA
2. Numbered scenarios (01–04) in reading order — recommended first
3. Closing band — start on TurboPanel High Availability

## Content rules

| Element | Rule |
|---------|------|
| First scenario | Always **TurboPanel High Availability** (hosted control plane) |
| Tone | Simple and outcome-led: VPN, tunnel, edge, datacenter — avoid vendor and runtime jargon |
| Layout | Sequential sections with mono index (`01`…) and hairline dividers |
| Cards | Avoid card soup; one accent callout only on the recommended setup |
| CTA | At most **one** pulsing primary CTA (hero) |

## Do not

- ❌ Horizontal stepper / “choose your adventure” wizard chrome
- ❌ Identical feature-card grid for every scenario
- ❌ Implying every server needs a public IP for VPN or HTTP
- ❌ Naming the tunnel provider or control-plane runtimes in marketing copy
