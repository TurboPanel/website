import type { AuthenticationConfiguration } from '@scalar/types/api-reference'

export const HTTPS_SESSION_COOKIE_NAME = '__Host-turbopanel.session_token'

export const HTTP_SESSION_COOKIE_NAME = 'turbopanel.session_token'

export function resolveSessionCookieNameFromBaseUrl(baseUrl: string): string {
  try {
    const { protocol } = new URL(baseUrl)
    if (protocol === 'http:') return HTTP_SESSION_COOKIE_NAME
    if (protocol === 'https:') return HTTPS_SESSION_COOKIE_NAME
  } catch {
    // fall through
  }
  return HTTPS_SESSION_COOKIE_NAME
}

/** Marks the apiKey "Name" row read-only (cookie name follows the selected server URL). */
export const SCALAR_SESSION_COOKIE_NAME_ROW_ATTR = 'data-turbopanel-session-cookie-name-locked'

const lockedRows = new WeakSet<Element>()

export const scalarSessionCookieNameRowCss = `
  .scalar-api-reference tr[${SCALAR_SESSION_COOKIE_NAME_ROW_ATTR}] button.scalar-icon-button:not([data-testid="data-table-password-toggle"]) {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    min-width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
  .scalar-api-reference tr[${SCALAR_SESSION_COOKIE_NAME_ROW_ATTR}] .cm-editor {
    pointer-events: none;
    cursor: default;
    opacity: 0.92;
  }
  .scalar-api-reference tr[${SCALAR_SESSION_COOKIE_NAME_ROW_ATTR}] .cm-editor .cm-cursor,
  .scalar-api-reference tr[${SCALAR_SESSION_COOKIE_NAME_ROW_ATTR}] .cm-editor .cm-selectionBackground {
    display: none !important;
  }
  .scalar-api-reference tr[${SCALAR_SESSION_COOKIE_NAME_ROW_ATTR}] input[placeholder="api-key"] {
    pointer-events: none;
    cursor: default;
  }
`

export function buildScalarCookieAuthentication(
  cookieName: string
): AuthenticationConfiguration {
  return {
    preferredSecurityScheme: 'cookieAuth',
    createAnySecurityScheme: false,
    securitySchemes: {
      cookieAuth: { name: cookieName },
    },
  }
}

/** Daemon surface: JWT Bearer only — do not register cookieAuth here. */
export function buildScalarBearerAuthentication(): AuthenticationConfiguration {
  return {
    preferredSecurityScheme: 'bearerAuth',
    createAnySecurityScheme: false,
    securitySchemes: {
      bearerAuth: { token: '' },
    },
  }
}

function isCookieNameLabel(label: Element | null): boolean {
  const text = label?.textContent?.trim() ?? ''
  return text === 'Name' || text.startsWith('Name:')
}

function isCookieNameRow(row: Element): boolean {
  const label = row.querySelector('label')
  if (label && isCookieNameLabel(label)) return true
  const cellLabel = row.querySelector('.text-c-1.flex.items-center')
  if (cellLabel && isCookieNameLabel(cellLabel)) return true
  return false
}

function blockEditableEvents(event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}

function lockCookieNameRowInteractions(row: Element): void {
  if (lockedRows.has(row)) return
  lockedRows.add(row)

  const editor = row.querySelector('.cm-editor')
  if (editor) {
    editor.setAttribute('aria-readonly', 'true')
    editor.querySelector('.cm-content')?.setAttribute('contenteditable', 'false')
  }

  for (const input of row.querySelectorAll<HTMLInputElement>('input[placeholder="api-key"]')) {
    input.readOnly = true
  }

  row.addEventListener('keydown', blockEditableEvents, true)
  row.addEventListener('beforeinput', blockEditableEvents, true)
  row.addEventListener('paste', blockEditableEvents, true)
  row.addEventListener('cut', blockEditableEvents, true)
}

/** Tags cookie-name rows once so customCss applies; does not mutate editor text (avoids CM loops). */
function lockCookieNameRows(root: Element): void {
  for (const table of root.querySelectorAll('.scalar-data-table')) {
    for (const row of table.querySelectorAll('tr')) {
      if (!isCookieNameRow(row)) continue
      if (!row.hasAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR)) {
        row.setAttribute(SCALAR_SESSION_COOKIE_NAME_ROW_ATTR, 'true')
      }
      lockCookieNameRowInteractions(row)
    }
  }
}

/**
 * Keeps Scalar's cookie "Name" row visible but read-only. Name value comes from
 * {@link buildScalarCookieAuthentication} (http/https server URL).
 */
export function installScalarSessionCookieNameRowLock(root: Element): () => void {
  let disconnected = false
  let observer: MutationObserver | null = null
  const timeoutIds: ReturnType<typeof globalThis.setTimeout>[] = []

  const run = () => {
    if (!disconnected) lockCookieNameRows(root)
  }

  run()
  for (const delay of [100, 400, 1200]) {
    timeoutIds.push(globalThis.setTimeout(run, delay))
  }

  const authHost =
    root.querySelector('.scalar-reference-intro-auth') ??
    root.querySelector('.introduction-card-item')

  if (!authHost) {
    return () => {
      disconnected = true
      observer?.disconnect()
      for (const id of timeoutIds) globalThis.clearTimeout(id)
    }
  }

  let scheduled = false
  const schedule = () => {
    if (disconnected || scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      run()
    })
  }

  observer = new MutationObserver(schedule)
  observer.observe(authHost, { childList: true, subtree: true })

  return () => {
    disconnected = true
    observer?.disconnect()
    for (const id of timeoutIds) globalThis.clearTimeout(id)
  }
}
