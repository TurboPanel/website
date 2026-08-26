import { describe, expect, it } from 'vitest'
import {
  DOCS_SSR_INTRODUCTION_SNIPPET,
  DOCS_SSR_LAYOUT_MARKER,
  DOCS_SSR_LAYOUT_WINDOW_CHARS,
  DOCS_SSR_LOADING_SHELL,
  docsSsrFailureMessage,
  evaluateDocsSsrHtml,
} from '@/lib/docs-ssr'

function layoutHtml(inner: string): string {
  return `<main ${DOCS_SSR_LAYOUT_MARKER}>${inner}</main>`
}

describe('evaluateDocsSsrHtml', () => {
  it('accepts HTML that includes the article snippet inside the docs layout', () => {
    const html = layoutHtml(`<p>${DOCS_SSR_INTRODUCTION_SNIPPET}</p>`)
    expect(evaluateDocsSsrHtml(html)).toEqual({ ok: true })
  })

  it('rejects HTML with no article body', () => {
    expect(evaluateDocsSsrHtml(layoutHtml(`<p>${DOCS_SSR_LOADING_SHELL}</p>`))).toEqual({
      ok: false,
      reason: 'missing_body',
    })
  })

  it('rejects HTML that has the body but no docs layout root', () => {
    expect(evaluateDocsSsrHtml(`<article>${DOCS_SSR_INTRODUCTION_SNIPPET}</article>`)).toEqual({
      ok: false,
      reason: 'missing_layout',
    })
  })

  it('rejects a layout window that is still the loading shell', () => {
    const padding = 'x'.repeat(DOCS_SSR_LAYOUT_WINDOW_CHARS)
    const html = `${DOCS_SSR_INTRODUCTION_SNIPPET}${padding}${layoutHtml(
      `<p>${DOCS_SSR_LOADING_SHELL}</p>`,
    )}`
    expect(evaluateDocsSsrHtml(html)).toEqual({
      ok: false,
      reason: 'loading_shell',
    })
  })

  it('accepts a layout that contains both the loading marker and the snippet', () => {
    const html = layoutHtml(
      `<p>${DOCS_SSR_LOADING_SHELL}</p><p>${DOCS_SSR_INTRODUCTION_SNIPPET}</p>`,
    )
    expect(evaluateDocsSsrHtml(html)).toEqual({ ok: true })
  })
})

describe('docsSsrFailureMessage', () => {
  it('maps each failure reason to the CLI error line', () => {
    expect(docsSsrFailureMessage('missing_body')).toContain('missing visible page body')
    expect(docsSsrFailureMessage('missing_layout')).toContain('#nd-docs-layout')
    expect(docsSsrFailureMessage('loading_shell')).toContain(DOCS_SSR_LOADING_SHELL)
  })
})
