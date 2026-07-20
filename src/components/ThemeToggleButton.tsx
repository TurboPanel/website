'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@/components/icons'

type ThemeToggleButtonProps = Readonly<{
  compact?: boolean
}>

function thumbTranslateClass(isDark: boolean, compact: boolean) {
  if (!isDark) return 'translate-x-0 bg-white text-amber-500 ring-black/5'
  if (compact) return 'translate-x-[1.15rem] bg-slate-800 text-sky-300 ring-sky-400/20'
  return 'translate-x-[1.4rem] bg-slate-800 text-sky-300 ring-sky-400/20'
}

export function ThemeToggleButton({ compact = false }: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const iconClass = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative inline-flex shrink-0 items-center rounded-full border p-0.5 transition-[background-color,border-color,box-shadow,width,height] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tp-bg)] motion-reduce:transition-none ${
        compact ? 'h-7 w-11' : 'h-9 w-14'
      } ${
        isDark
          ? 'border-sky-400/30 bg-slate-950 shadow-[inset_0_0_12px_rgba(56,189,248,0.12)]'
          : 'border-[var(--tp-border)] bg-[var(--tp-surface-muted)]'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`pointer-events-none grid place-items-center rounded-full shadow-md ring-1 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          compact ? 'h-5 w-5' : 'h-7 w-7'
        } ${thumbTranslateClass(isDark, compact)}`}
      >
        {isDark ? <MoonIcon className={iconClass} /> : <SunIcon className={iconClass} />}
      </span>
    </button>
  )
}
