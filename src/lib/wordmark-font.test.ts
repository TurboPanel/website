import localFont from 'next/font/local'
import { describe, expect, it, vi } from 'vitest'
import { wordmarkFont } from '@/lib/wordmark-font'

vi.mock('next/font/local', () => ({
  default: vi.fn((options: { variable: string }) => ({
    className: 'mock-plus-jakarta',
    style: { fontFamily: 'Plus Jakarta Sans' },
    variable: options.variable,
  })),
}))

describe('wordmarkFont', () => {
  it('reuses the single self-hosted Plus Jakarta loader used for display', () => {
    const loaded = vi.mocked(localFont)
    expect(loaded.mock.calls).toHaveLength(1)
    const [options] = loaded.mock.calls[0]!
    expect(options).toEqual({
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
    expect(wordmarkFont.variable).toBe('--font-display')
    expect(wordmarkFont.className).toBe('mock-plus-jakarta')
  })
})
