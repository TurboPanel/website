/**
 * Compact HA vs self-hosted note for docs — prose columns, not a comparison table.
 */
export function ControlPlaneOptions() {
  return (
    <div className="not-prose my-5 grid gap-6 border-y border-[var(--tp-border)] py-6 sm:grid-cols-2 sm:gap-8">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-green)]">
          TurboPanel High Availability
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
          The easy option. Get a fast worldwide control plane, connect your servers, and start
          shipping without running the panel yourself.
        </p>
      </div>
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-blue)]">
          Self-hosted
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
          Run the control plane on infrastructure you operate and maintain. Same product experience —
          your team owns uptime, upgrades, backups, and public access.
        </p>
      </div>
    </div>
  )
}
