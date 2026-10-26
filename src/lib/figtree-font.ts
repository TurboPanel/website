import localFont from 'next/font/local'

/**
 * Figtree ExtraBold Italic — the wordmark face for “urboPanel” under the T mark.
 * One static weight (800 italic, latin subset) so the chrome ships ~12 KB and
 * no request leaves the site; see LICENSES/OFL-1.1-Figtree.txt. Top-level
 * weight and style make `className` carry them, so callers set only the family.
 */
export const figtreeWordmark = localFont({
  src: '../fonts/figtree-latin-800-italic.woff2',
  weight: '800',
  style: 'italic',
  variable: '--font-wordmark',
  display: 'swap',
})
