import { validateRobotsTxt, validateSitemap } from '../seo-validation'

describe('SEO Validation - sitemap.xml', () => {
  describe('validateSitemap', () => {
    const validSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://blog.jell.kr</loc>
<lastmod>2025-10-31T06:11:46.202Z</lastmod>
<changefreq>daily</changefreq>
<priority>1</priority>
</url>
<url>
<loc>https://blog.jell.kr/posts/example</loc>
<lastmod>2025-10-31T00:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
</urlset>`

    it('should validate that sitemap uses absolute URLs', () => {
      const result = validateSitemap(validSitemap)
      expect(result.isValid).toBe(true)
      expect(result.hasAbsoluteUrls).toBe(true)
    })

    it('should validate that all URLs use HTTPS', () => {
      const result = validateSitemap(validSitemap)
      expect(result.isValid).toBe(true)
      expect(result.allHttps).toBe(true)
    })

    it('should detect HTTP URLs (not HTTPS)', () => {
      const httpSitemap = validSitemap.replace(/https:\/\//g, 'http://')
      const result = validateSitemap(httpSitemap)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Some URLs are using HTTP instead of HTTPS'
      )
    })

    it('should validate lastmod date format', () => {
      const result = validateSitemap(validSitemap)
      expect(result.isValid).toBe(true)
      expect(result.hasValidDates).toBe(true)
    })

    it('should detect invalid lastmod dates', () => {
      const invalidDateSitemap = validSitemap.replace(
        '<lastmod>2025-10-31T06:11:46.202Z</lastmod>',
        '<lastmod>invalid-date</lastmod>'
      )
      const result = validateSitemap(invalidDateSitemap)
      expect(result.warnings).toContain('Invalid date format found in lastmod')
    })

    it('should validate priority values (0.0 to 1.0)', () => {
      const result = validateSitemap(validSitemap)
      expect(result.isValid).toBe(true)
      expect(result.hasValidPriorities).toBe(true)
    })

    it('should detect invalid priority values', () => {
      const invalidPrioritySitemap = validSitemap.replace(
        '<priority>0.8</priority>',
        '<priority>1.5</priority>'
      )
      const result = validateSitemap(invalidPrioritySitemap)
      expect(result.errors).toContain(
        'Invalid priority values found (must be 0.0-1.0)'
      )
    })

    it('should validate changefreq values', () => {
      const result = validateSitemap(validSitemap)
      expect(result.isValid).toBe(true)
      expect(result.hasValidChangefreq).toBe(true)
    })

    it('should detect invalid changefreq values', () => {
      const invalidChangefreqSitemap = validSitemap.replace(
        '<changefreq>monthly</changefreq>',
        '<changefreq>invalid</changefreq>'
      )
      const result = validateSitemap(invalidChangefreqSitemap)
      expect(result.errors).toContain(
        'Invalid changefreq values (must be: always, hourly, daily, weekly, monthly, yearly, never)'
      )
    })

    it('should check URL count is under 50,000 limit', () => {
      const result = validateSitemap(validSitemap)
      expect(result.urlCount).toBeLessThan(50000)
      expect(result.isValid).toBe(true)
    })

    it('should validate XML structure', () => {
      const result = validateSitemap(validSitemap)
      expect(result.isValid).toBe(true)
      expect(result.hasValidXml).toBe(true)
    })

    it('should detect malformed XML', () => {
      const malformedXml = '<urlset><url><loc>test</url></urlset>'
      const result = validateSitemap(malformedXml)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Malformed XML structure')
    })

    it('should validate required sitemap namespace', () => {
      const result = validateSitemap(validSitemap)
      expect(result.hasValidNamespace).toBe(true)
    })

    it('should detect missing namespace', () => {
      const noNamespaceSitemap = validSitemap.replace(
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        ''
      )
      const result = validateSitemap(noNamespaceSitemap)
      expect(result.errors).toContain('Missing required sitemap namespace')
    })
  })
})

describe('SEO Validation - robots.txt', () => {
  describe('validateRobotsTxt', () => {
    it('should validate that robots.txt exists', () => {
      const mockRobotsTxt = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /static/

Host: https://blog.jell.kr
Sitemap: https://blog.jell.kr/sitemap.xml`

      const result = validateRobotsTxt(mockRobotsTxt)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should check that Googlebot can access all important paths', () => {
      const mockRobotsTxt = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /static/

Sitemap: https://blog.jell.kr/sitemap.xml`

      const result = validateRobotsTxt(mockRobotsTxt)

      expect(result.isValid).toBe(true)
      expect(result.googlebotAccessible).toBe(true)
    })

    it('should detect if critical paths are blocked', () => {
      const blockingRobotsTxt = `User-Agent: *
Disallow: /
Disallow: /posts/`

      const result = validateRobotsTxt(blockingRobotsTxt)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Critical paths are blocked from crawling'
      )
    })

    it('should validate that sitemap is declared', () => {
      const withoutSitemap = `User-Agent: *
Allow: /`

      const result = validateRobotsTxt(withoutSitemap)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Sitemap directive is missing')
    })

    it('should validate that sitemap uses absolute URL', () => {
      const relativeSitemap = `User-Agent: *
Allow: /
Sitemap: /sitemap.xml`

      const result = validateRobotsTxt(relativeSitemap)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Sitemap must use absolute URL')
    })

    it('should validate that sitemap uses HTTPS', () => {
      const httpSitemap = `User-Agent: *
Allow: /
Sitemap: http://blog.jell.kr/sitemap.xml`

      const result = validateRobotsTxt(httpSitemap)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Sitemap should use HTTPS')
    })

    it('should detect disallow rules that might block important content', () => {
      const overlyRestrictive = `User-Agent: *
Disallow: /posts/
Disallow: /api/`

      const result = validateRobotsTxt(overlyRestrictive)

      expect(result.warnings).toContain('Posts directory is disallowed')
    })

    it('should validate User-agent directive exists', () => {
      const noUserAgent = `Allow: /
Sitemap: https://blog.jell.kr/sitemap.xml`

      const result = validateRobotsTxt(noUserAgent)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('User-agent directive is missing')
    })
  })
})
