import { useSyncExternalStore } from 'react'

/** True after client hydration; false during SSR. Replaces mounted + useEffect patterns. */
export function useClientMounted(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false)
}
