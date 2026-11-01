import type { ReactNode } from 'react'

/**
 * Boxes-and-arrows drawings for the control-plane identity page
 * (`docs/security/control-plane-identity.mdx`).
 *
 * Plain flex layout, not SVG: each row stacks into a column on phones and lays
 * out left to right from `sm:` up, so the labels stay readable at any width.
 * Colors come from the `--tp-*` tokens so both themes work. The `figure` carries
 * `data-tp-diagram`, the framed-diagram hook in `globals.css`; the caption is
 * the text alternative.
 */

type BoxTone = 'controlPlane' | 'server' | 'owner' | 'neutral' | 'impostor'

type Box = Readonly<{
  id: string
  tone: BoxTone
  title: string
  detail?: string
}>

type Arrow = Readonly<{
  text: string
  refused?: boolean
}>

type Row = Readonly<{
  id: string
  from: Box
  arrow: Arrow
  to: Box
}>

type Drawing = Readonly<{
  caption: string
  rows: readonly Row[]
}>

const CONTROL_PLANE: Box = {
  id: 'control-plane',
  tone: 'controlPlane',
  title: 'Your control plane',
}
const SERVER: Box = { id: 'server', tone: 'server', title: 'Your server' }
const IMPOSTOR: Box = { id: 'impostor', tone: 'impostor', title: 'An impostor' }

const DRAWINGS = {
  problem: {
    caption:
      'Both messages arrive over a padlocked connection. The server needs a way to tell the two apart.',
    rows: [
      {
        id: 'real',
        from: { ...CONTROL_PLANE, detail: 'sends orders' },
        arrow: { text: '"deploy this"' },
        to: { ...SERVER, detail: 'carries them out' },
      },
      {
        id: 'fake',
        from: { ...IMPOSTOR, detail: 'at the same address' },
        arrow: { text: '"deploy this"' },
        to: { ...SERVER, detail: 'how can it tell?' },
      },
    ],
  },
  key: {
    caption:
      'Coming soon: the key never leaves the control plane, and every order will carry its stamp.',
    rows: [
      {
        id: 'stamp',
        from: { ...CONTROL_PLANE, detail: 'keeps the key (secret)' },
        arrow: { text: 'order + stamp' },
        to: {
          id: 'order',
          tone: 'neutral',
          title: '"deploy this"',
          detail: 'stamped by the control plane',
        },
      },
    ],
  },
  fingerprint: {
    caption:
      'Coming soon: the server will learn the fingerprint once, when it joins, and keep it for every later check.',
    rows: [
      {
        id: 'install',
        from: {
          id: 'install-command',
          tone: 'neutral',
          title: 'Install command',
          detail: 'will carry the fingerprint',
        },
        arrow: { text: 'you run it once' },
        to: { ...SERVER, detail: 'will remember the fingerprint' },
      },
    ],
  },
  check: {
    caption:
      'Coming soon: a real stamp matches the remembered fingerprint; anything else will be refused.',
    rows: [
      {
        id: 'accepted',
        from: CONTROL_PLANE,
        arrow: { text: 'order + real stamp' },
        to: { ...SERVER, detail: 'stamp matches: carries it out' },
      },
      {
        id: 'refused',
        from: IMPOSTOR,
        arrow: { text: 'order, no real stamp', refused: true },
        to: { ...SERVER, detail: 'no match: refuses' },
      },
    ],
  },
  rotate: {
    caption:
      'Only a switch you approve with a passkey is accepted. A thief with the old key cannot approve one.',
    rows: [
      {
        id: 'approve',
        from: { id: 'owner', tone: 'owner', title: 'You approve', detail: 'with a passkey' },
        arrow: { text: '"switch to the new key"' },
        to: { ...SERVER, detail: 'switches only with your approval' },
      },
    ],
  },
} as const satisfies Record<string, Drawing>

export type TrustDiagramName = keyof typeof DRAWINGS

const BOX_BASE =
  'flex min-h-16 w-full flex-col items-center justify-center rounded-lg border px-3 py-2 text-center sm:w-44 sm:shrink-0'

const BOX_TONE: Readonly<Record<BoxTone, string>> = {
  controlPlane:
    'border-[var(--tp-blue)] bg-[color-mix(in_srgb,var(--tp-blue)_12%,var(--tp-surface))] text-[var(--tp-text)]',
  server:
    'border-[var(--tp-green)] bg-[color-mix(in_srgb,var(--tp-green)_14%,var(--tp-surface))] text-[var(--tp-text)]',
  owner:
    'border-amber-500 bg-amber-500/10 text-[var(--tp-text)] dark:border-amber-400 dark:bg-amber-400/10',
  neutral: 'border-[var(--tp-border)] bg-[var(--tp-surface)] text-[var(--tp-text)]',
  impostor:
    'border-dashed border-[var(--tp-text-muted)] bg-[var(--tp-surface-muted)] text-[var(--tp-text-muted)]',
}

function DiagramBox({ box }: Readonly<{ box: Box }>) {
  return (
    <div className={`${BOX_BASE} ${BOX_TONE[box.tone]}`}>
      <span className="text-sm font-semibold leading-tight">{box.title}</span>
      {box.detail ? (
        <span className="mt-0.5 text-xs leading-snug text-[var(--tp-text-muted)]">
          {box.detail}
        </span>
      ) : null}
    </div>
  )
}

function DiagramArrow({ arrow }: Readonly<{ arrow: Arrow }>) {
  const stroke = arrow.refused ? 'text-[var(--tp-text-muted)]' : 'text-[var(--tp-text)]'
  const line = arrow.refused ? 'border-dashed' : 'border-solid'
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 sm:min-w-28 sm:py-0 ${stroke}`}
    >
      <span className="text-xs text-[var(--tp-text-muted)]">{arrow.text}</span>
      <div className="flex w-full items-center justify-center">
        <span
          aria-hidden="true"
          className={`hidden flex-1 border-t border-current sm:block ${line}`}
        />
        <svg
          aria-hidden="true"
          className="h-5 w-5 shrink-0 rotate-90 sm:rotate-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 12h14M13 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  )
}

function DiagramRow({ row }: Readonly<{ row: Row }>) {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:gap-3">
      <DiagramBox box={row.from} />
      <DiagramArrow arrow={row.arrow} />
      <DiagramBox box={row.to} />
    </div>
  )
}

export function TrustDiagram({ name }: Readonly<{ name: TrustDiagramName }>): ReactNode {
  const drawing: Drawing = DRAWINGS[name]
  return (
    <figure data-tp-diagram className="my-6">
      <div className="not-prose flex flex-col gap-4">
        {drawing.rows.map((row) => (
          <DiagramRow key={row.id} row={row} />
        ))}
      </div>
      <figcaption>{drawing.caption}</figcaption>
    </figure>
  )
}
