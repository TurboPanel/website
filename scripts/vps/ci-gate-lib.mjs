/**
 * Decide whether a pushed commit may deploy, from its GitHub check runs.
 * `ci-gate.mjs` polls the checks API and calls this; the deploy runs only on
 * `pass`, so the VPS never builds a commit CI has not verified.
 */

/** Checks a website commit must pass before it deploys (the ruleset's required checks). */
export const REQUIRED_CHECKS = Object.freeze(['verify', 'metrics-legacy'])

/**
 * @typedef {{ id: number, name: string, status: string, conclusion: string | null }} CheckRun
 * @typedef {'pass' | 'fail' | 'pending'} GateDecision
 */

/**
 * @param {readonly CheckRun[]} checkRuns
 * @param {readonly string[]} [required]
 * @returns {{ decision: GateDecision, detail: string }}
 */
export function ciGateDecision(checkRuns, required = REQUIRED_CHECKS) {
  const waiting = []
  for (const name of required) {
    // A re-run leaves the older run behind; the newest (highest id) decides.
    let run
    for (const candidate of checkRuns) {
      if (candidate.name === name && (!run || candidate.id > run.id)) run = candidate
    }
    if (!run || run.status !== 'completed') {
      waiting.push(name)
      continue
    }
    if (run.conclusion !== 'success') {
      return { decision: 'fail', detail: `${name} concluded ${run.conclusion ?? 'without a result'}` }
    }
  }
  if (waiting.length > 0) {
    return { decision: 'pending', detail: `waiting for ${waiting.join(', ')}` }
  }
  return { decision: 'pass', detail: `${required.join(', ')} passed` }
}

/**
 * The check-runs endpoint for a commit on the website repo.
 * @param {string} sha
 * @returns {string}
 */
export function checkRunsUrl(sha) {
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`not a commit sha: ${sha}`)
  return `https://api.github.com/repos/TurboPanel/website/commits/${sha}/check-runs?per_page=100`
}

/**
 * Poll until the gate passes, fails, or `deadlineMs` passes (a timeout fails).
 * @param {{
 *   sha: string,
 *   fetchJson: (url: string) => Promise<{ check_runs?: CheckRun[] }>,
 *   sleep: (ms: number) => Promise<void>,
 *   now: () => number,
 *   deadlineMs: number,
 *   intervalMs: number,
 *   log?: (line: string) => void,
 * }} opts
 * @returns {Promise<GateDecision>}
 */
export async function waitForCiGate(opts) {
  const url = checkRunsUrl(opts.sha)
  const stopAt = opts.now() + opts.deadlineMs
  for (;;) {
    const body = await opts.fetchJson(url)
    const { decision, detail } = ciGateDecision(body.check_runs ?? [])
    opts.log?.(`ci-gate ${opts.sha.slice(0, 12)}: ${decision} (${detail})`)
    if (decision !== 'pending') return decision
    if (opts.now() + opts.intervalMs > stopAt) {
      opts.log?.(`ci-gate ${opts.sha.slice(0, 12)}: timed out`)
      return 'fail'
    }
    await opts.sleep(opts.intervalMs)
  }
}
