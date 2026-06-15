export const DOCS_GITHUB = {
  owner: 'turbopanel',
  repo: 'turbopanel-website',
  sha: 'trunk',
} as const

export function docsGithubBlobUrl(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `https://github.com/${DOCS_GITHUB.owner}/${DOCS_GITHUB.repo}/blob/${DOCS_GITHUB.sha}/${normalized}`
}
