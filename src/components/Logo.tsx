/** Website logo. Plain HTML/Tailwind to avoid Tamagui dependency. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2" aria-hidden>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--tp-accent)] text-[11px] font-bold tracking-wide text-[var(--tp-accent-contrast)]">
        TP
      </span>
      <span className="text-base font-semibold tracking-tight text-[var(--tp-text)] sm:text-lg">
        TurboPanel
      </span>
    </span>
  )
}
