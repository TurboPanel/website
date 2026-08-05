/** Website logotype — T mark + Plus Jakarta ExtraBold Italic “urboPanel”. */

import {
  TURBOPANEL_MARK_INK,
  websiteWordmarkLockup,
} from '@/lib/wordmark-lockup'
import { wordmarkFont } from '@/lib/wordmark-font'

type LogoProps = Readonly<{
  compact?: boolean
  /** Hide the wordmark (icon-only). */
  markOnly?: boolean
}>

export function Logo({ compact = false, markOnly = false }: LogoProps) {
  const lockup = websiteWordmarkLockup(compact, markOnly)

  return (
    <span
      className="relative inline-block overflow-visible transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
      style={{ width: lockup.lockupWidth, height: lockup.lockupHeight }}
    >
      <img
        src="/brand/turbopanel-logo.svg"
        alt=""
        width={TURBOPANEL_MARK_INK.width}
        height={TURBOPANEL_MARK_INK.height}
        className="pointer-events-none absolute bottom-0 left-0"
        style={{
          width: lockup.markWidth,
          height: lockup.markRenderHeight,
          objectFit: 'fill',
        }}
        aria-hidden
      />
      {markOnly ? null : (
        <span
          className={`${wordmarkFont.className} pointer-events-none absolute text-[var(--tp-text)] transition-[font-size,left,bottom] duration-200 ease-out motion-reduce:transition-none`}
          style={{
            left: lockup.wordLeft,
            bottom: lockup.wordBottomOffset,
            fontSize: lockup.wordSize,
            lineHeight: 1,
            letterSpacing: `${lockup.letterSpacingEm}em`,
            display: 'block',
            transform: `skewX(${lockup.skew})`,
            transformOrigin: 'left bottom',
          }}
          aria-hidden
        >
          {lockup.text}
        </span>
      )}
    </span>
  )
}
