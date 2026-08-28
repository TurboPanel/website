import defaultMdxComponents from 'fumadocs-ui/mdx'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import * as AccordionComponents from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { CodeGroup } from '@/components/mdx/CodeGroup'
import { ControlPlaneOptions } from '@/components/mdx/ControlPlaneOptions'
import { File } from '@/components/mdx/File'
import { Mermaid } from '@/components/mdx/Mermaid'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'

/**
 * Human labels for the `language-*` class Shiki leaves on the inner `<code>`
 * (enabled via `rehypeCodeOptions.addLanguageClass` in `source.config.ts`).
 *
 * The label becomes the code block's `title`, which makes Fumadocs render a
 * header bar instead of a bare slab — so a reader can tell a shell transcript
 * from a config file at a glance, and the copy button moves out of the code.
 */
const LANGUAGE_LABELS: Readonly<Record<string, string>> = {
  bash: 'Terminal',
  sh: 'Terminal',
  shell: 'Terminal',
  zsh: 'Terminal',
  console: 'Terminal',
  ts: 'TypeScript',
  tsx: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
  json: 'JSON',
  jsonc: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  ini: 'INI',
  sql: 'SQL',
  python: 'Python',
  py: 'Python',
  go: 'Go',
  rust: 'Rust',
  http: 'HTTP',
  html: 'HTML',
  css: 'CSS',
  diff: 'Diff',
  text: 'Text',
  txt: 'Text',
}

/** Reads `language-<lang>` off the `<code>` element Shiki nests inside `<pre>`. */
function codeBlockLabel(children: ReactNode): string | undefined {
  const code = children as ReactElement<{ className?: string }> | undefined
  const className = code?.props?.className
  if (typeof className !== 'string') return undefined

  const language = /language-([\w-]+)/.exec(className)?.[1]
  if (!language) return undefined

  return LANGUAGE_LABELS[language] ?? language.toUpperCase()
}

function CodeBlockWithLanguage({ title, children, ...props }: ComponentProps<'pre'>) {
  return (
    <CodeBlock {...props} title={title ?? codeBlockLabel(children)}>
      <Pre>{children}</Pre>
    </CodeBlock>
  )
}

function baseComponents(): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...AccordionComponents,
    pre: CodeBlockWithLanguage,
    Callout,
    Card,
    Cards,
    Steps,
    Step,
    CodeGroup,
    ControlPlaneOptions,
    File,
    Mermaid,
  }
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...baseComponents(),
    ...components,
  }
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return getMDXComponents(components)
}
