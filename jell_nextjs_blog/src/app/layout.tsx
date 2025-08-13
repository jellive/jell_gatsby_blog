import './globals.css'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import Header from '@/components/Header'
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics'
import GoogleAdSense from '@/components/Analytics/GoogleAdSense'
import ScrollToTop from '@/components/ScrollToTop'
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
  manifest: '/manifest.json',
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
        <link 
          href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&family=Nanum+Gothic+Coding:wght@400;700&family=Noto+Serif+KR:wght@300;400;700&family=Raleway:wght@400;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <GoogleAdSense />
        <Header siteTitle={siteConfig.title} />
        <div id="content">
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()} {siteConfig.author}, Built with{' '}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
        
        <ScrollToTop />
      </body>
    </html>
  )
}