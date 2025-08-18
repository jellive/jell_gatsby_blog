'use client'

import { useEffect } from 'react'
import type { Metric } from 'web-vitals'

// Web Vitals 측정 및 Google Analytics로 전송
export default function WebVitals() {
  useEffect(() => {
    // Dynamic import for web-vitals
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(sendToGoogleAnalytics)
      onFID(sendToGoogleAnalytics)
      onFCP(sendToGoogleAnalytics)
      onLCP(sendToGoogleAnalytics)
      onTTFB(sendToGoogleAnalytics)
    })
  }, [])

  return null
}

function sendToGoogleAnalytics(metric: Metric) {
  // Google Analytics 4로 Web Vitals 데이터 전송
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // 개발 환경에서 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value)
  }
}
