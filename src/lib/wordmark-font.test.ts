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
    className: 'mock-plus-jakarta',
    style: { fontFamily: 'Plus Jakarta Sans' },
    variable: options.variable,
  })),
}))

describe('wordmarkFont', () => {
  it('reuses the single Plus Jakarta loader used for display', () => {
    const loaded = vi.mocked(Plus_Jakarta_Sans)
    expect(loaded.mock.calls.length).toBe(1)
    const [options] = loaded.mock.calls[0]!
    expect(options).toEqual({
      subsets: ['latin'],
      weight: ['500', '600', '700', '800'],
      style: ['normal', 'italic'],
      variable: '--font-display',
    })
    expect(wordmarkFont.variable).toBe('--font-display')
    expect(wordmarkFont.className).toBe('mock-plus-jakarta')
  })
})
