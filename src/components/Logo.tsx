/** Website logotype — T mark + Plus Jakarta ExtraBold Italic “urboPanel”. */

import {
  TURBOPANEL_MARK_INK,
  websiteWordmarkLockup,
} from '@/lib/wordmark-lockup'
import { wordmarkFont } from '@/lib/wordmark-font'

type LogoProps = Readonly<{
  compact?: boolean
  /** Fade out the wordmark and shrink to the T mark only. */
  markOnly?: boolean
}>

export function Logo({ compact = false, markOnly = false }: LogoProps) {
  const lockup = websiteWordmarkLockup(compact, markOnly)
  // Keep full-lockup word geometry while fading so position stays stable.
  const wordLockup = websiteWordmarkLockup(compact, false)

  return (
    <span
      className="relative inline-block overflow-visible transition-[width,height] duration-100 ease-out motion-reduce:transition-none"
      style={{ width: lockup.lockupWidth, height: lockup.lockupHeight }}
    >
      <img
        src="/brand/turbopanel-logo.svg"
        alt=""
        width={TURBOPANEL_MARK_INK.width}
        height={TURBOPANEL_MARK_INK.height}
        className="pointer-events-none absolute bottom-0 left-0 transition-[width,height] duration-100 ease-out motion-reduce:transition-none"
        style={{
          width: lockup.markWidth,
          height: lockup.markRenderHeight,
          objectFit: 'fill',
        }}
        aria-hidden
      />
      <span
        className={`${wordmarkFont.className} pointer-events-none absolute text-[var(--tp-text)] transition-[opacity,transform,font-size,left,bottom] duration-75 ease-out motion-reduce:transition-none`}
        style={{
          opacity: markOnly ? 0 : 1,
          left: wordLockup.wordLeft,
          bottom: wordLockup.wordBottomOffset,
          fontSize: wordLockup.wordSize,
          lineHeight: 1,
          letterSpacing: `${wordLockup.letterSpacingEm}em`,
          display: 'block',
          // Snap under the T: fade + short left tuck (skew preserved).
          transform: markOnly
            ? `skewX(${wordLockup.skew}) translateX(-6px)`
            : `skewX(${wordLockup.skew}) translateX(0)`,
          transformOrigin: 'left bottom',
        }}
        aria-hidden
      >
        {wordLockup.text}
      </span>
    </span>
  )
}
