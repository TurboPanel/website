'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'

/**
 * Wraps children with Fumadocs RootProvider so FrameworkProvider (Next.js Link/router)
 * and theme/search context are available. Required for /docs and other Fumadocs layouts.
 */
export function ClientRootProvider({
  children,
  i18n,
  theme,
}: Readonly<{
  children: React.ReactNode
  i18n?: { locale: string; translations?: { search?: string } }
  theme?: { enabled: boolean }
}>) {
  return (
    <RootProvider i18n={i18n} theme={theme}>
      {children}
    </RootProvider>
  )
}
