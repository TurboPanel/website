/** Website logotype — T mark + italic “urboPanel” under the blue crossbar (same lockup as UI). */

type LogoProps = Readonly<{
  compact?: boolean
  /** Hide the wordmark (icon-only). */
  markOnly?: boolean
}>

/** Mark viewBox 680×520. */
const MARK_ASPECT = 680 / 520
/**
 * Left clear-space in the downloadable mark (group translate + green-bar tip)
 * before ink — crop it in chrome so the mark aligns with content, not the pad.
 */
const INK_LEFT = 42 / 680
/** Empty pad above/below ink in the mark viewBox. */
const INK_PAD = 75 / 520
/** Stem tip → top of blue/green bars. */
const INK_HEIGHT = 370 / 520
/** Matches console — wordmark under the bar, not full T height. */
const ASCENDER_RATIO = 1.02
/** Extra optical shrink so “urboPanel” stays under the T’s crossbar, not past it. */
const WORDMARK_SIZE_TRIM_PX = 4
/** Draw the T a bit larger than the wordmark’s size basis so the mark leads. */
const MARK_SCALE = 1.12
/** Baseline trim for Plus Jakarta at `lineHeight === fontSize` (console-measured). */
const BASELINE_TRIM_RATIO = 0.0851
/** Optical nudge: lift wordmark above the geometric T-tip baseline. */
const WORDMARK_BASELINE_LIFT_PX = 3
/**
 * Fraction of mark width where “urboPanel” starts (right of the stem, under the
 * blue bar).
 */
const WORD_LEFT_RATIO = 0.62
/**
 * Extra oblique beyond italic so the wordmark matches the T lean
 * (mark edges ~atan(48/120) ≈ 22°; italic alone ~12°).
 */
const WORDMARK_SKEW = '-14deg'
/** Visible letters after the T mark; a11y label stays “TurboPanel”. */
const WORDMARK = 'urboPanel'

export function Logo({ compact = false, markOnly = false }: LogoProps) {
  const size = compact ? 28 : 36
  const height = Math.round(size * MARK_SCALE)
  const markWidth = Math.round(height * MARK_ASPECT)
  const cropLeft = Math.round(markWidth * INK_LEFT)
  /** Sized from `size` (not the boosted mark) so the T stays dominant. */
  const wordSize = Math.max(
    1,
    Math.round((size * INK_HEIGHT) / ASCENDER_RATIO) - WORDMARK_SIZE_TRIM_PX,
  )
  const wordLeft = Math.round(markWidth * WORD_LEFT_RATIO - cropLeft)
  const wordBottom = Math.round(
    height * INK_PAD - wordSize * BASELINE_TRIM_RATIO + WORDMARK_BASELINE_LIFT_PX,
  )
  const markDisplayWidth = markWidth - cropLeft
  const width = markOnly
    ? markDisplayWidth
    : Math.max(markDisplayWidth, wordLeft + Math.round(wordSize * 5.5))

  return (
    <span
      className="relative inline-block overflow-visible transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
      style={{ width, height }}
    >
      {/*
        Full mark (including the blue crossbar shelf) — do not overflow-clip the
        arm; “urboPanel” tucks under it. Only shift left to drop clear-space pad.
      */}
      <img
        src="/brand/turbopanel-logo.svg"
        alt=""
        width={680}
        height={520}
        className="pointer-events-none absolute top-0 h-full w-auto object-contain object-left"
        style={{ left: -cropLeft, width: markWidth, height }}
        aria-hidden
      />
      {markOnly ? null : (
        <span
          className="tp-display pointer-events-none absolute italic font-bold tracking-[0.02em] text-[var(--tp-text)] transition-[font-size,left,bottom] duration-200 ease-out motion-reduce:transition-none"
          style={{
            left: wordLeft,
            bottom: wordBottom,
            fontSize: wordSize,
            lineHeight: 1,
            transform: `skewX(${WORDMARK_SKEW})`,
            transformOrigin: 'left bottom',
          }}
          aria-hidden
        >
          {WORDMARK}
        </span>
      )}
    </span>
  )
}
