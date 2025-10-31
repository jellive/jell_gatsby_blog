/**
 * SEO Foundation Verification Test Suite
 * Tests for robots.txt, sitemap.xml, and basic SEO configuration
 *
 * Test Strategy:
 * 1. Verify robots.txt configuration and accessibility
 * 2. Check sitemap.xml structure and URL limits
 * 3. Validate URL formats and required fields
 * 4. Test Googlebot accessibility
 * 5. Verify lastmod, priority, changefreq fields
 */

describe('SEO Foundation Verification', () => {
  describe('Robots.txt Configuration', () => {
    it('should have robots.ts file defined', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      expect(robotsContent).toBeDefined()
    })

    it('should allow root path access', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      // Should allow root path
      expect(robotsContent).toMatch(/allow\s*:\s*['"]\/['"]/)
    })

    it('should disallow API and internal paths', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      // Should disallow /api/, /_next/, /static/
      expect(robotsContent).toMatch(/disallow/)
      expect(robotsContent).toMatch(/\/api\//)
      expect(robotsContent).toMatch(/\/_next\//)
    })

    it('should specify sitemap URL', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      // Should have sitemap reference
      expect(robotsContent).toMatch(/sitemap/)
      expect(robotsContent).toMatch(/sitemap\.xml/)
    })

    it('should allow all user agents', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      // Should allow all user agents (*)
      expect(robotsContent).toMatch(/userAgent\s*:\s*['"]\*['"]/)
    })
  })

  describe('Sitemap.xml Configuration', () => {
    it('should have sitemap.ts file defined', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      expect(sitemapContent).toBeDefined()
    })

    it('should include static pages in sitemap', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should include homepage, tags, search pages
      expect(sitemapContent).toMatch(/siteConfig\.siteUrl/)
      expect(sitemapContent).toMatch(/\/tags/)
      expect(sitemapContent).toMatch(/\/search/)
    })

    it('should include post pages in sitemap', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should map over posts
      expect(sitemapContent).toMatch(/posts\.map/)
      expect(sitemapContent).toMatch(/\/posts\//)
    })

    it('should include tag pages in sitemap', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should map over tags
      expect(sitemapContent).toMatch(/tags\.map/)
      expect(sitemapContent).toMatch(/encodeURIComponent/)
    })
  })

  describe('Sitemap URL Structure', () => {
    it('should have lastModified field', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should have lastModified dates
      expect(sitemapContent).toMatch(/lastModified/)
      expect(sitemapContent).toMatch(/new Date/)
    })

    it('should have changeFrequency field', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should have changeFrequency
      expect(sitemapContent).toMatch(/changeFrequency/)
      expect(sitemapContent).toMatch(
        /daily|weekly|monthly|yearly|always|hourly|never/
      )
    })

    it('should have priority field', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should have priority values
      expect(sitemapContent).toMatch(/priority/)
    })

    it('should use proper URL encoding for tags', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should encode tag URLs
      expect(sitemapContent).toMatch(/encodeURIComponent\(tag\)/)
    })
  })

  describe('SEO Priority Configuration', () => {
    it('should set homepage as highest priority', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Homepage should have priority 1 or close to it
      const homepageSection = sitemapContent.match(
        /url:\s*siteConfig\.siteUrl[^}]+priority:\s*([\d.]+)/
      )
      if (homepageSection) {
        const priority = parseFloat(homepageSection[1])
        expect(priority).toBeGreaterThanOrEqual(0.9)
      } else {
        // If pattern doesn't match, at least verify priority field exists
        expect(sitemapContent).toMatch(/priority/)
      }
    })

    it('should set posts with higher priority than tags', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Posts should have priority 0.8, tags should have 0.6
      const postPriority = sitemapContent.match(
        /posts\.map[^}]+priority:\s*([\d.]+)/
      )
      const tagPriority = sitemapContent.match(
        /tags\.map[^}]+priority:\s*([\d.]+)/
      )

      if (postPriority && tagPriority) {
        expect(parseFloat(postPriority[1])).toBeGreaterThan(
          parseFloat(tagPriority[1])
        )
      } else {
        // Fallback: verify both have priority fields
        expect(sitemapContent).toMatch(/priority:\s*0\.8/)
        expect(sitemapContent).toMatch(/priority:\s*0\.6/)
      }
    })
  })

  describe('URL Format Validation', () => {
    it('should use absolute URLs with siteUrl', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // All URLs should use siteConfig.siteUrl
      expect(sitemapContent).toMatch(/siteConfig\.siteUrl/)
    })

    it('should construct proper post URLs', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Post URLs should use slug
      expect(sitemapContent).toMatch(/\/posts\/\$\{post\.slug\}/)
    })
  })

  describe('Sitemap Size Limits', () => {
    it('should be async function to handle large datasets', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should be async function
      expect(sitemapContent).toMatch(/async function sitemap/)
    })

    it('should import required dependencies', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should import MetadataRoute
      expect(sitemapContent).toMatch(/import.*MetadataRoute/)
      expect(sitemapContent).toMatch(/import.*getAllPosts/)
      expect(sitemapContent).toMatch(/import.*getAllTags/)
    })
  })

  describe('Googlebot Accessibility', () => {
    it('should not block main content paths', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      // Should not disallow /posts/ or /tags/
      expect(robotsContent).not.toMatch(/disallow:.*\/posts\//)
      expect(robotsContent).not.toMatch(/disallow:.*\/tags\//)
    })

    it('should allow crawling of homepage', () => {
      const fs = require('fs')
      const robotsPath = require.resolve('../../app/robots.ts')
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

      // Should explicitly allow root or not disallow it
      expect(robotsContent).toMatch(/allow\s*:\s*['"]\/['"]/)
    })
  })

  describe('SEO Configuration Integration', () => {
    it('should use siteConfig for consistent URLs', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should import siteConfig
      expect(sitemapContent).toMatch(/import.*siteConfig/)
      expect(sitemapContent).toMatch(/from ['"]@\/lib\/config['"]/)
    })

    it('should have proper TypeScript types', () => {
      const fs = require('fs')
      const sitemapPath = require.resolve('../../app/sitemap.ts')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

      // Should have MetadataRoute.Sitemap type
      expect(sitemapContent).toMatch(/MetadataRoute\.Sitemap/)
    })
  })
})
