import './globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { siteConfig } from '@/lib/config'
import Header from '@/components/Header'
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider'

// Lazy load non-critical components for better initial page load
const GoogleAnalytics = dynamic(
  () => import('@/components/Analytics/GoogleAnalytics'),
  { ssr: false }
)
const GoogleAdSense = dynamic(
  () => import('@/components/Analytics/GoogleAdSense'),
  { ssr: false }
)
const WebVitals = dynamic(() => import('@/components/Analytics/WebVitals'), {
  ssr: false,
})
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
})
const MobileBottomNav = dynamic(() => import('@/components/MobileBottomNav'), {
  ssr: false,
})
const StructuredData = dynamic(() => import('@/components/StructuredData'))
const FontAwesomeInit = dynamic(
  () => import('@/components/FontAwesome/FontAwesomeInit'),
  { ssr: false }
)
const CacheChecker = dynamic(() => import('@/components/CacheChecker'), {
  ssr: false,
})
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
    'google-adsense-account': 'ca-pub-5518615618879832',
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

        {/* JetBrains Mono for code blocks - with display=swap for LCP optimization */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Fallback fonts for compatibility - with display=swap for LCP optimization */}
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

          {/* Skip to Content Link for Keyboard Navigation */}
          <a
            href="#main-content"
            className="skip-to-content"
            aria-label="메인 콘텐츠로 건너뛰기"
          >
            메인 콘텐츠로 건너뛰기
          </a>

          <Header siteTitle={siteConfig.title} />
          <div id="content">
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
            <footer role="contentinfo">
              © {new Date().getFullYear()} {siteConfig.author}, Built with{' '}
              <a href="https://nextjs.org">Next.js</a>
            </footer>
          </div>

          <ScrollToTop />
          <MobileBottomNav />
        </CommandPaletteProvider>
      </body>
    </html>
  )
}
