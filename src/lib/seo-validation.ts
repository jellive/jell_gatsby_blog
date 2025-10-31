/**
 * SEO Validation utilities for robots.txt and sitemap.xml
 */

export interface RobotsTxtValidationResult {
  isValid: boolean
  googlebotAccessible: boolean
  errors: string[]
  warnings: string[]
}

export interface SitemapValidationResult {
  isValid: boolean
  hasAbsoluteUrls: boolean
  allHttps: boolean
  hasValidDates: boolean
  hasValidPriorities: boolean
  hasValidChangefreq: boolean
  hasValidXml: boolean
  hasValidNamespace: boolean
  urlCount: number
  errors: string[]
  warnings: string[]
}

export interface PageMetadataValidationResult {
  isValid: boolean
  hasRobotsTag: boolean
  allowsIndexing: boolean
  hasCanonicalTag: boolean
  canonicalUrl: string | null
  canonicalMatchesUrl: boolean
  canonicalUsesHttps: boolean
  canonicalIsAbsolute: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates robots.txt content for SEO best practices
 * @param content - The content of robots.txt file
 * @returns Validation result with errors and warnings
 */
export function validateRobotsTxt(content: string): RobotsTxtValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let googlebotAccessible = true

  // Check for User-agent directive
  if (!content.includes('User-Agent:') && !content.includes('User-agent:')) {
    errors.push('User-agent directive is missing')
  }

  // Check for Sitemap directive
  if (!content.includes('Sitemap:')) {
    errors.push('Sitemap directive is missing')
  } else {
    // Validate sitemap URL format
    const sitemapMatch = content.match(/Sitemap:\s*(.+)/i)
    if (sitemapMatch?.[1]) {
      const sitemapUrl = sitemapMatch[1].trim()

      // Check if sitemap uses absolute URL (must start with http:// or https://)
      if (
        !sitemapUrl.startsWith('http://') &&
        !sitemapUrl.startsWith('https://')
      ) {
        errors.push('Sitemap must use absolute URL')
      }

      // Check if sitemap uses HTTPS
      if (sitemapUrl.startsWith('http://')) {
        errors.push('Sitemap should use HTTPS')
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
      errors.push('Critical paths are blocked from crawling')
    }

    // Check if posts are blocked
    if (trimmedLine.includes('Disallow: /posts')) {
      warnings.push('Posts directory is disallowed')
    }
  }

  // If Disallow: / is present, Googlebot cannot access content
  if (hasDisallowAll) {
    googlebotAccessible = false
  }

  return {
    isValid: errors.length === 0,
    googlebotAccessible,
    errors,
    warnings,
  }
}

/**
 * Validates sitemap.xml content for SEO best practices
 * @param content - The content of sitemap.xml file
 * @returns Validation result with errors and warnings
 */
export function validateSitemap(content: string): SitemapValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let hasAbsoluteUrls = true
  let allHttps = true
  let hasValidDates = true
  let hasValidPriorities = true
  let hasValidChangefreq = true
  let hasValidXml = true
  let hasValidNamespace = true

