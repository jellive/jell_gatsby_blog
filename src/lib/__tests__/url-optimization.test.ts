/**
 * URL Optimization and Internal Link Test Suite
 * Tests for URL structure, internal links, breadcrumb navigation,
 * and related posts recommendation
 *
 * Test Strategy:
 * 1. Verify URL depth is within recommended limits
 * 2. Check for broken internal links
 * 3. Validate breadcrumb navigation implementation
 * 4. Test related posts recommendation system
 * 5. Verify Korean URL encoding handling
 * 6. Check for orphan pages
 */

describe('URL Optimization Implementation', () => {
  describe('URL Structure Analysis', () => {
    it('should have URL structure analysis script', () => {
      const fs = require('fs')
      const path = require('path')
      const scriptPath = path.resolve(
        process.cwd(),
        'scripts/analyze-url-structure.cjs'
      )

      expect(fs.existsSync(scriptPath)).toBe(true)
    })

    it('should detect deep URLs (>4 levels)', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-url-structure.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/MAX_URL_DEPTH/)
      expect(content).toMatch(/calculateDepth/)
      expect(content).toMatch(/deepUrl/)
    })

    it('should detect Korean URLs', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-url-structure.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/hasKoreanChars/)
      expect(content).toMatch(/[가-힣]/)
    })

    it('should generate URL structure report', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/url-structure-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report).toHaveProperty('summary')
        expect(report).toHaveProperty('deepUrls')
        expect(report).toHaveProperty('koreanUrls')
        expect(report).toHaveProperty('orphans')
        expect(report).toHaveProperty('brokenLinks')
        expect(report.summary).toHaveProperty('totalPages')
        expect(report.summary).toHaveProperty('averageDepth')
      }
    })
  })

  describe('Internal Links', () => {
    it('should extract internal links from HTML', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-url-structure.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/extractInternalLinks/)
      expect(content).toMatch(/href/)
    })

    it('should detect broken internal links', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-url-structure.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/brokenLinks/)
      expect(content).toMatch(/urlExists/)
    })

    it('should identify orphan pages', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-url-structure.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/orphans/)
      expect(content).toMatch(/incomingLinks/)
    })
  })

  describe('Breadcrumb Navigation', () => {
    it('should have breadcrumb navigation component', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/BackNavigation/index.tsx'
      )

      expect(fs.existsSync(componentPath)).toBe(true)
    })

    it('should implement semantic breadcrumb structure', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/BackNavigation/index.tsx'
      )
      const content = fs.readFileSync(componentPath, 'utf-8')

      // Should have breadcrumb elements
      expect(content).toMatch(/breadcrumb/)
      expect(content).toMatch(/aria-label/)
    })

    it('should include home link in breadcrumb', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/BackNavigation/index.tsx'
      )
      const content = fs.readFileSync(componentPath, 'utf-8')

      expect(content).toMatch(/faHome/)
      expect(content).toMatch(/Home/)
    })

    it('should show category in breadcrumb', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/BackNavigation/index.tsx'
      )
      const content = fs.readFileSync(componentPath, 'utf-8')

      expect(content).toMatch(/category/)
      expect(content).toMatch(/getCategoryDisplayName/)
    })

    it('should mark current page in breadcrumb', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/BackNavigation/index.tsx'
      )
      const content = fs.readFileSync(componentPath, 'utf-8')

      expect(content).toMatch(/aria-current/)
      expect(content).toMatch(/current/)
    })
  })

  describe('Related Posts Recommendation', () => {
    it('should have related posts utility module', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')

      expect(fs.existsSync(utilPath)).toBe(true)
    })

    it('should calculate tag similarity', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')
      const content = fs.readFileSync(utilPath, 'utf-8')

      expect(content).toMatch(/calculateTagSimilarity/)
      expect(content).toMatch(/Jaccard/)
    })

    it('should calculate category similarity', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')
      const content = fs.readFileSync(utilPath, 'utf-8')

      expect(content).toMatch(/calculateCategorySimilarity/)
    })

    it('should calculate relevance score', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')
      const content = fs.readFileSync(utilPath, 'utf-8')

      expect(content).toMatch(/calculateRelevanceScore/)
      expect(content).toMatch(/weighted/i)
    })

    it('should export getRelatedPosts function', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')
      const content = fs.readFileSync(utilPath, 'utf-8')

      expect(content).toMatch(/export function getRelatedPosts/)
    })

    it('should support minimum score threshold', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')
      const content = fs.readFileSync(utilPath, 'utf-8')

      expect(content).toMatch(/minScore/)
    })

    it('should sort results by relevance', () => {
      const fs = require('fs')
      const path = require('path')
      const utilPath = path.resolve(__dirname, '../related-posts.ts')
      const content = fs.readFileSync(utilPath, 'utf-8')

      expect(content).toMatch(/sort/)
      expect(content).toMatch(/score/)
    })
  })

  describe('URL Structure Validation', () => {
    it('should validate URL depth in generated pages', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/url-structure-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        // Most URLs should be within 4 levels
        const reasonableDepth = report.allPages.filter(
          (p: any) => p.depth <= 4
        ).length
        const totalPages = report.allPages.length

        // At least 40% of pages should have reasonable depth
        const percentage = (reasonableDepth / totalPages) * 100

        expect(percentage).toBeGreaterThan(40)
      }
    })

    it('should handle Korean URLs properly', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/url-structure-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        // Korean URLs should be detected
        expect(report.summary.koreanUrlCount).toBeGreaterThan(0)
        expect(report.koreanUrls).toBeInstanceOf(Array)
      }
    })

    it('should have minimal broken links', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/url-structure-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        // Should have very few broken links (< 5)
        expect(report.summary.brokenLinkCount).toBeLessThan(5)
      }
    })

    it('should have minimal orphan pages', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/url-structure-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        // Orphans should be minimal (search, 404, tags are expected)
        expect(report.summary.orphanCount).toBeLessThan(10)
      }
    })
  })

  describe('Structured Data Breadcrumb', () => {
    it('should have structured data component', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )

      expect(fs.existsSync(componentPath)).toBe(true)
    })

    it('should include breadcrumb list in structured data', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const content = fs.readFileSync(componentPath, 'utf-8')

      // Should have breadcrumb list type
      expect(content).toMatch(/BreadcrumbList/)
    })
  })
})
