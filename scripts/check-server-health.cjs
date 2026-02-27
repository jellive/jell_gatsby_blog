#!/usr/bin/env node

/**
 * Server Health Check Script
 *
 * Checks server and hosting stability:
 * - HTTP status codes (200, 404, 500)
 * - TTFB (Time To First Byte) < 200ms target
 * - HTTPS and SSL certificate validity
 * - Mixed content issues
 * - Server response monitoring
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// Configuration
const SITE_URL = 'https://blog.jell.kr'
const TTFB_TARGET = 200 // milliseconds
const OUTPUT_FILE = path.join(
  __dirname,
  '../.taskmaster/reports/server-health-report.json'
)

// Test URLs
const TEST_URLS = [
  '/',
  '/posts/dev/js/2025/09/02/javascript-hoisting-complete-guide/',
  '/tags',
  '/search',
  '/404',
  '/posts/dev/blog/2025/08/14/gatsby-to-nextjs-migration-experience/',
]

/**
 * Make HTTP request and measure timing
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    let ttfb = null

    const req = https.get(url, res => {
      ttfb = Date.now() - startTime

      let data = ''
      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        const totalTime = Date.now() - startTime
        resolve({
          url,
          statusCode: res.statusCode,
          ttfb,
          totalTime,
          headers: res.headers,
          body: data,
        })
      })
    })

    req.on('error', err => {
      reject(err)
    })

    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

/**
 * Check for mixed content in HTML
 */
function checkMixedContent(html, pageUrl) {
  const issues = []

  // Check for http:// in src, href, action attributes
  const httpRegex = /(?:src|href|action)=["']http:\/\/[^"']+["']/gi
  const matches = html.match(httpRegex)

  if (matches) {
    matches.forEach(match => {
      issues.push({
        page: pageUrl,
        issue: match,
        type: 'insecure_resource',
      })
    })
  }

  // Check for http:// in style tags
  const styleHttpRegex = /<style[^>]*>[\s\S]*?http:\/\/[\s\S]*?<\/style>/gi
  const styleMatches = html.match(styleHttpRegex)

  if (styleMatches) {
    styleMatches.forEach(match => {
      issues.push({
        page: pageUrl,
        issue: 'HTTP URL in style tag',
        type: 'insecure_style',
      })
    })
  }

  return issues
}

/**
 * Check SSL certificate
 */
function checkSSL() {
  return new Promise((resolve, reject) => {
    const hostname = new URL(SITE_URL).hostname

    const req = https.get(
      {
        hostname,
        port: 443,
        path: '/',
        method: 'HEAD',
      },
      res => {
        const cert = res.socket.getPeerCertificate()

        if (!cert || !cert.subject) {
          reject(new Error('No certificate found'))
          return
        }

        const now = new Date()
        const validFrom = new Date(cert.valid_from)
        const validTo = new Date(cert.valid_to)

        resolve({
          subject: cert.subject.CN,
          issuer: cert.issuer.O,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysUntilExpiry: Math.floor((validTo - now) / (1000 * 60 * 60 * 24)),
          isValid: now >= validFrom && now <= validTo,
        })
      }
    )

    req.on('error', err => {
      reject(err)
    })

    req.end()
  })
}

/**
 * Main health check function
 */
