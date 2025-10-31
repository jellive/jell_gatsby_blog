import { validateRobotsTxt } from '../seo-validation'

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
