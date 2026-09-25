import { Plus_Jakarta_Sans } from 'next/font/google'

/**
 * Single next/font loader for Plus Jakarta Sans (Turbopack allows one config per family).
 * Display typography and the wordmark share this face; wordmark styling is CSS (weight/style).
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})
