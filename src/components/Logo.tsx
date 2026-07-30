/** Website logotype — T mark + upright “TurboPanel” wordmark. */

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
const INK_LEFT = 50 / 680

export function Logo({ compact = false, markOnly = false }: LogoProps) {
  const height = compact ? 28 : 36
  const markWidth = Math.round(height * MARK_ASPECT)
  const cropLeft = Math.round(markWidth * INK_LEFT)
  const markDisplayWidth = markWidth - cropLeft
  const wordSize = compact ? 17 : 21

  return (
    <span
      className="inline-flex items-center gap-2.5 transition-[gap] duration-200 ease-out motion-reduce:transition-none"
    >
      <span
        className="relative inline-block shrink-0 overflow-hidden transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: markDisplayWidth, height }}
      >
        {/* Decorative; parent Link carries “TurboPanel” accessible name. */}
        <img
          src="/brand/turbopanel-logo.svg"
          alt=""
          width={680}
          height={520}
          className="absolute top-0 h-full w-auto object-contain object-left"
          style={{ left: -cropLeft, width: markWidth, height }}
          aria-hidden
        />
      </span>
      {markOnly ? null : (
        <span
          className="tp-display font-semibold tracking-[-0.03em] text-[var(--tp-text)] transition-[font-size] duration-200 ease-out motion-reduce:transition-none"
          style={{ fontSize: wordSize, lineHeight: 1 }}
          aria-hidden
        >
          TurboPanel
        </span>
      )}
    </span>
  )
}
