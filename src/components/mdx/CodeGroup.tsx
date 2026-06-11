'use client'

import { Tabs, Tab } from 'fumadocs-ui/components/tabs'
import type { ReactNode } from 'react'

interface CodeGroupProps {
  children: ReactNode
  titles?: string[]
}

export function CodeGroup({ children, titles = [] }: CodeGroupProps) {
  const items = Array.isArray(children) ? children : [children]
  const tabLabels = items.map((_, i) => titles[i] ?? `Code ${i + 1}`)

  return (
    <Tabs items={tabLabels}>
      {items.map((item, i) => (
        <Tab key={i}>{item}</Tab>
      ))}
    </Tabs>
  )
}
