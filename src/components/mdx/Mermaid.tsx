'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useClientMounted } from '@/lib/use-client-mounted'

const DIAGRAM_PLACEHOLDER_CLASS =
  'my-6 h-48 rounded-lg bg-fd-muted motion-safe:animate-pulse motion-reduce:animate-none'

type MermaidProps = Readonly<{
  chart: string
  title?: string
  ariaLabel?: string
}>

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
export function Mermaid({ chart, title, ariaLabel }: MermaidProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const accessibleName = resolveAccessibleName(title, ariaLabel)
  const deferredMessage = accessibleName
    ? `${accessibleName} — diagram will load when scrolled into view`
    : 'Diagram will load when scrolled into view'

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
        <MermaidContent chart={chart} title={title} ariaLabel={ariaLabel} />
      ) : (
        <>
          <span className="sr-only">{deferredMessage}</span>
          <div aria-hidden className={DIAGRAM_PLACEHOLDER_CLASS} />
        </>
      )}
    </div>
  )
}

function MermaidContent({
  chart,
  title,
  ariaLabel,
}: Readonly<{ chart: string; title?: string; ariaLabel?: string }>) {
  const id = useId()
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const themeReady = useClientMounted()
  const accessibleName = resolveAccessibleName(title, ariaLabel)

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

        const { svg: rendered } = await mermaid.render(
          id.replaceAll(':', ''),
          chart.replaceAll(String.raw`\n`, '\n'),
        )

        if (cancelled) return
        setError(null)
        setSvg(rendered)
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
      <figure className="my-6">
        <div
          role="alert"
          className="overflow-x-auto rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400"
        >
          <p className="font-medium">
            {accessibleName ? `${accessibleName} could not be rendered` : 'Diagram could not be rendered'}
          </p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{error}</pre>
        </div>
      </figure>
    )
  }

  if (!svg) {
    return (
      <DiagramPlaceholder
        status={accessibleName ? `${accessibleName} — loading diagram` : 'Loading diagram'}
      />
    )
  }

  return (
    <figure className="my-6">
      <div className="overflow-x-auto">
        <img
          id={id}
          src={svgToDataUrl(svg)}
          alt={accessibleName ?? 'Diagram'}
          className="mx-auto"
        />
      </div>
    </figure>
  )
}

function DiagramPlaceholder({ status }: Readonly<{ status: string }>) {
  return (
    <div
      className={DIAGRAM_PLACEHOLDER_CLASS}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{status}</span>
    </div>
  )
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function resolveAccessibleName(title?: string, ariaLabel?: string): string | undefined {
  const label = ariaLabel?.trim()
  if (label) return label
  const namedTitle = title?.trim()
  if (namedTitle) return namedTitle
  return undefined
}
