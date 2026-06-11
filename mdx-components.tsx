import defaultMdxComponents from 'fumadocs-ui/mdx'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import * as AccordionComponents from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Steps, Step } from '@/components/mdx/Steps'
import { CodeGroup } from '@/components/mdx/CodeGroup'
import { File } from '@/components/mdx/File'
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
    File,
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
