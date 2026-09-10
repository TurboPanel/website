import { describe, expect, it } from 'vitest'
import { DOCS_GITHUB, docsGithubBlobUrl } from '@/lib/docs-github'

describe('docsGithubBlobUrl', () => {
  it('uses the TurboPanel GitHub organization', () => {
    expect(DOCS_GITHUB.owner).toBe('TurboPanel')
    expect(DOCS_GITHUB.repo).toBe('website')
    expect(DOCS_GITHUB.sha).toBe('trunk')
  })

  it('builds trunk blob URLs under the website repo', () => {
    expect(docsGithubBlobUrl('docs/getting-started/introduction.mdx')).toBe(
      `https://github.com/${DOCS_GITHUB.owner}/${DOCS_GITHUB.repo}/blob/${DOCS_GITHUB.sha}/docs/getting-started/introduction.mdx`,
    )
  })

  it('strips a leading slash from the path', () => {
    expect(docsGithubBlobUrl('/docs/meta.json')).toBe(
      `https://github.com/${DOCS_GITHUB.owner}/${DOCS_GITHUB.repo}/blob/${DOCS_GITHUB.sha}/docs/meta.json`,
    )
  })

  it('keeps an empty path as a trailing slash-free blob URL', () => {
    expect(docsGithubBlobUrl('')).toBe(
      `https://github.com/${DOCS_GITHUB.owner}/${DOCS_GITHUB.repo}/blob/${DOCS_GITHUB.sha}/`,
    )
    expect(docsGithubBlobUrl('/')).toBe(
      `https://github.com/${DOCS_GITHUB.owner}/${DOCS_GITHUB.repo}/blob/${DOCS_GITHUB.sha}/`,
    )
  })
})
