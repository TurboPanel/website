const STORAGE_KEY = 'predev-banner-dismissed'

const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

function getServerSnapshot(): boolean {
  return false
}

export function notifyPreDevBannerDismissed(): void {
  for (const listener of listeners) {
    listener()
  }
}

export function persistPreDevBannerDismissed(): void {
  localStorage.setItem(STORAGE_KEY, 'true')
  notifyPreDevBannerDismissed()
}

export const preDevBannerDismissedStore = {
  subscribe,
  getSnapshot,
  getServerSnapshot,
}
