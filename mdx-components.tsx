import defaultMdxComponents from 'fumadocs-ui/mdx'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import * as AccordionComponents from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { CodeGroup } from '@/components/mdx/CodeGroup'
import { ControlPlaneOptions } from '@/components/mdx/ControlPlaneOptions'
import { File } from '@/components/mdx/File'
import { Mermaid } from '@/components/mdx/Mermaid'
import type { MDXComponents } from 'mdx/types'

function baseComponents(): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...AccordionComponents,
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
