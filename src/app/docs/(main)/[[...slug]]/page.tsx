import type { ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'
import { getMDXComponents } from '../../../../../mdx-components'
import { DOCS_GITHUB } from '@/lib/docs-github'
import { source } from '@/lib/source'
import { DocsBody, DocsPage } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

type PageData = {
  title: string
  description: string
  body: ComponentType<{ components?: MDXComponents }>
  toc: unknown
  lastModified?: Date
  info?: { path: string }
}

type DocsPageProps = Readonly<{
  params: Promise<{ slug?: string[] }>
}>

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: DocsPageProps) {
  const { slug } = await params
  const page = source.getPage(slug ?? [])
  if (!page) return {}
  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function Page({ params }: DocsPageProps) {
  const { slug } = await params
  const page = source.getPage(slug ?? [])
  if (!page) notFound()

  const data = page.data as PageData
  const MdxBody = data.body

  return (
    <DocsPage
      toc={data.toc as import('fumadocs-ui/page').DocsPageProps['toc']}
      lastUpdate={data.lastModified}
      breadcrumb={{
        includeSeparator: true,
        includeRoot: true,
      }}
      editOnGithub={{
        owner: DOCS_GITHUB.owner,
        repo: DOCS_GITHUB.repo,
        sha: DOCS_GITHUB.sha,
        path: `docs/${data.info?.path ?? page.path}`,
      }}
    >
      {/*
        `DocsBody` is what applies Fumadocs' `prose` typography layer. Without
        it the MDX rendered as unstyled HTML — headings collapsed to 16px/400,
        tables lost every border and cell padding, and paragraphs had no
        margins, which is what made the docs read as one flat wall of text.
      */}
      <DocsBody>
        <MdxBody components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}
