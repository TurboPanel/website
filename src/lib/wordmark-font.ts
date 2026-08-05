import { Plus_Jakarta_Sans } from 'next/font/google'

/**
 * Lockup-only face (ExtraBold Italic). Native slant + light CSS skew to match
 * the T mark (~22°); less synthetic oblique than Outfit Black + full skew.
 */
export const wordmarkFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['800'],
  style: ['italic'],
  variable: '--font-wordmark',
})
