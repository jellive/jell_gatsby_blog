#!/usr/bin/env node
/**
 * Cache Busting Script for Next.js Deployment
 * 
 * This script adds versioning to critical files and ensures fresh content
 * delivery on each deployment by implementing multiple cache-busting strategies.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'

const CACHE_BUST_VERSION = Date.now()
const BUILD_ID = `build-${new Date().toISOString().replace(/[:.]/g, '-')}-${CACHE_BUST_VERSION}`

console.log('🚀 Starting cache busting process...')
console.log(`📦 Build ID: ${BUILD_ID}`)

/**
 * Update meta tags in HTML files for cache busting
 */
function updateIndexHtml() {
  const indexPath = resolve('out/index.html')
  
  if (!existsSync(indexPath)) {
    console.warn('⚠️ index.html not found, skipping HTML cache busting')
    return
  }

  try {
    let htmlContent = readFileSync(indexPath, 'utf8')
    
    // Add cache-busting meta tags
    const metaTags = `
    <meta name="build-id" content="${BUILD_ID}">
    <meta name="cache-version" content="${CACHE_BUST_VERSION}">
    <meta name="build-timestamp" content="${new Date().toISOString()}">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">`
    
    // Insert meta tags before closing head tag
    htmlContent = htmlContent.replace('</head>', `${metaTags}\n</head>`)
    
    writeFileSync(indexPath, htmlContent, 'utf8')
    console.log('✅ Updated index.html with cache-busting meta tags')
  } catch (error) {
    console.error('❌ Error updating index.html:', error.message)
  }
}

/**
 * Create cache manifest for version tracking
 */
function createCacheManifest() {
  const manifest = {
    buildId: BUILD_ID,
    buildTime: new Date().toISOString(),
    version: CACHE_BUST_VERSION,
    deploymentId: process.env.NETLIFY_DEPLOY_ID || 'local',
    commit: process.env.COMMIT_REF || 'unknown',
    cacheStrategy: 'aggressive-invalidation'
  }

  try {
    writeFileSync(
      resolve('out/cache-manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf8'
    )
    console.log('✅ Created cache manifest')
  } catch (error) {
    console.error('❌ Error creating cache manifest:', error.message)
  }
}

/**
 * Add version query parameter to critical assets
 */
function addVersionToAssets() {
  const indexPath = resolve('out/index.html')
  
  if (!existsSync(indexPath)) {
    console.warn('⚠️ index.html not found for asset versioning')
    return
  }

  try {
    let htmlContent = readFileSync(indexPath, 'utf8')
    
    // Add version parameter to CSS and JS files
    htmlContent = htmlContent.replace(
      /(href|src)="([^"]*\.(css|js))"/g,
      `$1="$2?v=${CACHE_BUST_VERSION}"`
    )
    
    writeFileSync(indexPath, htmlContent, 'utf8')
    console.log('✅ Added version parameters to assets')
  } catch (error) {
    console.error('❌ Error versioning assets:', error.message)
  }
}

/**
 * Generate service worker cache invalidation
 */
function generateServiceWorkerUpdate() {
  const swContent = `
// Auto-generated cache busting service worker update
// Build ID: ${BUILD_ID}
// Generated: ${new Date().toISOString()}

self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: New version installing (${BUILD_ID})')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: New version activated (${BUILD_ID})')
  // Clear all caches on activation
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('🗑️ Clearing cache:', cacheName)
          return caches.delete(cacheName)
        })
      )
    })
  )
  clients.claim()
})

// Force fetch for all requests to ensure fresh content
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .catch(() => caches.match(event.request))
    )
  }
})
`

  try {
    writeFileSync(resolve('out/sw-cache-bust.js'), swContent, 'utf8')
    console.log('✅ Generated service worker cache invalidation')
  } catch (error) {
    console.error('❌ Error generating service worker:', error.message)
  }
}

/**
 * Create deployment info file
 */
function createDeploymentInfo() {
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    buildId: BUILD_ID,
    version: CACHE_BUST_VERSION,
    nodeEnv: process.env.NODE_ENV || 'development',
    netlifyDeployId: process.env.NETLIFY_DEPLOY_ID || null,
    commitRef: process.env.COMMIT_REF || null,
    branch: process.env.BRANCH || 'unknown',
    deployUrl: process.env.DEPLOY_URL || null,
    cacheStatus: 'invalidated'
  }

  try {
    writeFileSync(
      resolve('out/deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2),
      'utf8'
    )
    console.log('✅ Created deployment info')
  } catch (error) {
    console.error('❌ Error creating deployment info:', error.message)
  }
}

// Execute cache busting steps
console.log('📝 Processing cache invalidation...')

updateIndexHtml()
createCacheManifest()
addVersionToAssets()
generateServiceWorkerUpdate()
createDeploymentInfo()

console.log('🎉 Cache busting completed successfully!')
console.log('📊 Summary:')
console.log(`   • Build ID: ${BUILD_ID}`)
console.log(`   • Cache Version: ${CACHE_BUST_VERSION}`)
console.log(`   • Timestamp: ${new Date().toISOString()}`)
console.log('   • HTML files: Cache headers updated')
console.log('   • Assets: Version parameters added')
console.log('   • Service Worker: Cache invalidation ready')
console.log('   • Deployment: Info tracking enabled')