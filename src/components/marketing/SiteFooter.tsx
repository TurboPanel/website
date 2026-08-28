import Link from 'next/link'
import { Logo } from '@/components/Logo'

const FOOTER_LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/setups', label: 'Architecture patterns' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/open-source', label: 'Open source' },
  { href: '/security', label: 'Security' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/docs', label: 'Docs' },
  { href: '/docs/api', label: 'API reference' },
  { href: '/about/logo', label: 'Logo & brand' },
] as const

export function SiteFooter() {
  return (
    <footer className="tp-glass border-x-0 border-b-0 rounded-none border-t border-[var(--tp-glass-border)] px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Logo compact />
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--tp-text-muted)]">
            Everything you host. One place to run it.
          </p>
        </div>
        <nav
          className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:justify-items-end"
          aria-label="Footer"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-[var(--tp-text-muted)] transition-colors duration-200 hover:text-[var(--tp-text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-[var(--tp-border)] pt-6 text-xs text-[var(--tp-text-muted)]">
        <p>© {new Date().getFullYear()} TurboPanel</p>
        <p>Connect a server. Ship something great.</p>
      </div>
    </footer>
  )
}
