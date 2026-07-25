/**
 * Canonical marketing-host → TurboPanel High Availability control-plane mapping.
 *
 * Keep `wrangler.jsonc` `vars.API_HOSTNAMES` aligned with
 * {@link WRANGLER_API_HOSTNAMES} (validated by `scripts/check-control-plane-hosts.mjs`).
 */

/** Website host → control-plane origin (client-side / when Wrangler vars are absent). */
export const WEBSITE_HOST_TO_CONTROL_PLANE: Readonly<Record<string, string>> = {
  'turbopanel.io': 'https://turbopanel.app',
  'www.turbopanel.io': 'https://turbopanel.app',
  'testing.turbopanel.io': 'https://testing.turbopanel.dev',
  'staging.turbopanel.io': 'https://staging.turbopanel.dev',
}

/**
 * Expected Wrangler `API_HOSTNAMES` CSV per named environment.
 * Format: `hostname[,port],Label` pairs — first host is the primary control plane.
 */
export const WRANGLER_API_HOSTNAMES: Readonly<Record<string, string>> = {
  development: 'localhost:8443,Local Dev',
  testing: 'testing.turbopanel.dev,Testing API',
  staging: 'staging.turbopanel.dev,Staging API',
  live: 'turbopanel.app,Production API',
}
