'use client'

import Script from 'next/script'
import { siteConfig } from '@/lib/config'

export default function GoogleAdSense() {
  const ADSENSE_CLIENT = siteConfig.googleAdsenseClient

  if (!ADSENSE_CLIENT || process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}

interface AdBannerProps {
  slot: string
  style?: React.CSSProperties
  className?: string
}

export function AdBanner({ slot, style, className }: AdBannerProps) {
  const ADSENSE_CLIENT = siteConfig.googleAdsenseClient

  if (!ADSENSE_CLIENT || process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`ad-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  )
}
