import type { ReactNode } from 'react'

/**
 * Boxes-and-arrows drawings for the control-plane identity page
 * (`docs/security/control-plane-identity.mdx`) and the sealed secrets page
 * (`docs/security/sealed-secrets.mdx`).
 *
 * Plain flex layout, not SVG: each row stacks into a column on phones and lays
 * out left to right from `sm:` up, so the labels stay readable at any width.
 * A row is `from -> to`, or `from -> via -> to` when something sits in the
 * middle (a tunnel or proxy).
 * Colors come from the `--tp-*` tokens so both themes work. The `figure` carries
 * `data-tp-diagram`, the framed-diagram hook in `globals.css`; the caption is
 * the text alternative.
 */

type BoxTone = 'controlPlane' | 'server' | 'owner' | 'middle' | 'neutral' | 'impostor'

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

type Via = Readonly<{
  box: Box
  arrow: Arrow
}>

type Row = Readonly<{
  id: string
  from: Box
  arrow: Arrow
  via?: Via
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
const MIDDLE: Box = { id: 'middle', tone: 'middle', title: 'Tunnel or proxy' }

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
  sealedProblem: {
    caption:
      'Protected only by the padlocked connection, a secret can be read wherever that connection is opened in the middle.',
    rows: [
      {
        id: 'readable',
        from: { ...CONTROL_PLANE, detail: 'sends a secret' },
        arrow: { text: '"database password: s3cret"' },
        via: {
          box: { ...MIDDLE, detail: 'opens the padlocked connection here' },
          arrow: { text: '"database password: s3cret"' },
        },
        to: { ...SERVER, detail: 'needs the secret' },
      },
    ],
  },
  sealedPadlock: {
    caption:
      'The server keeps the only padlock key and hands the control plane an open padlock, signed with its own identity key so nobody can swap it.',
    rows: [
      {
        id: 'handover',
        from: { ...SERVER, detail: 'keeps the padlock key (secret)' },
        arrow: { text: 'open padlock, signed by the server' },
        to: { ...CONTROL_PLANE, detail: 'holds the open padlock' },
      },
    ],
  },
  sealedBox: {
    caption:
      'Every secret travels in a box locked with that server’s padlock. The middle sees only a locked box; only that server can open it.',
    rows: [
      {
        id: 'locked',
        from: { ...CONTROL_PLANE, detail: 'locks the box' },
        arrow: { text: 'locked box' },
        via: {
          box: { ...MIDDLE, detail: 'sees only a locked box' },
          arrow: { text: 'locked box' },
        },
        to: { ...SERVER, detail: 'opens it with its key' },
      },
      {
        id: 'stays-locked',
        from: { ...IMPOSTOR, detail: 'in the middle' },
        arrow: { text: 'tries to open the box', refused: true },
        to: {
          id: 'locked-box',
          tone: 'neutral',
          title: 'Stays locked',
          detail: 'no key, no secret',
        },
      },
    ],
  },
  sealedUp: {
    caption:
      'A secret sent up, such as the private part of a certificate, is locked with the control plane’s padlock and opens only there.',
    rows: [
      {
        id: 'upward',
        from: { ...SERVER, detail: 'locks with the control plane’s padlock' },
        arrow: { text: 'certificate key, locked' },
        to: { ...CONTROL_PLANE, detail: 'opens it with its key' },
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
  middle:
    'border-amber-600 bg-amber-600/10 text-[var(--tp-text)] dark:border-amber-300 dark:bg-amber-300/10',
  neutral: 'border-[var(--tp-border)] bg-[var(--tp-surface)] text-[var(--tp-text)]',
  impostor:
    'border-dashed border-[var(--tp-text-muted)] bg-[var(--tp-surface-muted)] text-[var(--tp-text-muted)]',
}

// In a three-box row the boxes share the width instead of taking a fixed
// 11rem each, so the row still fits the docs column with the sidebar open.
const BOX_SHARED = 'sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-0'
const ARROW_FIXED = 'sm:w-28 sm:flex-none'

function DiagramBox({ box, shared }: Readonly<{ box: Box; shared: boolean }>) {
  return (
    <div className={`${BOX_BASE} ${BOX_TONE[box.tone]} ${shared ? BOX_SHARED : ''}`}>
      <span className="text-sm font-semibold leading-tight">{box.title}</span>
      {box.detail ? (
        <span className="mt-0.5 text-xs leading-snug text-[var(--tp-text-muted)]">
          {box.detail}
        </span>
      ) : null}
    </div>
  )
}

function DiagramArrow({ arrow, fixed }: Readonly<{ arrow: Arrow; fixed: boolean }>) {
  const stroke = arrow.refused ? 'text-[var(--tp-text-muted)]' : 'text-[var(--tp-text)]'
  const line = arrow.refused ? 'border-dashed' : 'border-solid'
  const width = fixed ? ARROW_FIXED : 'sm:min-w-28'
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 sm:py-0 ${width} ${stroke}`}
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
  const wide = row.via !== undefined
  return (
    <div className="flex flex-col items-center sm:flex-row sm:gap-3">
      <DiagramBox box={row.from} shared={wide} />
      <DiagramArrow arrow={row.arrow} fixed={wide} />
      {row.via ? (
        <>
          <DiagramBox box={row.via.box} shared={wide} />
          <DiagramArrow arrow={row.via.arrow} fixed={wide} />
        </>
      ) : null}
      <DiagramBox box={row.to} shared={wide} />
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
