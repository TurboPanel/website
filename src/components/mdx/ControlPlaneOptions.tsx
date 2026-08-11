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
          Planned default when TurboPanel operates the control plane worldwide. Private alpha — not
          yet publicly available;{' '}
          <a href="https://turbopanel.io/sign-up" className="text-[var(--tp-accent)] hover:underline">
            join the waitlist
          </a>{' '}
          for access updates.
        </p>
      </div>
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tp-blue)]">
          Self-hosted
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
          Run the control plane on infrastructure you operate. Same product experience — your team owns
          uptime, upgrades, backups, and public access. Private alpha — preview docs only until a public
          release.
        </p>
      </div>
    </div>
  )
}
