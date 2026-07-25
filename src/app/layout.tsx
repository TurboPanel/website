import type { Metadata } from 'next'
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ClientRootProvider } from '@/components/ClientRootProvider'
import { Providers } from '@/components/Providers'
import { StickySiteChrome } from '@/components/StickySiteChrome'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const display = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'TurboPanel',
  description: 'Web Hosting Control Panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
      >
        <Providers>
          <StickySiteChrome />
          <ClientRootProvider
            i18n={{ locale: 'en', translations: { search: 'Search documentation' } }}
            theme={{ enabled: false }}
          >
            {children}
          </ClientRootProvider>
        </Providers>
      </body>
    </html>
  )
}
