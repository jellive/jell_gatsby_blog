/**
 * SEO Validation utilities for robots.txt and sitemap.xml
 */

export interface RobotsTxtValidationResult {
  isValid: boolean
  googlebotAccessible: boolean
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
