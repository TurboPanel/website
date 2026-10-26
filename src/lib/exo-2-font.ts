import localFont from 'next/font/local'

/**
 * Exo 2 Black Italic — the wordmark face for “urboPanel” under the T mark.
 * One static weight (900 italic, latin subset) so the chrome ships ~18 KB and
 * no request leaves the site; see LICENSES/OFL-1.1-Exo-2.txt. Top-level weight
 * and style make `className` carry them, so callers set only the family.
 */
export const exo2Wordmark = localFont({
  src: '../fonts/exo-2-latin-900-italic.woff2',
  weight: '900',
  style: 'italic',
  variable: '--font-wordmark',
  display: 'swap',
})
