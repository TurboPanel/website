import localFont from 'next/font/local'
import { describe, expect, it, vi } from 'vitest'
import { wordmarkFont } from '@/lib/wordmark-font'

vi.mock('next/font/local', () => ({
  default: vi.fn((options: { variable: string }) => ({
    className: 'mock-exo-2',
    style: { fontFamily: 'Exo 2' },
    variable: options.variable,
  })),
}))

describe('wordmarkFont', () => {
  it('loads the single self-hosted Exo 2 Black Italic face', () => {
    const loaded = vi.mocked(localFont)
    expect(loaded.mock.calls).toHaveLength(1)
    const [options] = loaded.mock.calls[0]!
    expect(options).toEqual({
      src: '../fonts/exo-2-latin-900-italic.woff2',
      weight: '900',
      style: 'italic',
      variable: '--font-wordmark',
      display: 'swap',
    })
    expect(wordmarkFont.variable).toBe('--font-wordmark')
    expect(wordmarkFont.className).toBe('mock-exo-2')
  })
})
