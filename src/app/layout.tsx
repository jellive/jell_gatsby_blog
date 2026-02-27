import './globals.css'
import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { siteConfig } from '@/lib/config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ClientProviders } from '@/components/ClientProviders'

const StructuredData = dynamic(() => import('@/components/StructuredData'))
// Google Fonts will be loaded via CDN in the head section

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0e' },
  ],
}

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
  alternates: {
    canonical: siteConfig.siteUrl,
    languages: {
      'ko-KR': siteConfig.siteUrl,
      'x-default': siteConfig.siteUrl,
    },
  },
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
    'msapplication-TileColor': '#0b0c0e',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#0b0c0e',
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

        {/* Google Fonts: IBM Plex Mono (Editorial Display) & JetBrains Mono (Code) */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
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
          backgroundColor: 'var(--background, #f7f5f0)',
          color: 'var(--foreground, #1a1815)',
          fontFamily:
            'var(--font-korean, "Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", -apple-system, BlinkMacSystemFont, system-ui, sans-serif)',
        }}
      >
        <StructuredData type="website" />

        {/* Skip to Content Link for Keyboard Navigation */}
        <a
          href="#main-content"
          className="skip-to-content"
          aria-label="메인 콘텐츠로 건너뛰기"
        >
          메인 콘텐츠로 건너뛰기
        </a>

        <ClientProviders>
          <Header siteTitle={siteConfig.title} />
          <div id="content" className="w-full max-w-full">
            <main
              id="main-content"
              role="main"
              tabIndex={-1}
              className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12"
            >
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
