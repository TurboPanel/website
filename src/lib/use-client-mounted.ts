import { useSyncExternalStore } from 'react'

function noopUnsubscribe(): void {
  // Snapshot is constant — client is always mounted, SSR never is.
}

/**
 * Snapshots for {@link useClientMounted}. The value never changes in a given
 * environment, so subscribe is a no-op. Named so unit tests can hit both
 * snapshots without a DOM renderer.
 */
export const clientMountedStore = {
  subscribe(_onStoreChange: () => void): () => void {
    return noopUnsubscribe
  },
  getSnapshot(): boolean {
    return true
  },
  getServerSnapshot(): boolean {
    return false
  },
}

/** True after client hydration; false during SSR. Replaces mounted + useEffect patterns. */
export function useClientMounted(): boolean {
  return useSyncExternalStore(
    clientMountedStore.subscribe,
    clientMountedStore.getSnapshot,
    clientMountedStore.getServerSnapshot,
  )
}
