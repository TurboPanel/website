import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildScalarBearerAuthentication,
  buildScalarCookieAuthentication,
  HTTP_SESSION_COOKIE_NAME,
  HTTPS_SESSION_COOKIE_NAME,
  installScalarSessionCookieNameRowLock,
  resolveSessionCookieNameFromBaseUrl,
  SCALAR_SESSION_COOKIE_NAME_ROW_ATTR,
  scalarSessionCookieNameRowCss,
} from '@/lib/scalar-session-cookie'

type Listener = (event: Event) => void

class MockNode {
  parent: MockNode | null = null
  children: MockNode[] = []
  textContent = ''
  className = ''
  attributes = new Map<string, string>()
  listeners = new Map<string, Listener[]>()

  appendChild(child: MockNode): MockNode {
    child.parent = this
    this.children.push(child)
    return child
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value)
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name)
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null
  }

  addEventListener(type: string, listener: Listener, capture?: boolean): void {
    void capture
    const bucket = this.listeners.get(type) ?? []
    bucket.push(listener)
    this.listeners.set(type, bucket)
  }

  querySelector(selector: string): MockNode | null {
    return this.querySelectorAll(selector)[0] ?? null
  }

  querySelectorAll(selector: string): MockNode[] {
    const matches: MockNode[] = []
    const visit = (node: MockNode) => {
      if (node.matches(selector)) matches.push(node)
      for (const child of node.children) visit(child)
    }
    visit(this)
    return matches
  }

  matches(selector: string): boolean {
    if (selector.startsWith('.')) {
      const classes = selector.slice(1).split('.').filter(Boolean)
      const nodeClasses = this.className.split(/\s+/).filter(Boolean)
      return classes.every((token) => nodeClasses.includes(token))
    }
    if (selector.includes('[')) {
      const bracketIndex = selector.indexOf('[')
      const tag = selector.slice(0, bracketIndex)
      if (tag && this.tagName.toLowerCase() !== tag.toLowerCase()) return false
      const attrMatch = /\[([^=]+)="([^"]+)"\]/.exec(selector)
      if (attrMatch) {
        const [, attr, value] = attrMatch
        if (attr === 'placeholder' && this instanceof MockInput) {
          return this.placeholder === value
        }
        return this.attributes.get(attr) === value
      }
    }
    return this.tagName.toLowerCase() === selector.toLowerCase()
  }

  constructor(public tagName: string) {}
}

class MockInput extends MockNode {
  readOnly = false
  placeholder = ''

  constructor() {
    super('INPUT')
  }
}

function createScalarDom(): {
  root: MockNode
  cookieRow: MockNode
  authHost: MockNode
} {
  const root = new MockNode('DIV')
  root.className = 'scalar-api-reference'

  const authHost = new MockNode('DIV')
  authHost.className = 'scalar-reference-intro-auth'
  root.appendChild(authHost)

  const table = new MockNode('TABLE')
  table.className = 'scalar-data-table'
  root.appendChild(table)

  const cookieRow = new MockNode('TR')
  table.appendChild(cookieRow)

  const label = new MockNode('LABEL')
  label.textContent = 'Name'
  cookieRow.appendChild(label)

  const editor = new MockNode('DIV')
  editor.className = 'cm-editor'
  cookieRow.appendChild(editor)

  const content = new MockNode('DIV')
  content.className = 'cm-content'
  editor.appendChild(content)

  const input = new MockInput()
  input.placeholder = 'api-key'
  cookieRow.appendChild(input)

  return { root, cookieRow, authHost }
}

