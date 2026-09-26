import { describe, expect, it, vi } from 'vitest'
import { checkRunsUrl, ciGateDecision, REQUIRED_CHECKS, waitForCiGate } from './ci-gate-lib.mjs'

const SHA = 'b'.repeat(40)

type Run = { id: number; name: string; status: string; conclusion: string | null }

function run(id: number, name: string, status: string, conclusion: string | null = null): Run {
  return { id, name, status, conclusion }
}

const allPassed = REQUIRED_CHECKS.map((name, i) => run(i + 1, name, 'completed', 'success'))

describe('ciGateDecision', () => {
  it('passes when every required check succeeded', () => {
    expect(ciGateDecision([...allPassed, run(99, 'SonarCloud', 'completed', 'failure')]).decision).toBe('pass')
  })

  it('is pending while a required check is missing or still running', () => {
    expect(ciGateDecision([]).decision).toBe('pending')
    const { decision, detail } = ciGateDecision([run(1, 'verify', 'in_progress'), allPassed[1]!])
    expect(decision).toBe('pending')
    expect(detail).toContain('verify')
  })

  it('fails when a required check concluded anything but success', () => {
    for (const conclusion of ['failure', 'cancelled', 'timed_out', 'skipped', null]) {
      const { decision, detail } = ciGateDecision([run(1, 'verify', 'completed', conclusion), allPassed[1]!])
      expect(decision).toBe('fail')
      expect(detail).toContain('verify')
    }
  })

  it('judges a re-run by its newest run (highest id), whatever the list order', () => {
    const rerunPassed = [run(5, 'verify', 'completed', 'success'), run(2, 'verify', 'completed', 'failure'), allPassed[1]!]
    expect(ciGateDecision(rerunPassed).decision).toBe('pass')
    const rerunFailed = [run(2, 'verify', 'completed', 'success'), run(5, 'verify', 'completed', 'failure'), allPassed[1]!]
    expect(ciGateDecision(rerunFailed).decision).toBe('fail')
  })
})

describe('checkRunsUrl', () => {
  it('builds the check-runs URL for a full sha', () => {
    expect(checkRunsUrl(SHA)).toBe(
      `https://api.github.com/repos/TurboPanel/website/commits/${SHA}/check-runs?per_page=100`,
    )
  })

  it('refuses anything that is not a 40-hex sha', () => {
    expect(() => checkRunsUrl('trunk')).toThrow(/not a commit sha/)
    expect(() => checkRunsUrl(`${SHA}/../x`)).toThrow(/not a commit sha/)
  })
})

describe('waitForCiGate', () => {
  function clock() {
    let t = 0
    return { now: () => t, sleep: vi.fn(async (ms: number) => { t += ms }) }
  }

  it('polls until the checks pass', async () => {
    const c = clock()
    const fetchJson = vi.fn()
      .mockResolvedValueOnce({ check_runs: [] })
      .mockResolvedValueOnce({ check_runs: allPassed })
    const log = vi.fn()
    const decision = await waitForCiGate({ sha: SHA, fetchJson, sleep: c.sleep, now: c.now, deadlineMs: 10_000, intervalMs: 1_000, log })
    expect(decision).toBe('pass')
    expect(fetchJson).toHaveBeenCalledTimes(2)
    expect(c.sleep).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalled()
  })

  it('stops at the first failure', async () => {
    const c = clock()
    const fetchJson = vi.fn().mockResolvedValue({ check_runs: [run(1, 'verify', 'completed', 'failure')] })
    expect(await waitForCiGate({ sha: SHA, fetchJson, sleep: c.sleep, now: c.now, deadlineMs: 10_000, intervalMs: 1_000 })).toBe('fail')
    expect(c.sleep).not.toHaveBeenCalled()
  })

  it('fails when the checks are still pending at the deadline', async () => {
    const c = clock()
    const fetchJson = vi.fn().mockResolvedValue({})
    const log = vi.fn()
    expect(await waitForCiGate({ sha: SHA, fetchJson, sleep: c.sleep, now: c.now, deadlineMs: 3_000, intervalMs: 1_000, log })).toBe('fail')
    expect(log).toHaveBeenLastCalledWith(expect.stringContaining('timed out'))
  })
})
