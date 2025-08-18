'use client'

import { useEffect } from 'react'
import { initializeDeploymentCheck } from '@/lib/cache-utils'

/**
 * CacheChecker Component
 * 
 * Monitors for new deployments and automatically refreshes the page
 * when a new version is detected to prevent cache issues.
 */
export default function CacheChecker() {
  useEffect(() => {
    // Only run in production and browser environment
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        initializeDeploymentCheck()
      }, 2000)

      return () => clearTimeout(timer)
    }
    
    // Return undefined for non-production environments
    return undefined
  }, [])

  // This component doesn't render anything
  return null
}