/**
 * Hreflang Tags Test Suite
 * Tests to verify proper internationalization (i18n) meta tags
 *
 * Test Strategy:
 * 1. Verify canonical URL is present
 * 2. Check hreflang tags for language/region targeting
 * 3. Validate x-default tag for undefined languages
 * 4. Ensure proper URL format and structure
 */

describe('Hreflang and Internationalization Tags', () => {
  describe('Canonical URL', () => {
    it('should have canonical link tag', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have canonical link
          expect(html).toMatch(/<link\s+rel="canonical"/i)

          // Extract canonical URL
          const canonicalMatch = html.match(
            /<link\s+rel="canonical"\s+href="([^"]+)"/i
          )

          if (canonicalMatch) {
            const canonicalUrl = canonicalMatch[1]

            // Should be a valid URL
            expect(canonicalUrl).toMatch(/^https?:\/\//)

            // Should match site URL
            expect(canonicalUrl).toContain('blog.jell.kr')
          }
        }
      }
    })

    it('should have canonical URL on blog post pages', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const postsDir = path.join(outDir, 'posts')

        if (fs.existsSync(postsDir)) {
          // Find first post
          const findFirstPost = (dir: string): string | null => {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name)

              if (entry.isDirectory()) {
                const result = findFirstPost(fullPath)
                if (result) return result
              } else if (entry.name === 'index.html') {
                return fullPath
              }
            }

            return null
          }

          const firstPostPath = findFirstPost(postsDir)

          if (firstPostPath) {
            const html = fs.readFileSync(firstPostPath, 'utf-8')

            // Should have canonical link
            expect(html).toMatch(/<link\s+rel="canonical"/i)
          }
        }
      }
    })
  })

  describe('Hreflang Tags', () => {
    it('should have hreflang tag for Korean (ko-KR)', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have hreflang for Korean
          expect(html).toMatch(/<link\s+rel="alternate"\s+hrefLang="ko-KR"/i)
        }
      }
    })

    it('should have x-default hreflang tag', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have x-default hreflang
          expect(html).toMatch(
            /<link\s+rel="alternate"\s+hrefLang="x-default"/i
          )
        }
      }
    })

    it('should have valid URL in hreflang tags', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Extract all hreflang links
          const hreflangMatches = html.match(
            /<link\s+rel="alternate"\s+hrefLang="[^"]+"\s+href="([^"]+)"/gi
          )

          if (hreflangMatches) {
            hreflangMatches.forEach((tag: string) => {
              const urlMatch = tag.match(/href="([^"]+)"/)

              if (urlMatch) {
                const url = urlMatch[1]

                // Should be a valid absolute URL
                expect(url).toMatch(/^https?:\/\//)

                // Should match site domain
                expect(url).toContain('blog.jell.kr')
              }
            })
          }
        }
      }
    })
  })

  describe('Language Declaration', () => {
    it('should have lang attribute in HTML tag', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have lang attribute
          expect(html).toMatch(/<html\s+lang="ko"/i)
        }
      }
    })

    it('should have consistent language across meta tags', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Check HTML lang attribute
          const htmlLangMatch = html.match(/<html\s+lang="([^"]+)"/i)
          expect(htmlLangMatch).toBeTruthy()

          if (htmlLangMatch) {
            const htmlLang = htmlLangMatch[1]

            // Should be Korean
            expect(htmlLang).toBe('ko')
          }

          // Check Open Graph locale
          const ogLocaleMatch = html.match(
            /<meta\s+property="og:locale"\s+content="([^"]+)"/i
          )
          expect(ogLocaleMatch).toBeTruthy()

          if (ogLocaleMatch) {
            const ogLocale = ogLocaleMatch[1]

            // Should be Korean locale
            expect(ogLocale).toBe('ko_KR')
          }
        }
      }
    })
  })

  describe('SEO Best Practices', () => {
    it('should not have conflicting canonical and hreflang URLs', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Extract canonical URL
          const canonicalMatch = html.match(
            /<link\s+rel="canonical"\s+href="([^"]+)"/i
          )

          // Extract hreflang URLs
          const hreflangMatches = html.match(
            /<link\s+rel="alternate"\s+hrefLang="[^"]+"\s+href="([^"]+)"/gi
          )

          if (canonicalMatch && hreflangMatches) {
            const canonicalUrl = canonicalMatch[1]

            hreflangMatches.forEach((tag: string) => {
              const urlMatch = tag.match(/href="([^"]+)"/)

              if (urlMatch?.[1]) {
                const hreflangUrl = urlMatch[1]

                // Canonical and hreflang URLs should use same domain
                const canonicalDomain = new URL(canonicalUrl).hostname
                const hreflangDomain = new URL(hreflangUrl).hostname

                expect(canonicalDomain).toBe(hreflangDomain)
              }
            })
          }
        }
      }
    })

    it('should have all required meta tags for international SEO', () => {
      const fs = require('fs')
      const path = require('path')
      const outDir = path.resolve(process.cwd(), 'out')

      if (fs.existsSync(outDir)) {
        const indexPath = path.join(outDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8')

          // Should have canonical
          expect(html).toMatch(/<link\s+rel="canonical"/i)

          // Should have hreflang
          expect(html).toMatch(/<link\s+rel="alternate"\s+hrefLang/i)

          // Should have lang attribute
          expect(html).toMatch(/<html\s+lang=/i)

          // Should have Open Graph locale
          expect(html).toMatch(/<meta\s+property="og:locale"/i)
        }
      }
    })
  })
})
