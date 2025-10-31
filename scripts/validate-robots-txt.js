#!/usr/bin/env node

/**
 * Script to validate robots.txt file for SEO best practices
 * Part of Google Search Console indexing optimization (Task 1.1)
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to find robots.txt in common locations
const possiblePaths = [
  join(__dirname, '../public/robots.txt'),
  join(__dirname, '../out/robots.txt'),
]

function validateRobotsTxt(content) {
  const errors = []
  const warnings = []
  let googlebotAccessible = true

  // Check for User-agent directive
  if (!content.includes('User-Agent:') && !content.includes('User-agent:')) {
    errors.push('❌ User-agent directive is missing')
  } else {
    console.log('✅ User-agent directive found')
  }

  // Check for Sitemap directive
  if (!content.includes('Sitemap:')) {
    errors.push('❌ Sitemap directive is missing')
  } else {
    console.log('✅ Sitemap directive found')

    // Validate sitemap URL format
    const sitemapMatch = content.match(/Sitemap:\s*(.+)/i)
    if (sitemapMatch) {
      const sitemapUrl = sitemapMatch[1].trim()
      console.log(`   Sitemap URL: ${sitemapUrl}`)

      // Check if sitemap uses absolute URL
      if (
        !sitemapUrl.startsWith('http://') &&
        !sitemapUrl.startsWith('https://')
      ) {
        errors.push(
          '❌ Sitemap must use absolute URL (should start with https://)'
        )
      } else {
        console.log('✅ Sitemap uses absolute URL')
      }

      // Check if sitemap uses HTTPS
      if (sitemapUrl.startsWith('http://')) {
        errors.push('❌ Sitemap should use HTTPS instead of HTTP')
      } else if (sitemapUrl.startsWith('https://')) {
        console.log('✅ Sitemap uses HTTPS')
      }
    }
  }

  // Check if critical paths are blocked
  const lines = content.split('\n')
  let hasDisallowAll = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Check for Disallow: / which blocks everything
    if (trimmedLine === 'Disallow: /') {
      hasDisallowAll = true
      errors.push('❌ Critical error: All paths are blocked with "Disallow: /"')
    }

    // Check if posts are blocked
    if (trimmedLine.includes('Disallow: /posts')) {
      warnings.push('⚠️  Warning: Posts directory is disallowed')
    }
  }

  // Check Googlebot accessibility
  if (hasDisallowAll) {
    googlebotAccessible = false
    errors.push('❌ Googlebot cannot access your content')
  } else {
    console.log('✅ Googlebot can access important paths')
  }

  // Check for common good practices
  if (content.includes('Allow: /')) {
    console.log('✅ Allow directive present')
  }

  return {
    isValid: errors.length === 0,
    googlebotAccessible,
    errors,
    warnings,
  }
}

// Main execution
console.log('\n🔍 Validating robots.txt file...\n')

let robotsTxtPath = null
let content = null

// Find robots.txt file
for (const path of possiblePaths) {
  if (existsSync(path)) {
    robotsTxtPath = path
    content = readFileSync(path, 'utf-8')
    break
  }
}

if (!robotsTxtPath) {
  console.error('❌ robots.txt file not found in expected locations:')
  possiblePaths.forEach(path => console.error(`   - ${path}`))
  process.exit(1)
}

console.log(`📄 Found robots.txt at: ${robotsTxtPath}\n`)
console.log('--- Content ---')
console.log(content)
console.log('--- End Content ---\n')

// Validate
const result = validateRobotsTxt(content)

// Print results
console.log('\n📊 Validation Results:\n')

if (result.errors.length > 0) {
  console.log('❌ ERRORS:')
  result.errors.forEach(error => console.log(`   ${error}`))
  console.log()
}

if (result.warnings.length > 0) {
  console.log('⚠️  WARNINGS:')
  result.warnings.forEach(warning => console.log(`   ${warning}`))
  console.log()
}

if (result.isValid) {
  console.log('✅ robots.txt is valid and follows SEO best practices!')
  process.exit(0)
} else {
  console.log('❌ robots.txt validation failed. Please fix the errors above.')
  process.exit(1)
}
