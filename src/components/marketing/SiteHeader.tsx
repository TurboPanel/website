import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ThemeToggleButton } from '@/components/ThemeToggleButton'
import { MobileNavMenu } from '@/components/marketing/MobileNavMenu'
import { SignInButton } from '@/components/marketing/SignInButton'
import { SocialNavLinks } from '@/components/marketing/SocialNavLinks'

export type ActivePage = 'overview' | 'setups' | 'roadmap' | 'pricing' | 'docs' | 'open-source' | 'security' | 'changelog'

type SiteHeaderProps = Readonly<{
  active?: ActivePage
  /** Smaller paddings/type when sticky chrome is scrolled. */
  compact?: boolean
}>

const LINKS = [
  { href: '/', label: 'Overview', key: 'overview' },
  { href: '/setups', label: 'Patterns', key: 'setups' },
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
    <header className="relative bg-transparent">
      <div
        className={`tp-brand-stripe absolute inset-x-0 top-0 h-[2px] opacity-90 ${compact ? 'opacity-70' : ''}`}
        aria-hidden
      />
      {/*
        Match MarketingSection / MarketingHero: horizontal padding on the outer
        shell, then an unpadded max-w-6xl so the logo shares the page left edge.
      */}
      <div className="px-4 sm:px-6">
        <div
          className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-2 transition-[padding,gap] duration-200 ease-out motion-reduce:transition-none sm:gap-3 ${
            compact ? 'py-2' : 'py-4'
          }`}
        >
          <Link href="/" className="flex items-center" aria-label="TurboPanel Home">
            <Logo compact={compact} markOnly={compact} />
          </Link>
          <div
            className={`flex items-center transition-[gap] duration-200 ease-out motion-reduce:transition-none ${
              compact ? 'gap-1.5 sm:gap-2' : 'gap-2 sm:gap-3'
            }`}
          >
            {/*
              The full row (nav + CTA + social + toggle) needs ~800px next to
              the logo, so everything except the CTA collapses into
              `MobileNavMenu` below `lg`.
            */}
            <nav
              className={`hidden items-center gap-0.5 font-medium transition-[font-size] duration-200 ease-out motion-reduce:transition-none lg:flex ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active === link.key ? 'page' : undefined}
                  className={navClass(active === link.key, compact)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/*
              Logo lockup is ~190px wide, so logo + CTA + trigger stops fitting
              below ~360px. Narrower phones reach Sign in from the panel instead.
            */}
            <div className="hidden min-[360px]:flex">
              <SignInButton compact={compact} />
            </div>
            <div
              className={`mx-0.5 hidden w-px bg-[var(--tp-border)] lg:block ${compact ? 'h-4' : 'h-5'}`}
              aria-hidden
            />
            <div className="hidden lg:flex">
              <SocialNavLinks compact={compact} />
            </div>
            <div className="hidden lg:block">
              <ThemeToggleButton compact={compact} />
            </div>
            <MobileNavMenu links={LINKS} activeKey={active} compact={compact} />
          </div>
        </div>
      </div>
    </header>
  )
}
