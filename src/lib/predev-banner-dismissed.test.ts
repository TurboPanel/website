import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  notifyPreDevBannerDismissed,
  persistPreDevBannerDismissed,
  preDevBannerDismissedStore,
} from '@/lib/predev-banner-dismissed'

function createMemoryLocalStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear() {
      data.clear()
    },
    getItem(key: string) {
      return data.get(key) ?? null
    },
    key(index: number) {
      return [...data.keys()][index] ?? null
    },
    removeItem(key: string) {
      data.delete(key)
    },
    setItem(key: string, value: string) {
      data.set(key, String(value))
    },
  }
}

describe('preDevBannerDismissedStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryLocalStorage())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is dismissed only after persist, and SSR snapshots stay false', () => {
    expect(preDevBannerDismissedStore.getServerSnapshot()).toBe(false)
    expect(preDevBannerDismissedStore.getSnapshot()).toBe(false)

    persistPreDevBannerDismissed()

    expect(preDevBannerDismissedStore.getSnapshot()).toBe(true)
    expect(preDevBannerDismissedStore.getServerSnapshot()).toBe(false)
  })

  it('notifies subscribers on persist and after an explicit notify', () => {
    const listener = vi.fn()
    const unsubscribe = preDevBannerDismissedStore.subscribe(listener)

    persistPreDevBannerDismissed()
    expect(listener).toHaveBeenCalledTimes(1)

    notifyPreDevBannerDismissed()
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    notifyPreDevBannerDismissed()
    persistPreDevBannerDismissed()
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('treats a non-true stored value as not dismissed', () => {
    localStorage.setItem('predev-banner-dismissed', '1')
    expect(preDevBannerDismissedStore.getSnapshot()).toBe(false)
  })
})
