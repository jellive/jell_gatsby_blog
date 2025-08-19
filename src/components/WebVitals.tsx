'use client'

import { useEffect } from 'react'
import type { Metric } from 'web-vitals'

// Declare gtag global function
declare global {
  function gtag(...args: any[]): void
}

export default function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Import web-vitals dynamically
    import('web-vitals').then(
      ({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        function sendToAnalytics(metric: Metric) {
          // Send to Google Analytics 4
          if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
              event_category: 'Web Vitals',
              event_label: metric.id,
              value: Math.round(metric.value),
              non_interaction: true,
            })
          }

          // Send to console in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Web Vital:', metric)
          }

          // Optional: Send to your analytics service
          // Example: send to a custom endpoint
          if (process.env.NODE_ENV === 'production') {
            navigator.sendBeacon('/api/analytics', JSON.stringify(metric))
          }
        }

        // Register all Web Vitals metrics
        onCLS(sendToAnalytics)
        onFID(sendToAnalytics)
        onFCP(sendToAnalytics)
        onLCP(sendToAnalytics)
        onTTFB(sendToAnalytics)
        onINP(sendToAnalytics)
      }
    )
  }, [])

  return null // This component doesn't render anything
}
