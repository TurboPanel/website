import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

const searchAPI = createFromSource(source, {
  language: 'english',
})

export const GET = searchAPI.GET
