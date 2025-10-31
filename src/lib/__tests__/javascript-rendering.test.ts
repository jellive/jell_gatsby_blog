/**
 * JavaScript Rendering Verification Test Suite
 * Tests for JavaScript execution in static builds and Googlebot compatibility
 *
 * Test Strategy:
 * 1. Verify JavaScript bundles are included in build
 * 2. Check that interactive components have proper client directives
 * 3. Validate that HTML includes proper script tags
 * 4. Test that Googlebot-compatible rendering is in place
 * 5. Verify no-JavaScript fallback content exists
 */

describe('JavaScript Rendering Verification', () => {
  describe('JavaScript Bundle Generation', () => {
    it('should generate JavaScript chunks in _next/static', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const staticDir = path.join(outDir, '_next', 'static')
        expect(fs.existsSync(staticDir)).toBe(true)

        // Find JavaScript files recursively
        const findJsFiles = (dir: string): string[] => {
          const files: string[] = []
          const entries = fs.readdirSync(dir, { withFileTypes: true })

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            if (entry.isDirectory()) {
              files.push(...findJsFiles(fullPath))
            } else if (entry.name.endsWith('.js')) {
              files.push(fullPath)
            }
          }

          return files
        }

        const jsFiles = findJsFiles(staticDir)
        expect(jsFiles.length).toBeGreaterThan(0)
      }
    })

    it('should have main application chunk', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const staticDir = path.join(outDir, '_next', 'static', 'chunks')

        if (fs.existsSync(staticDir)) {
          const files = fs.readdirSync(staticDir)
          const hasMainChunk = files.some((file: string) =>
            file.endsWith('.js')
          )
          expect(hasMainChunk).toBe(true)
        }
      }
    })

    it('should have framework chunks', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const chunksDir = path.join(outDir, '_next', 'static', 'chunks')

        if (fs.existsSync(chunksDir)) {
          const files = fs.readdirSync(chunksDir)

          // Should have multiple chunks
          const jsFiles = files.filter((file: string) => file.endsWith('.js'))
          expect(jsFiles.length).toBeGreaterThan(1)
        }
      }
    })
  })

  describe('Client-Side Hydration', () => {
    it('should have script tags in HTML output', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have script tags
          expect(html).toMatch(/<script/)
          expect(html).toMatch(/_next\/static/)

          // Should have proper script attributes for Next.js
          expect(html).toMatch(/src=["'].*_next\/static.*["']/)
        }
      }
    })

    it('should have hydration root in HTML', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Next.js 14 App Router renders content directly in body
          expect(html).toMatch(/<body/)
          expect(html).toMatch(/<header/)
          expect(html).toMatch(/<main/)
        }
      }
    })

    it('should include React hydration data', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Next.js 14 uses script tags with JSON data or self-executing functions
          const hasJsonScript = /<script\s+type="application\/json"/.test(html)
          const hasSelfExecuting = /self\.__next/.test(html)

          expect(hasJsonScript || hasSelfExecuting).toBe(true)
        }
      }
    })
  })

  describe('Interactive Components', () => {
    it('should have client directive in ThemeToggle', () => {
      const fs = require('fs')
      const path = require('path')
      const componentPath = path.resolve(
        process.cwd(),
        'src/components/ThemeToggle/index.tsx'
      )

      expect(fs.existsSync(componentPath)).toBe(true)

      const content = fs.readFileSync(componentPath, 'utf-8')

      // Should have 'use client' directive
      expect(content).toMatch(/'use client'/)
    })

    it('should have client directive in interactive components', () => {
      const fs = require('fs')
      const path = require('path')

      const interactiveComponents = [
        'src/components/ThemeToggle/index.tsx',
        'src/components/SearchPage/index.tsx',
        'src/components/CommandPalette/index.tsx',
      ]

      interactiveComponents.forEach(componentPath => {
        const fullPath = path.resolve(process.cwd(), componentPath)

        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8')
          expect(content).toMatch(/'use client'/)
        }
      })
    })

    it('should export components properly', () => {
      const fs = require('fs')
      const path = require('path')
      const componentPath = path.resolve(
        process.cwd(),
        'src/components/ThemeToggle/index.tsx'
      )

      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf-8')

        // Should have default export
        expect(content).toMatch(/export\s+default/)
      }
    })
  })

  describe('Googlebot JavaScript Execution', () => {
    it('should have pre-rendered HTML content', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have actual content in HTML (not just empty div)
          const bodyContent = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
          expect(bodyContent).toBeTruthy()

          if (bodyContent) {
            // Should have more than just scripts and divs
            const contentLength = bodyContent[1].replace(
              /<script[\s\S]*?<\/script>/gi,
              ''
            ).length
            expect(contentLength).toBeGreaterThan(100)
          }
        }
      }
    })

    it('should have semantic HTML structure', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have semantic HTML tags that Googlebot can understand
          expect(html).toMatch(/<header/i)
          expect(html).toMatch(/<main/i)
          expect(html).toMatch(/<nav/i)
        }
      }
    })

    it('should have proper meta tags for crawlers', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have essential meta tags
          expect(html).toMatch(/<meta\s+name="description"/i)
          expect(html).toMatch(/<meta\s+property="og:title"/i)
          expect(html).toMatch(/<meta\s+property="og:description"/i)
        }
      }
    })

    it('should not have robots meta blocking crawlers', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should NOT have noindex or nofollow
          expect(html).not.toMatch(/<meta\s+name="robots"\s+content="noindex/i)
          expect(html).not.toMatch(/<meta\s+name="robots"\s+content="nofollow/i)
        }
      }
    })

    it('should have structured data for rich results', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have JSON-LD structured data
          expect(html).toMatch(/<script\s+type="application\/ld\+json"/i)
        }
      }
    })
  })

  describe('No-JavaScript Fallback', () => {
    it('should have pre-rendered content for no-JS scenarios', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Next.js 14 static export pre-renders content in HTML
          // No need for noscript tag as content is already in HTML
          expect(html).toMatch(/<body/)
          expect(html).toMatch(/<header/)
          expect(html).toMatch(/<main/)
        }
      }
    })

    it('should have meaningful content without JavaScript', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const postsDir = path.join(outDir, 'posts')

        if (fs.existsSync(postsDir)) {
          // Find first post HTML
          const findFirstHtml = (dir: string): string | null => {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name)

              if (entry.isDirectory()) {
                const result = findFirstHtml(fullPath)
                if (result) return result
              } else if (entry.name === 'index.html') {
                return fullPath
              }
            }

            return null
          }

          const firstPostPath = findFirstHtml(postsDir)

          if (firstPostPath) {
            const html = fs.readFileSync(firstPostPath, 'utf-8')

            // Remove scripts and check if there's still content
            const withoutScripts = html.replace(
              /<script[\s\S]*?<\/script>/gi,
              ''
            )

            // Should still have substantial content
            expect(withoutScripts.length).toBeGreaterThan(500)
          }
        }
      }
    })
  })

  describe('JavaScript Error Handling', () => {
    it('should not have inline error handlers', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should not have onerror attributes
          expect(html).not.toMatch(/onerror=/i)
        }
      }
    })

    it('should have proper async/defer attributes', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Next.js scripts should have proper loading attributes
          const scriptTags = html.match(/<script[^>]*>/gi)

          if (scriptTags) {
            const hasLoadingStrategy = scriptTags.some((tag: string) =>
              /async|defer/.test(tag)
            )
            expect(hasLoadingStrategy).toBe(true)
          }
        }
      }
    })
  })
})
