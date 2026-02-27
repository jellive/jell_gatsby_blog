'use client'

import dynamic from 'next/dynamic'
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider'

// ssr: false dynamic imports must live in a Client Component (Next.js 15+)
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
const FontAwesomeInit = dynamic(
  () => import('@/components/FontAwesome/FontAwesomeInit'),
  { ssr: false }
)
const CacheChecker = dynamic(() => import('@/components/CacheChecker'), {
  ssr: false,
})

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <FontAwesomeInit />
      <CacheChecker />
      <GoogleAnalytics />
      <GoogleAdSense />
      <WebVitals />
      {children}
      <ScrollToTop />
      <MobileBottomNav />
    </CommandPaletteProvider>
  )
}
