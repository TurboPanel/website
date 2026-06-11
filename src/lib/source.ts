import { docs } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'

type DocsCollection = { toFumadocsSource: () => Parameters<typeof loader>[0]['source'] }
export const source = loader({
  baseUrl: '/docs',
  source: (docs as DocsCollection).toFumadocsSource(),
})
