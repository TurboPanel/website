import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ThemeToggleButton } from '@/components/ThemeToggleButton'
import { SignInButton } from '@/components/marketing/SignInButton'
import { SocialNavLinks } from '@/components/marketing/SocialNavLinks'

export type ActivePage = 'overview' | 'roadmap' | 'pricing' | 'docs'

type SiteHeaderProps = Readonly<{
  active?: ActivePage
  /** Smaller paddings/type when sticky chrome is scrolled. */
  compact?: boolean
}>

const LINKS = [
  { href: '/', label: 'Overview', key: 'overview' },
  { href: '/pricing', label: 'Pricing', key: 'pricing' },
  { href: '/roadmap', label: 'Roadmap', key: 'roadmap' },
  { href: '/docs', label: 'Docs', key: 'docs' },
] as const

function navClass(active: boolean, compact: boolean) {
  const pad = compact ? 'px-2 py-0.5' : 'px-3 py-2'
  if (active) {
    return `rounded-md bg-[var(--tp-surface-muted)] ${pad} text-[var(--tp-text)]`
  }

  return `rounded-md ${pad} text-[var(--tp-text-muted)] transition-colors hover:bg-[var(--tp-surface-muted)] hover:text-[var(--tp-text)]`
}

export function SiteHeader({ active, compact = false }: SiteHeaderProps) {
  return (
    <header className="bg-transparent">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 transition-[padding,gap] duration-200 ease-out motion-reduce:transition-none sm:gap-3 sm:px-6 ${
          compact ? 'py-1.5' : 'py-4'
        }`}
      >
        <Link href="/" className="flex items-center" aria-label="TurboPanel Home">
          <Logo compact={compact} />
        </Link>
        <div
          className={`flex items-center transition-[gap] duration-200 ease-out motion-reduce:transition-none ${
            compact ? 'gap-1.5 sm:gap-2' : 'gap-2 sm:gap-3'
          }`}
        >
          <nav
            className={`flex items-center gap-0.5 font-medium transition-[font-size] duration-200 ease-out motion-reduce:transition-none ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navClass(active === link.key, compact)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <SignInButton compact={compact} />
          <div
            className={`mx-0.5 hidden w-px bg-[var(--tp-border)] sm:block ${compact ? 'h-4' : 'h-5'}`}
            aria-hidden
          />
          <SocialNavLinks compact={compact} />
          <ThemeToggleButton compact={compact} />
        </div>
      </div>
    </header>
  )
}
