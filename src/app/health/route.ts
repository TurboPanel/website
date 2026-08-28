import { NextResponse } from 'next/server'

/**
 * Minimal health endpoint for readiness probes (systemd / converge health checks).
 * Returns 200 when the Next.js server is up.
 */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
