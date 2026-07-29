import { DiscordIcon, GithubIcon } from '@/components/icons'

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/turbopanel',
    label: 'GitHub',
    Icon: GithubIcon,
  },
  {
    href: '/discord',
    label: 'Discord',
    Icon: DiscordIcon,
  },
] as const

type SocialNavLinksProps = Readonly<{
  compact?: boolean
}>

export function SocialNavLinks({ compact = false }: SocialNavLinksProps) {
  return (
    <div className="flex items-center gap-1">
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`inline-flex items-center justify-center rounded-md text-[var(--tp-text-muted)] transition-[colors,width,height] hover:bg-[var(--tp-surface-muted)] hover:text-[var(--tp-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tp-ring)] ${
            compact ? 'h-7 w-7' : 'h-9 w-9'
          }`}
        >
          <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </a>
      ))}
    </div>
  )
}
