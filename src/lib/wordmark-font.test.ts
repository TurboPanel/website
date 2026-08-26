import { Plus_Jakarta_Sans } from 'next/font/google'
import { describe, expect, it, vi } from 'vitest'
import { wordmarkFont } from '@/lib/wordmark-font'

vi.mock('next/font/google', () => ({
  Plus_Jakarta_Sans: vi.fn((options: {
    subsets: string[]
    weight: string[]
    style: string[]
    variable: string
  }) => ({
    className: 'mock-wordmark-font',
    style: { fontFamily: 'Plus Jakarta Sans' },
    variable: options.variable,
  })),
}))

describe('wordmarkFont', () => {
  it('loads Plus Jakarta ExtraBold Italic as --font-wordmark', () => {
    const loaded = vi.mocked(Plus_Jakarta_Sans)
    if (loaded.mock.calls.length !== 1) {
      throw new TypeError('expected Plus_Jakarta_Sans to be called once')
    }
    const [options] = loaded.mock.calls[0]
    if (!options) {
      throw new TypeError('expected Plus_Jakarta_Sans options')
    }

    expect(options).toEqual({
      subsets: ['latin'],
      weight: ['800'],
      style: ['italic'],
      variable: '--font-wordmark',
    })
    expect(wordmarkFont.variable).toBe('--font-wordmark')
    expect(wordmarkFont.className).toBe('mock-wordmark-font')
  })
})