  // Valid changefreq values
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
    errors.push('Missing required sitemap namespace')
    hasValidNamespace = false
  }

  // Check XML structure
  if (!content.includes('<?xml') || !content.includes('<urlset')) {
    errors.push('Malformed XML structure')
    hasValidXml = false
  }

  // Extract all <loc> tags
  const locMatches = content.match(/<loc>([^<]+)<\/loc>/g)
  const urlCount = locMatches ? locMatches.length : 0

  // Check URL count limit
  if (urlCount > 50000) {
    errors.push(`URL count (${urlCount}) exceeds 50,000 limit`)
  }

  if (locMatches) {
    // Check if all URLs are absolute and use HTTPS
    for (const match of locMatches) {
      const url = match.replace(/<\/?loc>/g, '').trim()

      // Check absolute URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        hasAbsoluteUrls = false
        errors.push(
          'Some URLs are not absolute (must start with http:// or https://)'
        )
        break
      }

      // Check HTTPS
      if (url.startsWith('http://')) {
        allHttps = false
        errors.push('Some URLs are using HTTP instead of HTTPS')
        break
      }
    }
  }

  // Check lastmod dates
  const lastmodMatches = content.match(/<lastmod>([^<]+)<\/lastmod>/g)
  if (lastmodMatches) {
    for (const match of lastmodMatches) {
      const dateStr = match.replace(/<\/?lastmod>/g, '').trim()
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        hasValidDates = false
        warnings.push('Invalid date format found in lastmod')
        break
      }
    }
  }

  // Check priority values
  const priorityMatches = content.match(/<priority>([^<]+)<\/priority>/g)
  if (priorityMatches) {
    for (const match of priorityMatches) {
      const priorityStr = match.replace(/<\/?priority>/g, '').trim()
      const priority = parseFloat(priorityStr)
      if (isNaN(priority) || priority < 0 || priority > 1) {
        hasValidPriorities = false
        errors.push('Invalid priority values found (must be 0.0-1.0)')
        break
      }
    }
  }

  // Check changefreq values
  const changefreqMatches = content.match(/<changefreq>([^<]+)<\/changefreq>/g)
  if (changefreqMatches) {
    for (const match of changefreqMatches) {
      const freq = match.replace(/<\/?changefreq>/g, '').trim()
      if (!validChangefreq.includes(freq)) {
        hasValidChangefreq = false
        errors.push(
          'Invalid changefreq values (must be: always, hourly, daily, weekly, monthly, yearly, never)'
        )
        break
      }
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

/**
 * Validates page metadata (robots meta tag and canonical tag)
 * @param htmlContent - The HTML content of the page
 * @param currentUrl - The current page URL for comparison
 * @returns Validation result with errors and warnings
 */
export function validatePageMetadata(
  htmlContent: string,
  currentUrl: string
): PageMetadataValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let hasRobotsTag = false
  let allowsIndexing = true
  let hasCanonicalTag = false
  let canonicalUrl: string | null = null
  let canonicalMatchesUrl = false
  let canonicalUsesHttps = false
  let canonicalIsAbsolute = false

  // Check for robots meta tag
  const robotsMatch = htmlContent.match(
    /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i
  )
  if (robotsMatch?.[1]) {
    hasRobotsTag = true
    const content = robotsMatch[1].toLowerCase()
    if (content.includes('noindex')) {
      allowsIndexing = false
      errors.push('Page has noindex directive')
    }
  }

  // Check for canonical tag
  const canonicalMatch = htmlContent.match(
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
  )
  if (canonicalMatch?.[1]) {
    hasCanonicalTag = true
    canonicalUrl = canonicalMatch[1].trim()

    // Check if canonical URL is absolute
    if (
      canonicalUrl.startsWith('http://') ||
      canonicalUrl.startsWith('https://')
    ) {
      canonicalIsAbsolute = true
    } else {
      canonicalIsAbsolute = false
      errors.push('Canonical URL must be absolute')
    }

    // Check if canonical URL uses HTTPS
    if (canonicalUrl.startsWith('https://')) {
      canonicalUsesHttps = true
    } else if (canonicalUrl.startsWith('http://')) {
      canonicalUsesHttps = false
      errors.push('Canonical URL should use HTTPS')
    }

    // Check if canonical URL matches current URL
    const normalizedCanonical = canonicalUrl.replace(/\/$/, '')
    const normalizedCurrent = currentUrl.replace(/\/$/, '')
    if (normalizedCanonical === normalizedCurrent) {
      canonicalMatchesUrl = true
    } else {
      canonicalMatchesUrl = false
      warnings.push(
        'Canonical URL does not match current URL (possible duplicate content)'
      )
    }
  } else {
    errors.push('Missing canonical tag')
  }

  return {
    isValid: errors.length === 0,
    hasRobotsTag,
    allowsIndexing,
    hasCanonicalTag,
    canonicalUrl,
    canonicalMatchesUrl,
    canonicalUsesHttps,
    canonicalIsAbsolute,
    errors,
    warnings,
  }
}
