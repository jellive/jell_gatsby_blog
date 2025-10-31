/**
 * Next.js SSG/Static Export Verification Test Suite
 * Tests for Next.js Static Site Generation configuration and functionality
 *
 * Test Strategy:
 * 1. Verify Next.js configuration is set for static export
 * 2. Check generateStaticParams is implemented for dynamic routes
 * 3. Validate static page generation in build output
 * 4. Verify metadata generation for SEO
 * 5. Check that JavaScript rendering is enabled
 */

describe('Next.js SSG Configuration Verification', () => {
  describe('Next.js Configuration', () => {
    it('should have static export configured in production', () => {
      const fs = require('fs')
      const path = require('path')
      const configPath = path.resolve(process.cwd(), 'next.config.js')

      expect(fs.existsSync(configPath)).toBe(true)

      const configContent = fs.readFileSync(configPath, 'utf-8')

      // Should have output: 'export' for static builds
      expect(configContent).toMatch(/output:\s*['"]export['"]/)

      // Should specify output directory
      expect(configContent).toMatch(/distDir:\s*['"]out['"]/)
    })

    it('should have image optimization configured for static export', () => {
      const fs = require('fs')
      const configPath = require.resolve('../../../next.config.js')
      const configContent = fs.readFileSync(configPath, 'utf-8')

      // Images should be unoptimized for static export
      expect(configContent).toMatch(/unoptimized:\s*true/)

      // Should support WebP and AVIF formats
      expect(configContent).toMatch(/image\/webp/)
      expect(configContent).toMatch(/image\/avif/)
    })

    it('should have proper cache configuration', () => {
      const fs = require('fs')
      const configPath = require.resolve('../../../next.config.js')
      const configContent = fs.readFileSync(configPath, 'utf-8')

      // Should have cache control headers
      expect(configContent).toMatch(/Cache-Control/)
      expect(configContent).toMatch(/max-age=31536000/)
    })

    it('should have security headers configured', () => {
      const fs = require('fs')
      const configPath = require.resolve('../../../next.config.js')
      const configContent = fs.readFileSync(configPath, 'utf-8')

      // Security headers
      expect(configContent).toMatch(/X-Frame-Options/)
      expect(configContent).toMatch(/X-Content-Type-Options/)
      expect(configContent).toMatch(/Referrer-Policy/)
      expect(configContent).toMatch(/Content-Security-Policy/)
      expect(configContent).toMatch(/Strict-Transport-Security/)
    })
  })

  describe('Static Route Generation', () => {
    it('should have generateStaticParams for post pages', () => {
      const fs = require('fs')
      const pagePath = require.resolve(
        '../../../src/app/posts/[...slug]/page.tsx'
      )
      const pageContent = fs.readFileSync(pagePath, 'utf-8')

      // Should export generateStaticParams function
      expect(pageContent).toMatch(
        /export\s+async\s+function\s+generateStaticParams/
      )

      // Should use getAllPosts to get post list
      expect(pageContent).toMatch(/getAllPosts/)

      // Should map posts to slug params
      expect(pageContent).toMatch(/posts\.map/)
      expect(pageContent).toMatch(/slug:\s*post\.slug\.split/)
    })

    it('should have generateMetadata for SEO', () => {
      const fs = require('fs')
      const pagePath = require.resolve(
        '../../../src/app/posts/[...slug]/page.tsx'
      )
      const pageContent = fs.readFileSync(pagePath, 'utf-8')

      // Should export generateMetadata function
      expect(pageContent).toMatch(
        /export\s+async\s+function\s+generateMetadata/
      )

      // Should return Metadata type
      expect(pageContent).toMatch(/:\s*Promise<Metadata>/)

      // Should include OpenGraph metadata
      expect(pageContent).toMatch(/openGraph:/)

      // Should include Twitter metadata
      expect(pageContent).toMatch(/twitter:/)
    })

    it('should generate static params for tag pages', () => {
      const fs = require('fs')
      const path = require('path')
      const tagPagePath = path.resolve(
        process.cwd(),
        'src/app/tags/[tag]/page.tsx'
      )

      if (fs.existsSync(tagPagePath)) {
        const pageContent = fs.readFileSync(tagPagePath, 'utf-8')

        // Should have generateStaticParams
        expect(pageContent).toMatch(/generateStaticParams/)
      }
    })
  })

  describe('Build Output Verification', () => {
    it('should generate static HTML files in out directory', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const stats = fs.statSync(outDir)
        expect(stats.isDirectory()).toBe(true)

        // Should have index.html for homepage
        const indexPath = path.join(outDir, 'index.html')
        expect(fs.existsSync(indexPath)).toBe(true)
      }
    })

    it('should generate static post pages', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const postsDir = path.join(outDir, 'posts')

        if (fs.existsSync(postsDir)) {
          const stats = fs.statSync(postsDir)
          expect(stats.isDirectory()).toBe(true)

          // Should have HTML files for posts
          const hasHtmlFiles = (dir: string): boolean => {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name)

              if (entry.isDirectory()) {
                if (hasHtmlFiles(fullPath)) {
                  return true
                }
              } else if (entry.name === 'index.html') {
                return true
              }
            }

            return false
          }

          expect(hasHtmlFiles(postsDir)).toBe(true)
        }
      }
    })

    it('should generate _next directory with assets', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const nextDir = path.join(outDir, '_next')
        expect(fs.existsSync(nextDir)).toBe(true)
      }
    })

    it('should copy static assets to output', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        // Should have images directory
        const imagesDir = path.join(outDir, 'images')
        if (fs.existsSync(imagesDir)) {
          const stats = fs.statSync(imagesDir)
          expect(stats.isDirectory()).toBe(true)
        }
      }
    })
  })

  describe('JavaScript Rendering', () => {
    it('should include JavaScript bundle in output', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const nextDir = path.join(outDir, '_next', 'static')

        if (fs.existsSync(nextDir)) {
          const hasJsFiles = (dir: string): boolean => {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name)

              if (entry.isDirectory()) {
                if (hasJsFiles(fullPath)) {
                  return true
                }
              } else if (entry.name.endsWith('.js')) {
                return true
              }
            }

            return false
          }

          expect(hasJsFiles(nextDir)).toBe(true)
        }
      }
    })

    it('should have client-side hydration code', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have script tags for Next.js runtime
          expect(html).toMatch(/<script/)
          expect(html).toMatch(/_next\/static/)
        }
      }
    })

    it('should include interactive components', () => {
      const fs = require('fs')
      const path = require('path')

      // Verify that interactive components exist
      const componentsDir = path.resolve(process.cwd(), 'src/components')
      const themeTogglePath = path.join(componentsDir, 'ThemeToggle/index.tsx')

      expect(fs.existsSync(themeTogglePath)).toBe(true)

      const content = fs.readFileSync(themeTogglePath, 'utf-8')

      // Should have client directive for interactive components
      expect(content).toMatch(/'use client'/)
    })
  })

  describe('SEO Metadata', () => {
    it('should include proper meta tags in HTML', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Basic meta tags
          expect(html).toMatch(/<meta/)
          expect(html).toMatch(/charset/)
          expect(html).toMatch(/viewport/)

          // SEO meta tags
          expect(html).toMatch(/description/)
        }
      }
    })

    it('should generate robots.txt', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const robotsPath = path.join(outDir, 'robots.txt')
        expect(fs.existsSync(robotsPath)).toBe(true)
      }
    })

    it('should generate sitemap.xml', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const sitemapPath = path.join(outDir, 'sitemap.xml')
        expect(fs.existsSync(sitemapPath)).toBe(true)
      }
    })
  })

  describe('Performance Configuration', () => {
    it('should have React strict mode enabled', () => {
      const fs = require('fs')
      const configPath = require.resolve('../../../next.config.js')
      const configContent = fs.readFileSync(configPath, 'utf-8')

      expect(configContent).toMatch(/reactStrictMode:\s*true/)
    })

    it('should have package import optimization', () => {
      const fs = require('fs')
      const configPath = require.resolve('../../../next.config.js')
      const configContent = fs.readFileSync(configPath, 'utf-8')

      // Should optimize FontAwesome and Lucide imports
      expect(configContent).toMatch(/optimizePackageImports/)
      expect(configContent).toMatch(/@fortawesome\/react-fontawesome/)
      expect(configContent).toMatch(/lucide-react/)
    })

    it('should remove console statements in production', () => {
      const fs = require('fs')
      const configPath = require.resolve('../../../next.config.js')
      const configContent = fs.readFileSync(configPath, 'utf-8')

      expect(configContent).toMatch(/removeConsole/)
    })
  })
})
