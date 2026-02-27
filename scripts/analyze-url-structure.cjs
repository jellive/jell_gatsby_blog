#!/usr/bin/env node

/**
 * URL Structure Analysis Script
 *
 * Analyzes blog URL structure for:
 * - URL depth (should be 3-4 levels max)
 * - Korean URL encoding issues
 * - Orphan pages (pages without internal links)
 * - Broken internal links
 * - URL structure consistency
 */

const fs = require('fs')
const path = require('path')

// Configuration
const MAX_URL_DEPTH = 4 // Maximum recommended URL depth
const OUT_DIR = path.join(__dirname, '../out')
const OUTPUT_FILE = path.join(
  __dirname,
  '../.taskmaster/reports/url-structure-report.json'
)

/**
 * Find all HTML files recursively
 */
function findHtmlFiles(dir) {
  const files = []

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        traverse(fullPath)
      } else if (entry.name === 'index.html') {
        files.push(fullPath)
      }
    }
  }

  traverse(dir)
  return files
}

/**
 * Extract all internal links from HTML content
 */
function extractInternalLinks(htmlContent) {
  const links = []
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/g
  let match

  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const href = match[1]
    // Filter for internal links (relative or same domain)
    if (
      !href.startsWith('http://') &&
      !href.startsWith('https://') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:')
    ) {
      links.push(href.split('#')[0].split('?')[0]) // Remove hash and query params
    }
  }

  return links
}

/**
 * Calculate URL depth
 */
function calculateDepth(url) {
  const cleanUrl = url.replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
  if (!cleanUrl) return 0
  return cleanUrl.split('/').length
}

/**
 * Check if URL contains Korean characters
 */
function hasKoreanChars(url) {
  return /[가-힣]/.test(url)
}

/**
 * Convert file path to URL
 */
function filePathToUrl(filePath) {
  const relativePath = path.relative(OUT_DIR, filePath)
  const urlPath = relativePath.replace(/\\/g, '/').replace(/\/index\.html$/, '')
  return '/' + urlPath
}

/**
 * Check if file exists for URL
 */
function urlExists(url) {
  const cleanUrl = url.replace(/^\/+/, '') // Remove leading slash
  const filePath = path.join(OUT_DIR, cleanUrl, 'index.html')
  return fs.existsSync(filePath)
}

/**
 * Main analysis function
 */
function analyzeUrlStructure() {
  console.log('🔍 Starting URL structure analysis...\n')

  if (!fs.existsSync(OUT_DIR)) {
    console.error(
      '❌ Error: out/ directory not found. Run npm run build first.'
    )
    process.exit(1)
  }

  const htmlFiles = findHtmlFiles(OUT_DIR)
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`)

  const analysis = []
  const allLinks = new Set()
  const linkGraph = new Map() // url -> array of urls it links to

  // Analyze each HTML file
  for (const file of htmlFiles) {
    const url = filePathToUrl(file)
    const htmlContent = fs.readFileSync(file, 'utf-8')
    const internalLinks = extractInternalLinks(htmlContent)
    const depth = calculateDepth(url)
    const hasKorean = hasKoreanChars(url)

    const fileAnalysis = {
      url,
      depth,
      hasKorean,
      deepUrl: depth > MAX_URL_DEPTH,
      internalLinksCount: internalLinks.length,
      outgoingLinks: internalLinks,
    }

    analysis.push(fileAnalysis)
    linkGraph.set(url, internalLinks)

    // Collect all links
    internalLinks.forEach(link => allLinks.add(link))

    // Log deep URLs
    if (fileAnalysis.deepUrl) {
      console.log(`📏 DEEP URL (depth ${depth}): ${url}`)
    }

    // Log Korean URLs
    if (hasKorean) {
      console.log(`🇰🇷 KOREAN URL: ${url}`)
    }
  }

  console.log('\n🔗 Checking for broken links...\n')

  // Check for broken links
  const brokenLinks = []
  const validUrls = new Set(analysis.map(a => a.url))

  for (const [sourceUrl, links] of linkGraph.entries()) {
    for (const link of links) {
      // Normalize link (remove trailing slash)
      const normalizedLink = link.replace(/\/$/, '')

      // Skip external links and anchors
      if (
        link.startsWith('http') ||
        link.startsWith('#') ||
        link.startsWith('mailto:')
      ) {
        continue
      }

      // Check if link target exists
      if (!validUrls.has(normalizedLink) && !urlExists(normalizedLink)) {
        brokenLinks.push({
          source: sourceUrl,
          target: link,
          normalized: normalizedLink,
        })
        console.log(`🔴 BROKEN: ${sourceUrl} → ${link}`)
      }
    }
  }

  console.log('\n🔍 Checking for orphan pages...\n')

  // Check for orphan pages (pages with no incoming links)
  const incomingLinks = new Map()

  for (const [, links] of linkGraph.entries()) {
    for (const link of links) {
      const count = incomingLinks.get(link) || 0
      incomingLinks.set(link, count + 1)
    }
  }

  const orphans = analysis.filter(a => {
    // Homepage is not an orphan
    if (a.url === '/' || a.url === '') return false
    return (incomingLinks.get(a.url) || 0) === 0
  })

  for (const orphan of orphans) {
    console.log(`🏝️  ORPHAN: ${orphan.url} (no incoming links)`)
  }

  // Summary statistics
  const deepUrls = analysis.filter(a => a.deepUrl)
  const koreanUrls = analysis.filter(a => a.hasKorean)
  const avgDepth =
    analysis.reduce((sum, a) => sum + a.depth, 0) / analysis.length

  const summary = {
    totalPages: analysis.length,
    deepUrlCount: deepUrls.length,
    koreanUrlCount: koreanUrls.length,
    orphanCount: orphans.length,
    brokenLinkCount: brokenLinks.length,
    averageDepth: avgDepth.toFixed(2),
    maxDepth: Math.max(...analysis.map(a => a.depth)),
    maxDepthThreshold: MAX_URL_DEPTH,
    analyzedAt: new Date().toISOString(),
  }

  // Prepare report
  const report = {
    summary,
    deepUrls,
    koreanUrls,
    orphans,
    brokenLinks: brokenLinks.slice(0, 100), // Limit to first 100 for file size
    allPages: analysis,
  }

  // Save report
  const reportsDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2))

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 URL STRUCTURE ANALYSIS SUMMARY')
  console.log('='.repeat(60))
  console.log(`📄 Total Pages:          ${summary.totalPages}`)
  console.log(`📏 Deep URLs (>${MAX_URL_DEPTH}):      ${summary.deepUrlCount}`)
  console.log(`🇰🇷 Korean URLs:          ${summary.koreanUrlCount}`)
  console.log(`🏝️  Orphan Pages:         ${summary.orphanCount}`)
  console.log(`🔴 Broken Links:         ${summary.brokenLinkCount}`)
  console.log(`📊 Average Depth:        ${summary.averageDepth}`)
  console.log(`📈 Maximum Depth:        ${summary.maxDepth}`)
  console.log('='.repeat(60))
  console.log(`\n📁 Report saved to: ${OUTPUT_FILE}\n`)

  return report
}

// Run analysis
if (require.main === module) {
  try {
    analyzeUrlStructure()
  } catch (error) {
    console.error('❌ Error during analysis:', error)
    process.exit(1)
  }
}

module.exports = { analyzeUrlStructure }
