'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@/components/icons'
import { useClientMounted } from '@/lib/use-client-mounted'

type ThemeToggleButtonProps = Readonly<{
  compact?: boolean
}>

/**
 * Theme switch visuals are CSS-driven via Tailwind `dark:` against `html.dark`
 * (set by next-themes' blocking script before first paint). That keeps the thumb
 * in the correct position on refresh — no light→dark FOUC animation.
 *
 * `useTheme` / `mounted` only gate a11y labels; clicks read `html.dark` directly.
 */
export function ThemeToggleButton({ compact = false }: ThemeToggleButtonProps) {
  const mounted = useClientMounted()
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = mounted && resolvedTheme === 'dark'
  const iconClass = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
  const thumbShift = compact ? 'dark:translate-x-[1.15rem]' : 'dark:translate-x-[1.4rem]'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mounted ? isDark : undefined}
      onClick={() => {
        const dark = document.documentElement.classList.contains('dark')
        setTheme(dark ? 'light' : 'dark')
      }}
      className={`relative inline-flex shrink-0 items-center rounded-full border border-[var(--tp-border)] bg-[var(--tp-surface-muted)] p-0.5 transition-[background-color,border-color,box-shadow,width,height] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tp-bg)] motion-reduce:transition-none dark:border-sky-400/30 dark:bg-slate-950 dark:shadow-[inset_0_0_12px_rgba(56,189,248,0.12)] ${
        compact ? 'h-7 w-11' : 'h-9 w-14'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`pointer-events-none grid translate-x-0 place-items-center rounded-full bg-white text-amber-500 shadow-md ring-1 ring-black/5 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-slate-800 dark:text-sky-300 dark:ring-sky-400/20 ${
          compact ? 'h-5 w-5' : 'h-7 w-7'
        } ${thumbShift}`}
      >
        <SunIcon className={`${iconClass} dark:hidden`} aria-hidden />
        <MoonIcon className={`${iconClass} hidden dark:block`} aria-hidden />
      </span>
    </button>
  )
}
