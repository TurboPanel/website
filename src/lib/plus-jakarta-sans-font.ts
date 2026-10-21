import localFont from 'next/font/local'

/**
 * Single next/font loader for Plus Jakarta Sans (Turbopack allows one config per family).
 * Display typography and the wordmark share this face; wordmark styling is CSS (weight/style).
 * Self-hosted (latin subset, variable weight) so the build needs no network; see LICENSES/.
 */
export const plusJakartaSans = localFont({
  src: [
    {
      path: '../fonts/plus-jakarta-sans-latin-wght-normal.woff2',
      weight: '500 800',
      style: 'normal',
    },
    {
      path: '../fonts/plus-jakarta-sans-latin-wght-italic.woff2',
      weight: '500 800',
      style: 'italic',
    },
  ],
  variable: '--font-display',
  display: 'swap',
})
