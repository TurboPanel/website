import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { clientMountedStore, useClientMounted } from '@/lib/use-client-mounted'

function MountedProbe() {
  return createElement('span', {
    'data-mounted': String(useClientMounted()),
  })
}

describe('clientMountedStore', () => {
  it('is mounted on the client snapshot and not on the server snapshot', () => {
    expect(clientMountedStore.getSnapshot()).toBe(true)
    expect(clientMountedStore.getServerSnapshot()).toBe(false)
  })

  it('subscribe returns a no-op unsubscribe because the snapshot never changes', () => {
    const listener = () => {
      throw new TypeError('clientMountedStore must not notify listeners')
    }
    const unsubscribe = clientMountedStore.subscribe(listener)
    expect(unsubscribe).toBeTypeOf('function')
    unsubscribe()
  })
})

describe('useClientMounted', () => {
  it('renders the server snapshot during SSR', () => {
    const html = renderToString(createElement(MountedProbe))
    expect(html).toContain('data-mounted="false"')
    expect(html).not.toContain('data-mounted="true"')
  })
})
