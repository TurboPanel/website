'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useClientMounted } from '@/lib/use-client-mounted'

/**
 * Client-side Mermaid diagrams, lazy-loaded when near the viewport.
 *
 * Build-time SVG rendering (e.g. in `source.config.ts`) is not used yet: docs
 * support light/dark themes via `next-themes`, and a single static SVG cannot
 * follow theme changes without shipping two renders or a heavy post-process.
 * Tradeoff: diagram pages still download the Mermaid chunk (~hundreds of KB),
 * but only after the diagram approaches the viewport — other docs JS stays
 * smaller and above-the-fold content paints without waiting on Mermaid.
 */
export function Mermaid({ chart }: Readonly<{ chart: string }>) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setNearViewport(true))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef}>
      {nearViewport ? (
        <MermaidContent chart={chart} />
      ) : (
        <div aria-hidden className="my-6 h-48 animate-pulse rounded-lg bg-fd-muted" />
      )}
    </div>
  )
}

function MermaidContent({ chart }: Readonly<{ chart: string }>) {
  const id = useId()
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const themeReady = useClientMounted()

  useEffect(() => {
    if (!themeReady) return

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
  }, [chart, id, resolvedTheme, themeReady])

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
