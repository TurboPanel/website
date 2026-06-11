import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ThemeToggleButton } from '@/components/ThemeToggleButton'

type ActivePage = 'overview' | 'roadmap' | 'pricing' | 'docs'

type SiteHeaderProps = {
  active?: ActivePage
}

const LINKS = [
  { href: '/', label: 'Overview', key: 'overview' },
  { href: '/pricing', label: 'Pricing', key: 'pricing' },
  { href: '/roadmap', label: 'Roadmap', key: 'roadmap' },
  { href: '/docs', label: 'Docs', key: 'docs' },
] as const

function navClass(active: boolean) {
  if (active) {
    return 'rounded-md bg-[var(--tp-surface-muted)] px-3 py-2 text-[var(--tp-text)]'
  }

  return 'rounded-md px-3 py-2 text-[var(--tp-text-muted)] transition-colors hover:bg-[var(--tp-surface-muted)] hover:text-[var(--tp-text)]'
}

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="border-b border-[var(--tp-border)] bg-[var(--tp-bg)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="TurboPanel Home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 text-sm font-medium">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={navClass(active === link.key)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggleButton compact />
        </div>
      </div>
    </header>
  )
}
