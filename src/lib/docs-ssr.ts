/**
 * Built-docs HTML checks used by `scripts/check-docs-ssr.mjs`.
 *
 * The CLI reads `.next/server/app/docs/getting-started/introduction.html`
 * after `pnpm build`; this module decides whether that HTML still contains
 * the article body instead of only the client "Loading…" shell.
 */

export const DOCS_SSR_INTRODUCTION_SNIPPET =
  'TurboPanel gives you one simple place to deploy websites, applications, and databases'

export const DOCS_SSR_LAYOUT_MARKER = 'id="nd-docs-layout"'

export const DOCS_SSR_LAYOUT_WINDOW_CHARS = 800

export const DOCS_SSR_LOADING_SHELL = 'Loading…'

export type DocsSsrFailureReason = 'missing_body' | 'missing_layout' | 'loading_shell'

export type DocsSsrCheckResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: DocsSsrFailureReason }>

export function evaluateDocsSsrHtml(html: string): DocsSsrCheckResult {
  if (!html.includes(DOCS_SSR_INTRODUCTION_SNIPPET)) {
    return { ok: false, reason: 'missing_body' }
  }

  const layoutIdx = html.indexOf(DOCS_SSR_LAYOUT_MARKER)
  if (layoutIdx === -1) {
    return { ok: false, reason: 'missing_layout' }
  }

  const layoutWindow = html.slice(layoutIdx, layoutIdx + DOCS_SSR_LAYOUT_WINDOW_CHARS)
  if (
    layoutWindow.includes(DOCS_SSR_LOADING_SHELL) &&
    !layoutWindow.includes(DOCS_SSR_INTRODUCTION_SNIPPET)
  ) {
    return { ok: false, reason: 'loading_shell' }
  }

  return { ok: true }
}

export function docsSsrFailureMessage(reason: DocsSsrFailureReason): string {
  if (reason === 'missing_body') {
    return 'check-docs-ssr: introduction HTML is missing visible page body content'
  }
  if (reason === 'missing_layout') {
    return 'check-docs-ssr: docs layout root (#nd-docs-layout) not found'
  }
  return 'check-docs-ssr: docs layout still renders only the Loading… shell in initial HTML'
}
