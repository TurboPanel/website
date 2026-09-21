/**
 * Canonical marketing-host → TurboPanel High Availability control-plane mapping.
 *
 * This map is the single source of truth for every environment: the API
 * routes (`/api/config`, `/api/reference`) and the client-side helpers in
 * `src/lib/env.ts` derive the control-plane origin and the Scalar server
 * entries from the request host. There is no per-environment deploy
 * variable to keep in sync.
 */

/** Website host → control-plane origin. */
export const WEBSITE_HOST_TO_CONTROL_PLANE: Readonly<Record<string, string>> = {
  'turbopanel.io': 'https://turbopanel.app',
  'www.turbopanel.io': 'https://turbopanel.app',
  'testing.turbopanel.io': 'https://testing.turbopanel.dev',
  'staging.turbopanel.io': 'https://staging.turbopanel.dev',
}

/** Scalar server label for the local Caddy control plane (`https://localhost:<CADDY_PORT>`). */
export const LOCAL_DEV_CONTROL_PLANE_LABEL = 'Local Dev'

/** Scalar server label when a control-plane origin has no dedicated label. */
export const DEFAULT_CONTROL_PLANE_LABEL = 'API Server'

/**
 * Control-plane origin → Scalar server label.
 * Keys are the origins in {@link WEBSITE_HOST_TO_CONTROL_PLANE}.
 */
export const CONTROL_PLANE_SERVER_LABELS: Readonly<Record<string, string>> = {
  'https://turbopanel.app': 'Production API',
  'https://testing.turbopanel.dev': 'Testing API',
  'https://staging.turbopanel.dev': 'Staging API',
}

/** Scalar label for a control-plane origin (falls back to {@link DEFAULT_CONTROL_PLANE_LABEL}). */
export function controlPlaneServerLabel(origin: string): string {
  return CONTROL_PLANE_SERVER_LABELS[origin] ?? DEFAULT_CONTROL_PLANE_LABEL
}
