import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

// Marketing + docs are SSG. Serve prerendered HTML from Workers Static Assets
// (free, unlimited) and skip loading Next.js page JS on cache hits.
// No R2 / KV / D1 / DO queue needed unless we add ISR or on-demand revalidation.
// See https://opennext.js.org/cloudflare/caching#ssg-site
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})
