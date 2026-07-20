/** Website logo. Plain HTML/Tailwind to avoid Tamagui dependency. */

type LogoProps = Readonly<{
  compact?: boolean
}>

export function Logo({ compact = false }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center transition-[gap] duration-200 ease-out motion-reduce:transition-none ${
        compact ? 'gap-1.5' : 'gap-2'
      }`}
      aria-hidden
    >
      <span
        className={`grid place-items-center rounded-md bg-[var(--tp-accent)] font-bold tracking-wide text-[var(--tp-accent-contrast)] transition-[width,height,font-size] duration-200 ease-out motion-reduce:transition-none ${
          compact ? 'h-5 w-5 text-[9px]' : 'h-7 w-7 text-[11px]'
        }`}
      >
        TP
      </span>
      <span
        className={`font-semibold tracking-tight text-[var(--tp-text)] transition-[font-size] duration-200 ease-out motion-reduce:transition-none ${
          compact ? 'text-sm' : 'text-base sm:text-lg'
        }`}
      >
        TurboPanel
      </span>
    </span>
  )
}
