/**
 * Client-side cache utilities for deployment cache busting
 */

export interface DeploymentInfo {
  timestamp: string
  buildId: string
  version: number
  nodeEnv: string
  netlifyDeployId?: string
  commitRef?: string
  branch: string
  deployUrl?: string
  cacheStatus: string
}

/**
 * Check if a new deployment is available
 */
export async function checkForNewDeployment(): Promise<boolean> {
  try {
    const response = await fetch('/deployment-info.json', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (!response.ok) {
      return false
    }
    
    const deploymentInfo: DeploymentInfo = await response.json()
    const lastKnownVersion = localStorage.getItem('deploymentVersion')
    
    if (!lastKnownVersion || lastKnownVersion !== deploymentInfo.buildId) {
      localStorage.setItem('deploymentVersion', deploymentInfo.buildId)
      return lastKnownVersion !== null // Don't trigger on first visit
    }
    
    return false
  } catch (error) {
    console.warn('Failed to check deployment info:', error)
    return false
  }
}

/**
 * Force cache refresh for the current page
 */
export function forcePageRefresh(): void {
  // Clear service worker caches
  if ('serviceWorker' in navigator && 'caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName)
      })
    })
  }
  
  // Force reload with cache bypass
  window.location.reload()
}

/**
 * Clear application caches
 */
export async function clearApplicationCaches(): Promise<void> {
  // Clear localStorage except essential data
  const essentialKeys = ['theme', 'language', 'deploymentVersion']
  const keysToRemove: string[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && !essentialKeys.includes(key)) {
      keysToRemove.push(key)
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key))
  
  // Clear sessionStorage
  sessionStorage.clear()
  
  // Clear browser caches if available
  if ('serviceWorker' in navigator && 'caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(name => caches.delete(name)))
  }
}

/**
 * Show deployment update notification
 */
export function showUpdateNotification(): void {
  // This would integrate with your notification system
  console.log('🔄 New version available! The page will refresh automatically.')
  
  // Auto-refresh after 3 seconds
  setTimeout(() => {
    forcePageRefresh()
  }, 3000)
}

/**
 * Initialize deployment checking
 */
export function initializeDeploymentCheck(): void {
  // Check for updates every 5 minutes
  const checkInterval = 5 * 60 * 1000 // 5 minutes
  
  const checkForUpdates = async () => {
    const hasUpdate = await checkForNewDeployment()
    if (hasUpdate) {
      showUpdateNotification()
    }
  }
  
  // Check immediately
  checkForUpdates()
  
  // Set up periodic checks
  setInterval(checkForUpdates, checkInterval)
  
  // Check when page regains focus
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkForUpdates()
    }
  })
}

/**
 * Get cache bust query parameter
 */
export function getCacheBustParam(): string {
  const version = Date.now()
  return `v=${version}`
}

/**
 * Add cache busting to URL
 */
export function addCacheBusting(url: string): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${getCacheBustParam()}`
}