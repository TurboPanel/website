/**
 * Decorative topology illustrations for the /setups page. Hand-drawn inline
 * SVG (no chart/diagram dependency) — static, no entrance or loop animation,
 * matching the marketing motion policy (MASTER.md → Motion Policy).
 */

type Tone = 'blue' | 'green' | 'muted'

const TONE_TEXT_CLASS: Record<Tone, string> = {
  blue: 'text-[var(--tp-blue)]',
  green: 'text-[var(--tp-green)]',
  muted: 'text-[var(--tp-text-muted)]',
}

const TONE_STROKE: Record<Tone, string> = {
  blue: 'var(--tp-blue)',
  green: 'var(--tp-green)',
  muted: 'var(--tp-text-muted)',
}

function WireDefs() {
  return (
    <defs>
      <marker
        id="tp-wire-arrow-green"
        viewBox="0 0 8 8"
        refX="6"
        refY="4"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="var(--tp-green)" />
      </marker>
      <marker
        id="tp-wire-arrow-blue"
        viewBox="0 0 8 8"
        refX="6"
        refY="4"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="var(--tp-blue)" />
      </marker>
    </defs>
  )
}

function ServerNode({
  x,
  y,
  tone = 'blue',
  label,
}: Readonly<{ x: number; y: number; tone?: Tone; label?: string }>) {
  return (
    <g transform={`translate(${x} ${y})`} className={TONE_TEXT_CLASS[tone]}>
      <rect width="48" height="34" rx="7" fill="var(--tp-surface)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="7" y="7" width="34" height="3.5" rx="1.75" fill="currentColor" opacity="0.6" />
      <rect x="7" y="14" width="34" height="3.5" rx="1.75" fill="currentColor" opacity="0.4" />
      <rect x="7" y="21" width="20" height="3.5" rx="1.75" fill="currentColor" opacity="0.28" />
      <circle cx="41" cy="27" r="2" fill="currentColor" />
      {label ? (
        <text
          x="24"
          y="47"
          textAnchor="middle"
          className="fill-[var(--tp-text-muted)]"
          style={{ fontSize: 7.5, fontFamily: 'var(--font-geist-mono)' }}
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

function DbNode({
  x,
  y,
  tone = 'blue',
  label,
}: Readonly<{ x: number; y: number; tone?: Tone; label?: string }>) {
  return (
    <g transform={`translate(${x} ${y})`} className={TONE_TEXT_CLASS[tone]}>
      <path
        d="M0 7C0 3.13 8.06 0 18 0s18 3.13 18 7v20c0 3.87-8.06 7-18 7S0 30.87 0 27Z"
        fill="var(--tp-surface)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M0 7c0 3.87 8.06 7 18 7s18-3.13 18-7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {label ? (
        <text
          x="18"
          y="46"
          textAnchor="middle"
          className="fill-[var(--tp-text-muted)]"
          style={{ fontSize: 7.5, fontFamily: 'var(--font-geist-mono)' }}
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

function SiteFrame({
  x,
  y,
  width,
  height,
  label,
}: Readonly<{ x: number; y: number; width: number; height: number; label: string }>) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="18"
        fill="none"
        stroke="var(--tp-border)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      <text
        x={x + 14}
        y={y + 20}
        className="fill-[var(--tp-text-muted)]"
        style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em' }}
      >
        {label.toUpperCase()}
      </text>
    </g>
  )
}

function wireArrowMarker(tone: Tone): string {
  return tone === 'green' ? 'url(#tp-wire-arrow-green)' : 'url(#tp-wire-arrow-blue)'
}

function Wire({
  x1,
  y1,
  x2,
  y2,
  tone = 'muted',
  dashed = false,
  arrow = false,
}: Readonly<{
  x1: number
  y1: number
  x2: number
  y2: number
  tone?: Tone
  dashed?: boolean
  arrow?: boolean
}>) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={TONE_STROKE[tone]}
      strokeOpacity={tone === 'muted' ? 0.4 : 0.7}
      strokeWidth={1.4}
      strokeDasharray={dashed ? '3 4' : undefined}
      markerEnd={arrow ? wireArrowMarker(tone) : undefined}
    />
  )
}

function WireLabel({ x, y, children }: Readonly<{ x: number; y: number; children: string }>) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="fill-[var(--tp-text-muted)]"
      style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: '0.05em' }}
    >
      {children.toUpperCase()}
    </text>
  )
}

