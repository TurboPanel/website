import { NextResponse } from 'next/server'

/**
 * Minimal health endpoint for Tilt readiness probes.
 * Returns 200 when the Next.js server is up.
 */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
