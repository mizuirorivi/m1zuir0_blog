import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import localFont from 'next/font/local'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import ConditionalLayout from '@/components/layout/ConditionalHeader'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'
import { LanguageProvider } from '@/lib/LanguageContext'
import LanguageAwareSearchProvider from '@/components/i18n/LanguageAwareSearchProvider'
import EnhancedBehaviorTracker from '@/components/analytics/EnhancedBehaviorTracker'

const arianGeralde = localFont({
  src: '../public/fonts/Arian Geralde.otf',
  display: 'swap',
  variable: '--font-arian-geralde',
})

const dunkinSansBold = localFont({
  src: '../public/fonts/Dunkin Sans Bold.otf',
  display: 'swap',
  variable: '--font-dunkin-sans-bold',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        alt: siteMetadata.socialBannerAlt,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  icons: {
    icon: '/static/favicons/favicon.ico',
    shortcut: '/static/favicons/favicon-16x16.png',
    apple: '/static/favicons/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${arianGeralde.variable} ${dunkinSansBold.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/fonts/Arian Geralde.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Dunkin Sans Bold.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <body className="bg-background text-foreground overflow-x-hidden pl-[calc(100vw-100%)] antialiased">
        <WebVitalsReporter />
        <EnhancedBehaviorTracker />
        <ThemeProviders>
          <LanguageProvider>
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
            <LanguageAwareSearchProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </LanguageAwareSearchProvider>
          </LanguageProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
