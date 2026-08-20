import { describe, expect, it } from 'vitest'
import { DOCS_GITHUB, docsGithubBlobUrl } from '@/lib/docs-github'

describe('docsGithubBlobUrl', () => {
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
})
