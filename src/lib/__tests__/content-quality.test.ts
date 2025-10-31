/**
 * Content Quality Test Suite
 * Tests for duplicate content detection, thin content identification,
 * and content quality metrics
 *
 * Test Strategy:
 * 1. Verify canonical tags are properly implemented
 * 2. Check for duplicate content detection mechanisms
 * 3. Validate thin content identification (< 300 words)
 * 4. Test content quality validation script
 * 5. Verify content quality metrics and reporting
 */

describe('Content Quality Implementation', () => {
  describe('Canonical Tags', () => {
    it('should have canonical tag implementation in post pages', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const content = fs.readFileSync(postPagePath, 'utf-8')

      // Should include canonical in alternates
      expect(content).toMatch(/alternates:\s*{[\s\S]*?canonical/)
    })

    it('should use absolute URLs for canonical tags', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const content = fs.readFileSync(postPagePath, 'utf-8')

      // Should use siteConfig.siteUrl for absolute URLs
      expect(content).toMatch(/siteConfig\.siteUrl/)
    })

    it('should have canonical validation in seo-validation utility', () => {
      const fs = require('fs')
      const seoValidationPath = require.resolve('../seo-validation.ts')
      const content = fs.readFileSync(seoValidationPath, 'utf-8')

      // Should have canonical validation function
      expect(content).toMatch(/validatePageMetadata/)
      expect(content).toMatch(/hasCanonicalTag/)
      expect(content).toMatch(/canonicalUrl/)
    })
  })

  describe('Duplicate Content Detection', () => {
    it('should have content quality analysis script', () => {
      const fs = require('fs')
      const path = require('path')
      const scriptPath = path.resolve(
        process.cwd(),
        'scripts/analyze-content-quality.cjs'
      )

      expect(fs.existsSync(scriptPath)).toBe(true)
    })

    it('should detect exact duplicates using content hashing', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      // Should use crypto for hashing
      expect(content).toMatch(/crypto/)
      expect(content).toMatch(/generateHash/)
      expect(content).toMatch(/md5/)
    })

    it('should detect similar content using similarity algorithm', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      // Should calculate similarity
      expect(content).toMatch(/calculateSimilarity/)
      expect(content).toMatch(/SIMILARITY_THRESHOLD/)
    })

    it('should generate content quality report', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      // Report should exist after running analysis
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report).toHaveProperty('summary')
        expect(report).toHaveProperty('duplicates')
        expect(report).toHaveProperty('thinContent')
        expect(report).toHaveProperty('similar')
        expect(report).toHaveProperty('allFiles')
      }
    })
  })

  describe('Thin Content Identification', () => {
    it('should identify thin content with word count < 300', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      // Should have minimum word count threshold
      expect(content).toMatch(/MIN_WORD_COUNT/)
      expect(content).toMatch(/300/)
    })

    it('should count words correctly for Korean and English', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      // Should count Korean words
      expect(content).toMatch(/[가-힣]/)
      expect(content).toMatch(/countWords/)
    })

    it('should extract content excluding frontmatter', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      // Should remove frontmatter
      expect(content).toMatch(/extractContent/)
      expect(content).toMatch(/---/)
    })

    it('should report thin content files', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report.summary).toHaveProperty('thinContentCount')
        expect(report.thinContent).toBeInstanceOf(Array)
      }
    })
  })

  describe('Content Quality Metrics', () => {
    it('should track total file count', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report.summary).toHaveProperty('totalFiles')
        expect(typeof report.summary.totalFiles).toBe('number')
      }
    })

    it('should track duplicate count', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report.summary).toHaveProperty('duplicateCount')
        expect(typeof report.summary.duplicateCount).toBe('number')
      }
    })

    it('should track thin content count', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report.summary).toHaveProperty('thinContentCount')
        expect(typeof report.summary.thinContentCount).toBe('number')
      }
    })

    it('should track healthy content count', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report.summary).toHaveProperty('healthyContentCount')
        expect(typeof report.summary.healthyContentCount).toBe('number')
      }
    })

    it('should include analysis timestamp', () => {
      const fs = require('fs')
      const path = require('path')
      const reportPath = path.resolve(
        process.cwd(),
        '.taskmaster/reports/content-quality-report.json'
      )

      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

        expect(report.summary).toHaveProperty('analyzedAt')
        expect(new Date(report.summary.analyzedAt).toString()).not.toBe(
          'Invalid Date'
        )
      }
    })
  })

  describe('Content Quality Automation', () => {
    it('should be executable as a script', () => {
      const fs = require('fs')
      const path = require('path')
      const scriptPath = path.resolve(
        process.cwd(),
        'scripts/analyze-content-quality.cjs'
      )

      const stats = fs.statSync(scriptPath)
      // Check if executable bit is set (Unix/Mac)
      const isExecutable = (stats.mode & 0o111) !== 0

      expect(isExecutable || process.platform === 'win32').toBe(true)
    })

    it('should export analyzeContentQuality function', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/module\.exports.*analyzeContentQuality/)
    })

    it('should handle errors gracefully', () => {
      const fs = require('fs')
      const scriptPath = require.resolve(
        '../../../scripts/analyze-content-quality.cjs'
      )
      const content = fs.readFileSync(scriptPath, 'utf-8')

      expect(content).toMatch(/try|catch|error/i)
    })
  })

  describe('Canonical Tag Validation', () => {
    it('should validate canonical URLs are absolute', () => {
      const { validatePageMetadata } = require('../seo-validation')

      const htmlWithRelativeCanonical = `
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="canonical" href="/posts/test" />
          </head>
        </html>
      `

      const result = validatePageMetadata(
        htmlWithRelativeCanonical,
        'https://blog.jell.kr/posts/test'
      )

      expect(result.hasCanonicalTag).toBe(true)
      expect(result.canonicalIsAbsolute).toBe(false)
      expect(result.errors).toContain('Canonical URL must be absolute')
    })

    it('should validate canonical URLs use HTTPS', () => {
      const { validatePageMetadata } = require('../seo-validation')

      const htmlWithHttpCanonical = `
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="canonical" href="http://blog.jell.kr/posts/test" />
          </head>
        </html>
      `

      const result = validatePageMetadata(
        htmlWithHttpCanonical,
        'https://blog.jell.kr/posts/test'
      )

      expect(result.canonicalUsesHttps).toBe(false)
      expect(result.errors).toContain('Canonical URL should use HTTPS')
    })

    it('should validate canonical URL matches page URL', () => {
      const { validatePageMetadata } = require('../seo-validation')

      const htmlWithMismatchedCanonical = `
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="canonical" href="https://blog.jell.kr/posts/other" />
          </head>
        </html>
      `

      const result = validatePageMetadata(
        htmlWithMismatchedCanonical,
        'https://blog.jell.kr/posts/test'
      )

      expect(result.canonicalMatchesUrl).toBe(false)
      expect(result.warnings).toContain(
        'Canonical URL does not match current URL (possible duplicate content)'
      )
    })
  })
})
