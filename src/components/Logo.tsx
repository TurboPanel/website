/** Website logotype — T mark with italic “urboPanel” matching the mark’s full height. */

type LogoProps = Readonly<{
  compact?: boolean
  /** Hide the wordmark (icon-only). */
  markOnly?: boolean
}>

/** Visible letters after the T mark; full name stays in aria-labels. */
const WORDMARK = 'urboPanel'

/** Mark viewBox 680×520. */
const MARK_ASPECT = 680 / 520
/** Empty pad above/below ink in the mark viewBox. */
const INK_PAD = 80 / 520
/** Stem tip → top of blue/green bars. */
const INK_HEIGHT = 360 / 520
/**
 * Plus Jakarta Sans ExtraBold Italic: `actualBoundingBoxAscent / fontSize`
 * for tall letters (P, l, b). True measured match to the T ink height is
 * ~0.757; we size noticeably smaller (~1.02) so the wordmark sits optically
 * under the T rather than matching its full weight.
 */
const ASCENDER_RATIO = 1.02
/**
 * Baseline offset **below** the CSS box’s bottom edge, as a fraction of
 * font-size — for this face at `line-height: 1`. NOT `fontBoundingBoxDescent
 * / fontSize` (that overshoots by ~2.5x): with `line-height: 1` shorter than
 * the font’s natural em-box (ascent+descent), the browser applies negative
 * half-leading, pulling the baseline up toward the box’s top. Measured:
 * `halfLeading + fontBoundingBoxDescent) / fontSize` where
 * `halfLeading = fontSize - (fontBoundingBoxAscent + fontBoundingBoxDescent)`.
 */
const BASELINE_TRIM_RATIO = 0.0851
/** Optical nudge: lift wordmark above the geometric T-tip baseline. */
const WORDMARK_BASELINE_LIFT_PX = 2

/**
 * Extra oblique beyond the italic face so the wordmark matches the T lean
 * (mark edges are ~atan(40/100) ≈ 22°; italic alone is ~12°).
 */
const WORDMARK_SKEW = 'skewX(-14deg)'

export function Logo({ compact = false, markOnly = false }: LogoProps) {
  const height = compact ? 34 : 48
  const markWidth = Math.round(height * MARK_ASPECT)
  /** Under the blue bar, right of the stem — a little air after the T. */
  const wordLeft = Math.round(markWidth * 0.6)
  /** Tall letters (P, l) span the same ink height as the T mark. */
  const wordSize = Math.round((height * INK_HEIGHT) / ASCENDER_RATIO)
  /**
   * Plant the alphabetic baseline on the T stem tip, then lift a couple px for
   * optical balance. Descent may hang a few px below the mark box — keep
   * overflow visible.
   */
  const wordBottom = Math.round(
    height * INK_PAD - wordSize * BASELINE_TRIM_RATIO + WORDMARK_BASELINE_LIFT_PX,
  )
  const width = markOnly
    ? markWidth
    : Math.max(markWidth, wordLeft + Math.round(wordSize * 5.9))

  return (
    <span
      className="relative inline-block overflow-visible transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
      style={{ width, height }}
    >
      {/* Decorative; parent Link carries “TurboPanel” accessible name. */}
      <img
        src="/brand/turbopanel-logo.svg"
        alt=""
        width={680}
        height={520}
        className="absolute left-0 top-0 h-full w-auto object-contain object-left"
        style={{ width: markWidth, height }}
        aria-hidden
      />
      {markOnly ? null : (
        <span
          className="tp-display pointer-events-none absolute font-extrabold italic text-[var(--tp-text)]"
          style={{
            left: wordLeft,
            bottom: wordBottom,
            fontSize: wordSize,
            lineHeight: 1,
            letterSpacing: '0.04em',
            transform: WORDMARK_SKEW,
            transformOrigin: 'left bottom',
          }}
        >
          {WORDMARK}
        </span>
      )}
    </span>
  )
}
