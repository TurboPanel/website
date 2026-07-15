'use client'

import { useEffect, useId, useState } from 'react'
import { useTheme } from 'next-themes'

export function Mermaid({ chart }: Readonly<{ chart: string }>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return <MermaidContent chart={chart} />
}

function MermaidContent({ chart }: Readonly<{ chart: string }>) {
  const id = useId()
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function renderChart() {
      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily: 'inherit',
          themeCSS: 'margin: 1.5rem auto 0;',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        })

        const { svg: rendered, bindFunctions } = await mermaid.render(
          id.replaceAll(':', ''),
          chart.replaceAll(String.raw`\n`, '\n'),
        )

        if (cancelled) return
        setError(null)
        setSvg(rendered)

        requestAnimationFrame(() => {
          const container = document.getElementById(id)
          if (container) bindFunctions?.(container)
        })
      } catch (err) {
        if (cancelled) return
        setSvg(null)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    void renderChart()
    return () => {
      cancelled = true
    }
  }, [chart, id, resolvedTheme])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
        {error}
      </pre>
    )
  }

  if (!svg) return <div aria-hidden className="my-6 h-48 animate-pulse rounded-lg bg-fd-muted" />

  return (
    <div
      id={id}
      className="my-6 overflow-x-auto [&_svg]:mx-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
