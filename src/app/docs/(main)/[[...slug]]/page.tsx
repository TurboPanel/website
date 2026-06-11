import type { ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'
import { getMDXComponents } from '../../../../../mdx-components'
import { source } from '@/lib/source'
import { DocsPage } from 'fumadocs-ui/page'
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
        owner: 'turbopanel',
        repo: 'turbopanel-website',
        sha: 'trunk',
        path: `docs/${data.info?.path ?? page.path}`,
      }}
    >
      <MdxBody components={getMDXComponents()} />
    </DocsPage>
  )
}
