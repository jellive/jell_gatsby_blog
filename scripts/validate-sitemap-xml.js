#!/usr/bin/env node

/**
 * Script to validate sitemap.xml file for SEO best practices
 * Part of Google Search Console indexing optimization (Task 1.2)
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to find sitemap.xml in common locations
const possiblePaths = [
  join(__dirname, '../public/sitemap.xml'),
  join(__dirname, '../out/sitemap.xml'),
]

function validateSitemap(content) {
  const errors = []
  const warnings = []
  let hasAbsoluteUrls = true
  let allHttps = true
  let hasValidDates = true
  let hasValidPriorities = true
  let hasValidChangefreq = true
  let hasValidXml = true
  let hasValidNamespace = true

  const validChangefreq = [
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never',
  ]

  // Check for required namespace
  if (
    !content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
  ) {
    errors.push('❌ Missing required sitemap namespace')
    hasValidNamespace = false
  } else {
    console.log('✅ Sitemap namespace is valid')
  }

  // Check XML structure
  if (!content.includes('<?xml') || !content.includes('<urlset')) {
    errors.push('❌ Malformed XML structure')
    hasValidXml = false
  } else {
    console.log('✅ XML structure is valid')
  }

  // Extract all <loc> tags
  const locMatches = content.match(/<loc>([^<]+)<\/loc>/g)
  const urlCount = locMatches ? locMatches.length : 0

  console.log(`\n📊 URL Statistics:`)
  console.log(`   Total URLs: ${urlCount}`)
  console.log(`   URL Limit: 50,000`)
  console.log(`   Remaining: ${50000 - urlCount}`)

  // Check URL count limit
  if (urlCount > 50000) {
    errors.push(`❌ URL count (${urlCount}) exceeds 50,000 limit`)
    warnings.push('⚠️  Consider using sitemap index file')
  } else {
    console.log(`✅ URL count is within limit`)
  }

  if (locMatches) {
    let httpCount = 0
    let httpsCount = 0

    // Check if all URLs are absolute and use HTTPS
    for (const match of locMatches) {
      const url = match.replace(/<\/?loc>/g, '').trim()

      // Check absolute URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        hasAbsoluteUrls = false
        errors.push('❌ Some URLs are not absolute')
        break
      }

      // Count HTTP vs HTTPS
      if (url.startsWith('http://')) {
        httpCount++
        allHttps = false
      } else if (url.startsWith('https://')) {
        httpsCount++
      }
    }

    console.log(`\n🔒 Protocol Analysis:`)
    console.log(`   HTTPS URLs: ${httpsCount}`)
    console.log(`   HTTP URLs: ${httpCount}`)

    if (allHttps) {
      console.log('✅ All URLs use HTTPS')
    } else {
      errors.push(`❌ ${httpCount} URLs are using HTTP instead of HTTPS`)
    }
  }

  // Check lastmod dates
  const lastmodMatches = content.match(/<lastmod>([^<]+)<\/lastmod>/g)
  let invalidDateCount = 0
  if (lastmodMatches) {
    for (const match of lastmodMatches) {
      const dateStr = match.replace(/<\/?lastmod>/g, '').trim()
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        invalidDateCount++
        hasValidDates = false
      }
    }

    if (invalidDateCount > 0) {
      warnings.push(
        `⚠️  ${invalidDateCount} invalid date formats found in lastmod`
      )
    } else {
      console.log('✅ All lastmod dates are valid')
    }
  }

  // Check priority values
  const priorityMatches = content.match(/<priority>([^<]+)<\/priority>/g)
  let invalidPriorityCount = 0
  if (priorityMatches) {
    for (const match of priorityMatches) {
      const priorityStr = match.replace(/<\/?priority>/g, '').trim()
      const priority = parseFloat(priorityStr)
      if (isNaN(priority) || priority < 0 || priority > 1) {
        invalidPriorityCount++
        hasValidPriorities = false
      }
    }

    if (invalidPriorityCount > 0) {
      errors.push(
        `❌ ${invalidPriorityCount} invalid priority values (must be 0.0-1.0)`
      )
    } else {
      console.log('✅ All priority values are valid (0.0-1.0)')
    }
  }

  // Check changefreq values
  const changefreqMatches = content.match(/<changefreq>([^<]+)<\/changefreq>/g)
  let invalidChangefreqCount = 0
  if (changefreqMatches) {
    for (const match of changefreqMatches) {
      const freq = match.replace(/<\/?changefreq>/g, '').trim()
      if (!validChangefreq.includes(freq)) {
        invalidChangefreqCount++
        hasValidChangefreq = false
      }
    }

    if (invalidChangefreqCount > 0) {
      errors.push(
        `❌ ${invalidChangefreqCount} invalid changefreq values found`
      )
    } else {
      console.log('✅ All changefreq values are valid')
    }
  }

  return {
    isValid: errors.length === 0,
    hasAbsoluteUrls,
    allHttps,
    hasValidDates,
    hasValidPriorities,
    hasValidChangefreq,
    hasValidXml,
    hasValidNamespace,
    urlCount,
    errors,
    warnings,
  }
}

// Main execution
console.log('\n🔍 Validating sitemap.xml file...\n')

let sitemapPath = null
let content = null

// Find sitemap.xml file
for (const path of possiblePaths) {
  if (existsSync(path)) {
    sitemapPath = path
    content = readFileSync(path, 'utf-8')
    break
  }
}

if (!sitemapPath) {
  console.error('❌ sitemap.xml file not found in expected locations:')
  possiblePaths.forEach(path => console.error(`   - ${path}`))
  process.exit(1)
}

console.log(`📄 Found sitemap.xml at: ${sitemapPath}\n`)

// Validate
const result = validateSitemap(content)

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
  console.log('✅ sitemap.xml is valid and follows SEO best practices!')
  console.log(`\n📈 Summary:`)
  console.log(`   • Total URLs: ${result.urlCount}`)
  console.log(`   • All HTTPS: ${result.allHttps ? 'Yes' : 'No'}`)
  console.log(`   • Valid dates: ${result.hasValidDates ? 'Yes' : 'No'}`)
  console.log(
    `   • Valid priorities: ${result.hasValidPriorities ? 'Yes' : 'No'}`
  )
  console.log(
    `   • Valid changefreq: ${result.hasValidChangefreq ? 'Yes' : 'No'}`
  )
  process.exit(0)
} else {
  console.log('❌ sitemap.xml validation failed. Please fix the errors above.')
  process.exit(1)
}