describe('resolveSessionCookieNameFromBaseUrl', () => {
  it('selects the __Host cookie for https origins', () => {
    expect(resolveSessionCookieNameFromBaseUrl('https://turbopanel.app')).toBe(
      HTTPS_SESSION_COOKIE_NAME,
    )
  })

  it('selects the plain cookie for http origins', () => {
    expect(resolveSessionCookieNameFromBaseUrl('http://localhost:8880')).toBe(
      HTTP_SESSION_COOKIE_NAME,
    )
  })

  it('defaults to the secure cookie name when the URL is invalid', () => {
    expect(resolveSessionCookieNameFromBaseUrl('not-a-url')).toBe(
      HTTPS_SESSION_COOKIE_NAME,
    )
  })

  it('defaults to the secure cookie for non-http(s) protocols', () => {
    expect(resolveSessionCookieNameFromBaseUrl('ftp://example.com')).toBe(
      HTTPS_SESSION_COOKIE_NAME,
    )
  })
})

describe('buildScalarCookieAuthentication', () => {
  it('registers cookieAuth as the preferred scheme', () => {
    expect(buildScalarCookieAuthentication(HTTPS_SESSION_COOKIE_NAME)).toEqual({
      preferredSecurityScheme: 'cookieAuth',
      createAnySecurityScheme: false,
      securitySchemes: {
        cookieAuth: { name: HTTPS_SESSION_COOKIE_NAME },
      },
    })
  })
})

describe('buildScalarBearerAuthentication', () => {
  it('registers bearerAuth only for the daemon surface', () => {
    expect(buildScalarBearerAuthentication()).toEqual({
      preferredSecurityScheme: 'bearerAuth',
      createAnySecurityScheme: false,
      securitySchemes: {
        bearerAuth: { token: '' },
      },
    })
  })
})

describe('scalarSessionCookieNameRowCss', () => {
  it('targets locked cookie-name rows in Scalar auth tables', () => {
    expect(scalarSessionCookieNameRowCss).toContain(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)
    expect(scalarSessionCookieNameRowCss).toContain('.scalar-api-reference')
  })
})