async function checkServerHealth() {
  console.log('🏥 Starting server health check...\n')

  const results = {
    checkedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    ttfbTarget: TTFB_TARGET,
    ssl: null,
    pages: [],
    summary: {
      totalPages: 0,
      successfulPages: 0,
      failedPages: 0,
      averageTTFB: 0,
      maxTTFB: 0,
      pagesAboveTarget: 0,
      mixedContentIssues: 0,
    },
  }

  // Check SSL certificate
  console.log('🔒 Checking SSL certificate...')
  try {
    results.ssl = await checkSSL()
    console.log(`✅ SSL valid until: ${results.ssl.validTo}`)
    console.log(`   Days until expiry: ${results.ssl.daysUntilExpiry}`)
    console.log(`   Issuer: ${results.ssl.issuer}`)
  } catch (err) {
    console.error(`❌ SSL check failed: ${err.message}`)
    results.ssl = { error: err.message }
  }

  console.log('\n📊 Checking page responses...\n')

  // Check each test URL
  for (const testPath of TEST_URLS) {
    const fullUrl = SITE_URL + testPath

    try {
      const response = await makeRequest(fullUrl)

      // Check for mixed content
      const mixedContent = checkMixedContent(response.body, testPath)

      const pageResult = {
        path: testPath,
        statusCode: response.statusCode,
        ttfb: response.ttfb,
        totalTime: response.totalTime,
        success: response.statusCode >= 200 && response.statusCode < 400,
        ttfbWithinTarget: response.ttfb <= TTFB_TARGET,
        mixedContent,
        headers: {
          'content-type': response.headers['content-type'],
          'cache-control': response.headers['cache-control'],
          server: response.headers.server,
          'strict-transport-security':
            response.headers['strict-transport-security'],
        },
      }

      results.pages.push(pageResult)

      // Log result
      const statusIcon = pageResult.success ? '✅' : '❌'
      const ttfbIcon = pageResult.ttfbWithinTarget ? '🟢' : '🟡'
      console.log(`${statusIcon} ${testPath}`)
      console.log(`   Status: ${response.statusCode}`)
      console.log(
        `   ${ttfbIcon} TTFB: ${response.ttfb}ms (target: ${TTFB_TARGET}ms)`
      )
      console.log(`   Total: ${response.totalTime}ms`)

      if (mixedContent.length > 0) {
        console.log(`   ⚠️  Mixed content issues: ${mixedContent.length}`)
      }

      // Update summary
      results.summary.totalPages++
      if (pageResult.success) results.summary.successfulPages++
      else results.summary.failedPages++

      if (!pageResult.ttfbWithinTarget) results.summary.pagesAboveTarget++

      results.summary.mixedContentIssues += mixedContent.length

      console.log('')
    } catch (err) {
      console.error(`❌ ${testPath}: ${err.message}\n`)
      results.pages.push({
        path: testPath,
        error: err.message,
        success: false,
      })
      results.summary.failedPages++
      results.summary.totalPages++
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Calculate average TTFB
  const ttfbValues = results.pages.filter(p => p.ttfb).map(p => p.ttfb)

  if (ttfbValues.length > 0) {
    results.summary.averageTTFB = Math.round(
      ttfbValues.reduce((a, b) => a + b, 0) / ttfbValues.length
    )
    results.summary.maxTTFB = Math.max(...ttfbValues)
  }

  // Save report
  const reportsDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2))

  // Print summary
  console.log('='.repeat(60))
  console.log('🏥 SERVER HEALTH CHECK SUMMARY')
  console.log('='.repeat(60))
  console.log(
    `✅ Successful Pages:     ${results.summary.successfulPages}/${results.summary.totalPages}`
  )
  console.log(`❌ Failed Pages:         ${results.summary.failedPages}`)
  console.log(
    `📊 Average TTFB:         ${results.summary.averageTTFB}ms (target: ${TTFB_TARGET}ms)`
  )
  console.log(`📈 Max TTFB:             ${results.summary.maxTTFB}ms`)
  console.log(`🟡 Pages above target:   ${results.summary.pagesAboveTarget}`)
  console.log(`⚠️  Mixed content issues: ${results.summary.mixedContentIssues}`)

  if (results.ssl && results.ssl.isValid) {
    console.log(
      `🔒 SSL Certificate:      Valid (${results.ssl.daysUntilExpiry} days remaining)`
    )
  } else {
    console.log(`🔒 SSL Certificate:      ❌ Invalid or expired`)
  }

  console.log('='.repeat(60))
  console.log(`\n📁 Report saved to: ${OUTPUT_FILE}\n`)

  // Return exit code based on health
  const hasIssues =
    results.summary.failedPages > 0 ||
    results.summary.pagesAboveTarget > results.summary.totalPages * 0.5 ||
    results.summary.mixedContentIssues > 0 ||
    (results.ssl && !results.ssl.isValid)

  return hasIssues ? 1 : 0
}

// Run health check
if (require.main === module) {
  checkServerHealth()
    .then(exitCode => {
      process.exit(exitCode)
    })
    .catch(err => {
      console.error('❌ Health check failed:', err)
      process.exit(1)
    })
}

module.exports = { checkServerHealth }
