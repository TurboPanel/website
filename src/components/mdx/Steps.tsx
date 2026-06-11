'use client'

import type { ReactNode } from 'react'

interface StepsProps {
  children: ReactNode
  className?: string
}

export function Steps({ children, className = '' }: StepsProps) {
  return (
    <ol
      className={`fd-steps list-none pl-0 space-y-4 [counter-reset:step] ${className}`}
      style={
        {
          '--step-gap': '1rem',
        } as React.CSSProperties
      }
    >
      {children}
    </ol>
  )
}

interface StepProps {
  children: ReactNode
  className?: string
}

export function Step({ children, className = '' }: StepProps) {
  return (
    <li
      className={`fd-step flex gap-4 [counter-increment:step] before:content-[counter(step)] before:flex before:shrink-0 before:size-8 before:items-center before:justify-center before:rounded-full before:bg-fd-accent before:text-fd-foreground before:font-medium before:text-sm ${className}`}
    >
      <span className="flex-1 min-w-0">{children}</span>
    </li>
  )
}
