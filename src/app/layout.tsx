import './globals.css'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import Header from '@/components/Header'
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics'
import GoogleAdSense from '@/components/Analytics/GoogleAdSense'
import WebVitals from '@/components/Analytics/WebVitals'
import ScrollToTop from '@/components/ScrollToTop'
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider'
import StructuredData from '@/components/StructuredData'
import FontAwesomeInit from '@/components/FontAwesome/FontAwesomeInit'
import CacheChecker from '@/components/CacheChecker'
// Google Fonts will be loaded via CDN in the head section

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.title,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/api/manifest.json',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.title,
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard Font CDN with performance optimization */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Pretendard Variable Font - Primary Korean font */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />

        {/* JetBrains Mono for code blocks */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Fallback fonts for compatibility */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased transition-colors duration-300"
        style={{
          backgroundColor: 'var(--background, #ffffff)',
          color: 'var(--foreground, #0f172a)',
          fontFamily:
            'var(--font-korean, "Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", -apple-system, BlinkMacSystemFont, system-ui, sans-serif)',
        }}
      >
        <CommandPaletteProvider>
          <FontAwesomeInit />
          <CacheChecker />
          <GoogleAnalytics />
          <GoogleAdSense />
          <WebVitals />
          <StructuredData type="website" />
          <Header siteTitle={siteConfig.title} />
          <div id="content">
            <main>{children}</main>
            <footer>
              © {new Date().getFullYear()} {siteConfig.author}, Built with{' '}
              <a href="https://nextjs.org">Next.js</a>
            </footer>
          </div>

          <ScrollToTop />
        </CommandPaletteProvider>
      </body>
    </html>
  )
}