describe('installScalarSessionCookieNameRowLock', () => {
  let mutationCallbacks: Array<() => void> = []

  beforeEach(() => {
    vi.useFakeTimers()
    mutationCallbacks = []

    vi.stubGlobal(
      'requestAnimationFrame',
      (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    )

    vi.stubGlobal(
      'MutationObserver',
      class {
        constructor(private readonly callback: () => void) {
          mutationCallbacks.push(callback)
        }

        observe(): void {}

        disconnect(): void {}
      },
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('tags cookie-name rows and locks editor interactions', () => {
    const { root, cookieRow } = createScalarDom()

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    vi.runAllTimers()
    cleanup()

    expect(cookieRow.hasAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)).toBe(true)
    const editor = cookieRow.querySelector('.cm-editor')
    expect(editor?.getAttribute('aria-readonly')).toBe('true')
    const content = editor?.querySelector('.cm-content')
    expect(content?.getAttribute('contenteditable')).toBe('false')
    const input = cookieRow.querySelector('input[placeholder="api-key"]') as MockInput | null
    if (!input) throw new TypeError('expected api-key input')
    expect(input.readOnly).toBe(true)
  })

  it('recognizes alternate Scalar label layouts', () => {
    const root = new MockNode('DIV')
    const table = new MockNode('TABLE')
    table.className = 'scalar-data-table'
    root.appendChild(table)

    const altRow = new MockNode('TR')
    table.appendChild(altRow)
    const cellLabel = new MockNode('DIV')
    cellLabel.className = 'text-c-1 flex items-center'
    cellLabel.textContent = 'Name: turbopanel.session_token'
    altRow.appendChild(cellLabel)

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    vi.runAllTimers()
    cleanup()

    expect(altRow.hasAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)).toBe(true)
  })

  it('schedules rescans when the auth host is present', () => {
    const { root } = createScalarDom()

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    expect(mutationCallbacks).toHaveLength(1)

    mutationCallbacks[0]?.()
    vi.runAllTimers()
    cleanup()
  })

  it('coalesces rapid mutation observer callbacks into one animation frame', () => {
    const rafCallbacks: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback)
      return rafCallbacks.length
    })

    const { root, cookieRow } = createScalarDom()

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    cookieRow.attributes.delete(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)
    const setAttribute = vi.spyOn(cookieRow, 'setAttribute')

    const schedule = mutationCallbacks[0]
    if (!schedule) throw new TypeError('expected mutation observer callback')
    schedule()
    schedule()
    schedule()

    expect(rafCallbacks).toHaveLength(1)

    rafCallbacks[0]?.(0)
    vi.runAllTimers()
    cleanup()

    const lockCalls = setAttribute.mock.calls.filter(
      ([name]) => name === SCALAR_SESSION_COOKIE_NAME_ROW_ATTR,
    )
    expect(lockCalls).toHaveLength(1)
  })

  it('skips delayed rescans after cleanup even when timeouts still fire', () => {
    vi.spyOn(globalThis, 'clearTimeout').mockImplementation(() => {})

    const { root, cookieRow } = createScalarDom()
    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)

    cookieRow.attributes.delete(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)
    cleanup()

    vi.advanceTimersByTime(1200)

    expect(cookieRow.hasAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)).toBe(false)
  })

  it('returns cleanup without an observer when the auth host is missing', () => {
    const root = new MockNode('DIV')
    const table = new MockNode('TABLE')
    table.className = 'scalar-data-table'
    root.appendChild(table)

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    expect(mutationCallbacks).toHaveLength(0)

    vi.runAllTimers()
    cleanup()
  })

  it('falls back to the introduction card when intro auth is absent', () => {
    const root = new MockNode('DIV')
    const authHost = new MockNode('DIV')
    authHost.className = 'introduction-card-item'
    root.appendChild(authHost)

    const table = new MockNode('TABLE')
    table.className = 'scalar-data-table'
    root.appendChild(table)

    const row = new MockNode('TR')
    table.appendChild(row)
    const label = new MockNode('LABEL')
    label.textContent = 'Name'
    row.appendChild(label)

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    expect(mutationCallbacks).toHaveLength(1)
    cleanup()
  })

  it('ignores rows that are not cookie-name fields', () => {
    const root = new MockNode('DIV')
    const table = new MockNode('TABLE')
    table.className = 'scalar-data-table'
    root.appendChild(table)

    const otherRow = new MockNode('TR')
    table.appendChild(otherRow)
    const label = new MockNode('LABEL')
    label.textContent = 'Value'
    otherRow.appendChild(label)

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    vi.runAllTimers()
    cleanup()

    expect(otherRow.hasAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)).toBe(false)
  })

  it('rejects rows whose label and cell label are both non-matching', () => {
    const root = new MockNode('DIV')
    const table = new MockNode('TABLE')
    table.className = 'scalar-data-table'
    root.appendChild(table)

    const otherRow = new MockNode('TR')
    table.appendChild(otherRow)

    const label = new MockNode('LABEL')
    label.textContent = 'API Key'
    otherRow.appendChild(label)

    const cellLabel = new MockNode('DIV')
    cellLabel.className = 'text-c-1 flex items-center'
    cellLabel.textContent = 'Token'
    otherRow.appendChild(cellLabel)

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    vi.runAllTimers()
    cleanup()

    expect(otherRow.hasAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)).toBe(false)
  })

  it('does not duplicate locks on the same row', () => {
    const { root, cookieRow } = createScalarDom()
    const addEventListener = vi.spyOn(cookieRow, 'addEventListener')

    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)
    vi.runAllTimers()
    installScalarSessionCookieNameRowLock(root as unknown as Element)
    vi.runAllTimers()
    cleanup()

    const keydownCalls = addEventListener.mock.calls.filter(([type]) => type === 'keydown')
    expect(keydownCalls).toHaveLength(1)
  })

  it('blocks edit events on locked cookie-name rows', () => {
    const { root, cookieRow } = createScalarDom()
    const cleanup = installScalarSessionCookieNameRowLock(root as unknown as Element)

    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }
    const keydown = cookieRow.listeners.get('keydown')?.[0]
    if (!keydown) throw new TypeError('expected keydown listener')
    keydown(event as Event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.stopPropagation).toHaveBeenCalled()
    cleanup()
  })
})