function TrafficGlyph({ x, y }: Readonly<{ x: number; y: number }>) {
  return (
    <g transform={`translate(${x} ${y})`} className="text-[var(--tp-blue)]">
      <circle cx="-16" cy="4" r="9" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="0" cy="-2" r="11" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="16" cy="4" r="9" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.1" />
    </g>
  )
}

function LockGlyph({ x, y }: Readonly<{ x: number; y: number }>) {
  return (
    <g transform={`translate(${x} ${y})`} className="text-[var(--tp-text-muted)]">
      <rect x="-6" y="0" width="12" height="9" rx="2" fill="var(--tp-surface)" stroke="currentColor" strokeWidth="1.3" />
      <path d="M-3.5 0v-2.5a3.5 3.5 0 0 1 7 0V0" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </g>
  )
}

const SINGLE_SERVER_CHIPS: ReadonlyArray<{ x: number; y: number; label: string; tone: Tone }> = [
  { x: 106, y: 124, label: 'Containers', tone: 'blue' },
  { x: 228, y: 124, label: 'Databases', tone: 'green' },
  { x: 106, y: 194, label: 'Websites', tone: 'blue' },
  { x: 228, y: 194, label: 'Jobs & cron', tone: 'green' },
]

/** Pattern 01 — everything on a single box. */
export function SingleServerDiagram() {
  return (
    <svg viewBox="0 0 440 270" className="h-auto w-full" aria-hidden>
      <TrafficGlyph x={220} y={34} />
      <text
        x="220"
        y="12"
        textAnchor="middle"
        className="fill-[var(--tp-text-muted)]"
        style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em' }}
      >
        YOUR USERS
      </text>
      <line x1="220" y1="48" x2="220" y2="76" stroke="var(--tp-text-muted)" strokeOpacity="0.4" strokeWidth="1.4" strokeDasharray="3 4" />
      <rect x="90" y="76" width="260" height="176" rx="20" fill="var(--tp-surface)" stroke="var(--tp-blue)" strokeWidth="1.75" />
      <circle cx="110" cy="96" r="3" fill="var(--tp-green)" />
      <circle cx="122" cy="96" r="3" fill="var(--tp-text-muted)" fillOpacity="0.35" />
      <circle cx="134" cy="96" r="3" fill="var(--tp-text-muted)" fillOpacity="0.35" />
      <text
        x="146"
        y="99"
        className="fill-[var(--tp-text-muted)]"
        style={{ fontSize: 8.5, fontFamily: 'var(--font-geist-mono)' }}
      >
        srv-01 · running
      </text>
      <line x1="106" y1="112" x2="334" y2="112" stroke="var(--tp-border)" strokeWidth="1" />
      {SINGLE_SERVER_CHIPS.map((chip) => (
        <g key={chip.label} transform={`translate(${chip.x} ${chip.y})`}>
          <rect width="106" height="56" rx="12" fill="var(--tp-surface-muted)" stroke="var(--tp-border)" strokeWidth="1" />
          <circle cx="16" cy="17" r="3.5" fill={chip.tone === 'green' ? 'var(--tp-green)' : 'var(--tp-blue)'} />
          <text x="16" y="40" className="fill-[var(--tp-text)]" style={{ fontSize: 9.5, fontWeight: 600 }}>
            {chip.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Pattern 02 — several servers, one datacenter, mesh + DB replica. */
export function DatacenterMeshDiagram() {
  const s1 = { x: 60, y: 50 }
  const s2 = { x: 330, y: 44 }
  const s3 = { x: 195, y: 116 }
  const centerOf = (n: { x: number; y: number }) => ({ x: n.x + 24, y: n.y + 17 })
  const c1 = centerOf(s1)
  const c2 = centerOf(s2)
  const c3 = centerOf(s3)

  return (
    <svg viewBox="0 0 440 270" className="h-auto w-full" aria-hidden>
      <WireDefs />
      <SiteFrame x={20} y={18} width={400} height={234} label="One datacenter" />
      <Wire x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} tone="blue" />
      <Wire x1={c1.x} y1={c1.y} x2={c3.x} y2={c3.y} tone="blue" />
      <Wire x1={c2.x} y1={c2.y} x2={c3.x} y2={c3.y} tone="blue" />
      <WireLabel x={219} y={45}>
        High-speed private link
      </WireLabel>
      <ServerNode x={s1.x} y={s1.y} tone="blue" label="app-01" />
      <ServerNode x={s2.x} y={s2.y} tone="blue" label="app-02" />
      <ServerNode x={s3.x} y={s3.y} tone="blue" label="app-03" />
      <DbNode x={132} y={176} tone="green" label="db-primary" />
      <DbNode x={266} y={176} tone="green" label="db-replica" />
      <Wire x1={168} y1={194} x2={266} y2={194} tone="green" dashed arrow />
      <WireLabel x={217} y={186}>
        Auto-sync
      </WireLabel>
      <text
        x="266"
        y="230"
        textAnchor="middle"
        className="fill-[var(--tp-green)]"
        style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.05em' }}
      >
        FAILOVER READY
      </text>
    </svg>
  )
}

/** Pattern 03 — frontend and backend split across two sites. */
export function SplitRegionsDiagram() {
  return (
    <svg viewBox="0 0 440 270" className="h-auto w-full" aria-hidden>
      <SiteFrame x={16} y={18} width={192} height={234} label="Frontend site" />
      <SiteFrame x={232} y={18} width={192} height={234} label="Backend site" />

      <TrafficGlyph x={112} y={54} />

      <ServerNode x={58} y={92} tone="blue" label="web-01" />
      <ServerNode x={112} y={150} tone="blue" label="web-02" />
      <Wire x1={82} y1={109} x2={136} y2={167} tone="blue" />

      <ServerNode x={258} y={80} tone="blue" label="api-01" />
      <ServerNode x={342} y={80} tone="blue" label="api-02" />
      <DbNode x={298} y={158} tone="green" label="managed db" />
      <Wire x1={282} y1={97} x2={316} y2={158} tone="green" />
      <Wire x1={366} y1={97} x2={334} y2={158} tone="green" />

      <Wire x1={208} y1={140} x2={232} y2={140} tone="muted" />
      <LockGlyph x={220} y={128} />
      <WireLabel x={220} y={116}>
        Private link
      </WireLabel>
    </svg>
  )
}

/** Pattern 04 — encrypted site-to-site mesh with regional read replicas. */
export function PrivateMeshDiagram() {
  const primary = { x: 172, y: 34 }
  const standby = { x: 214, y: 34 }
  const replicaA = { x: 56, y: 186 }
  const replicaB = { x: 320, y: 186 }
  const c = (n: { x: number; y: number }) => ({ x: n.x + 18, y: n.y + 18 })
  const cp = c(primary)
  const ca = c(replicaA)
  const cb = c(replicaB)

  return (
    <svg viewBox="0 0 440 270" className="h-auto w-full" aria-hidden>
      <WireDefs />
      <SiteFrame x={128} y={10} width={184} height={94} label="Primary site" />
      <SiteFrame x={8} y={148} width={182} height={104} label="Region A" />
      <SiteFrame x={250} y={148} width={182} height={104} label="Region B" />

      <Wire x1={cp.x - 6} y1={cp.y + 12} x2={ca.x} y2={ca.y} tone="green" dashed arrow />
      <Wire x1={cp.x + 24} y1={cp.y + 12} x2={cb.x} y2={cb.y} tone="green" dashed arrow />
      <Wire x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y} tone="muted" dashed />
      <WireLabel x={220} y={202}>
        Encrypted tunnel
      </WireLabel>

      <DbNode x={primary.x} y={primary.y} tone="green" label="primary" />
      <DbNode x={standby.x} y={standby.y} tone="green" label="standby" />
      <DbNode x={replicaA.x} y={replicaA.y} tone="green" label="read replica" />
      <DbNode x={replicaB.x} y={replicaB.y} tone="green" label="read replica" />

      <text
        x="220"
        y="132"
        textAnchor="middle"
        className="fill-[var(--tp-text-muted)]"
        style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.06em' }}
      >
        WRITES STAY HERE, REDUNDANT
      </text>
    </svg>
  )
}

const FREEFORM_NODES: ReadonlyArray<{
  type: 'server' | 'db'
  x: number
  y: number
  tone: Tone
}> = [
  { type: 'server', x: 34, y: 26, tone: 'blue' },
  { type: 'db', x: 336, y: 16, tone: 'green' },
  { type: 'server', x: 172, y: 92, tone: 'blue' },
  { type: 'db', x: 300, y: 128, tone: 'green' },
  { type: 'server', x: 44, y: 172, tone: 'muted' },
  { type: 'db', x: 196, y: 202, tone: 'green' },
  { type: 'server', x: 340, y: 196, tone: 'blue' },
]

function nodeCenter(node: (typeof FREEFORM_NODES)[number]) {
  return node.type === 'server' ? { x: node.x + 24, y: node.y + 17 } : { x: node.x + 18, y: node.y + 18 }
}

/** Pattern N — a deliberately loose, asymmetric constellation. Anything goes. */
export function FreeformDiagram() {
  const [n0, n1, n2, n3, n4, n5, n6] = FREEFORM_NODES
  const c0 = nodeCenter(n0)
  const c1 = nodeCenter(n1)
  const c2 = nodeCenter(n2)
  const c3 = nodeCenter(n3)
  const c4 = nodeCenter(n4)
  const c5 = nodeCenter(n5)
  const c6 = nodeCenter(n6)

  return (
    <svg viewBox="0 0 440 270" className="h-auto w-full" aria-hidden>
      <text
        x="220"
        y="185"
        textAnchor="middle"
        className="fill-[var(--tp-border)]"
        style={{ fontSize: 180, fontWeight: 700 }}
      >
        &#8734;
      </text>
      <Wire x1={c0.x} y1={c0.y} x2={c2.x} y2={c2.y} tone="blue" />
      <Wire x1={c2.x} y1={c2.y} x2={c1.x} y2={c1.y} tone="green" dashed />
      <Wire x1={c2.x} y1={c2.y} x2={c3.x} y2={c3.y} tone="muted" />
      <Wire x1={c3.x} y1={c3.y} x2={c6.x} y2={c6.y} tone="blue" dashed />
      <Wire x1={c4.x} y1={c4.y} x2={c2.x} y2={c2.y} tone="muted" dashed />
      <Wire x1={c4.x} y1={c4.y} x2={c5.x} y2={c5.y} tone="green" />
      <Wire x1={c5.x} y1={c5.y} x2={c3.x} y2={c3.y} tone="muted" dashed />
      {FREEFORM_NODES.map((node) =>
        node.type === 'server' ? (
          <ServerNode key={`${node.x}-${node.y}`} x={node.x} y={node.y} tone={node.tone} />
        ) : (
          <DbNode key={`${node.x}-${node.y}`} x={node.x} y={node.y} tone={node.tone} />
        ),
      )}
    </svg>
  )
}
