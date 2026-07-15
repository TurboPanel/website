'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

type ThemeToggleButtonProps = Readonly<{
  compact?: boolean
}>

export function ThemeToggleButton({ compact = false }: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'
  let label = 'Theme'
  if (mounted) {
    label = isDark ? 'Dark' : 'Light'
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex items-center justify-center rounded-md border border-[var(--tp-border)] bg-[var(--tp-surface)] font-medium text-[var(--tp-text)] transition-colors hover:bg-[var(--tp-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] ${compact ? 'h-9 px-3 text-xs' : 'h-10 px-3.5 text-sm'}`}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      {label}
    </button>
  )
}
