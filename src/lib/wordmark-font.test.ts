import localFont from 'next/font/local'
import { describe, expect, it, vi } from 'vitest'
import { wordmarkFont } from '@/lib/wordmark-font'

vi.mock('next/font/local', () => ({
  default: vi.fn((options: { variable: string }) => ({
    className: 'mock-figtree',
    style: { fontFamily: 'Figtree' },
    variable: options.variable,
  })),
}))

describe('wordmarkFont', () => {
  it('loads the single self-hosted Figtree ExtraBold Italic face', () => {
    const loaded = vi.mocked(localFont)
    expect(loaded.mock.calls).toHaveLength(1)
    const [options] = loaded.mock.calls[0]!
    expect(options).toEqual({
      src: '../fonts/figtree-latin-800-italic.woff2',
      weight: '800',
      style: 'italic',
      variable: '--font-wordmark',
      display: 'swap',
    })
    expect(wordmarkFont.variable).toBe('--font-wordmark')
    expect(wordmarkFont.className).toBe('mock-figtree')
  })
})
