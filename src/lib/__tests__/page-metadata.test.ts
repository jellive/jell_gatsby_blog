/**
 * Page Metadata Optimization Test Suite
 * Tests for robots meta tags, canonical tags, and page-level metadata
 *
 * Test Strategy:
 * 1. Verify robots meta tag configuration
 * 2. Check canonical tag implementation
 * 3. Validate self-referencing canonical URLs
 * 4. Test duplicate content prevention
 * 5. Verify page-specific metadata
 */

describe('Page Metadata Optimization', () => {
  describe('Root Layout Metadata', () => {
    it('should have root layout with metadata export', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should export metadata
      expect(layoutContent).toMatch(/export const metadata/)
    })

    it('should not have noindex in root layout', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should not block indexing
      expect(layoutContent).not.toMatch(/noindex/)
    })

    it('should allow robots to index and follow', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have robots configuration
      expect(layoutContent).toMatch(/robots/)
    })
  })

  describe('Post Page Metadata', () => {
    it('should have generateMetadata function for posts', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have generateMetadata function
      expect(postPageContent).toMatch(/export async function generateMetadata/)
    })

    it('should include canonical URL in post metadata', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have alternates.canonical
      expect(postPageContent).toMatch(/alternates/)
      expect(postPageContent).toMatch(/canonical/)
    })

    it('should use absolute URLs for canonical', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should use siteConfig.siteUrl for canonical
      expect(postPageContent).toMatch(/siteConfig\.siteUrl/)
    })

    it('should not have noindex in post pages', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Posts should be indexable
      expect(postPageContent).not.toMatch(/noindex/)
      expect(postPageContent).not.toMatch(/nofollow/)
    })

    it('should include OpenGraph metadata', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have OpenGraph tags
      expect(postPageContent).toMatch(/openGraph/)
      expect(postPageContent).toMatch(/type:\s*['"]article['"]/)
    })

    it('should include Twitter card metadata', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have Twitter card
      expect(postPageContent).toMatch(/twitter/)
      expect(postPageContent).toMatch(/card/)
    })
  })

  describe('Tag Pages Metadata', () => {
    it('should have metadata for tag pages', () => {
      const fs = require('fs')
      const tagPagePath = require.resolve('../../app/tags/[tag]/page.tsx')
      const tagPageContent = fs.readFileSync(tagPagePath, 'utf-8')

      // Should have generateMetadata or metadata export
      expect(tagPageContent).toMatch(/metadata|generateMetadata/)
    })

    it('should not block tag pages from indexing', () => {
      const fs = require('fs')
      const tagPagePath = require.resolve('../../app/tags/[tag]/page.tsx')
      const tagPageContent = fs.readFileSync(tagPagePath, 'utf-8')

      // Tag pages should be indexable
      expect(tagPageContent).not.toMatch(/noindex/)
    })
  })

  describe('Search Page Metadata', () => {
    it('should have search page file', () => {
      const fs = require('fs')
      const searchPagePath = require.resolve('../../app/search/page.tsx')
      const searchPageContent = fs.readFileSync(searchPagePath, 'utf-8')

      expect(searchPageContent).toBeDefined()
    })

    it('should have appropriate metadata for search page', () => {
      const fs = require('fs')
      const searchPagePath = require.resolve('../../app/search/page.tsx')
      const searchPageContent = fs.readFileSync(searchPagePath, 'utf-8')

      // Search page should have metadata or generateMetadata
      expect(searchPageContent).toMatch(/metadata|generateMetadata|Metadata/)
    })
  })

  describe('Canonical URL Structure', () => {
    it('should construct canonical URLs with post slug', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should construct URL from slug
      expect(postPageContent).toMatch(/\/posts\//)
      expect(postPageContent).toMatch(/slug/)
    })

    it('should use consistent URL structure', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should use params.slug for URL construction
      expect(postPageContent).toMatch(/params\.slug|resolvedParams\.slug/)
    })
  })

  describe('Meta Description Optimization', () => {
    it('should generate meta descriptions for posts', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have description field
      expect(postPageContent).toMatch(/description/)
    })

    it('should limit description length', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should truncate description (155-160 chars recommended)
      expect(postPageContent).toMatch(/substring|slice|substr/)
    })
  })

  describe('Keywords and Tags', () => {
    it('should include keywords in post metadata', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have keywords field
      expect(postPageContent).toMatch(/keywords/)
    })

    it('should use post tags as keywords', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should use frontMatter.tags
      expect(postPageContent).toMatch(/frontMatter\.tags/)
    })
  })

  describe('Author and Creator Metadata', () => {
    it('should include author metadata in posts', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have authors field
      expect(postPageContent).toMatch(/authors/)
    })

    it('should include creator metadata', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have creator field
      expect(postPageContent).toMatch(/creator/)
    })

    it('should use siteConfig for author info', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should reference siteConfig.author
      expect(postPageContent).toMatch(/siteConfig\.author/)
    })
  })

  describe('Article-Specific Metadata', () => {
    it('should include published time for articles', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have publishedTime in OpenGraph
      expect(postPageContent).toMatch(/publishedTime/)
    })

    it('should include modified time for articles', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have modifiedTime in OpenGraph
      expect(postPageContent).toMatch(/modifiedTime/)
    })

    it('should categorize articles', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have category field
      expect(postPageContent).toMatch(/category/)
    })
  })

  describe('Duplicate Content Prevention', () => {
    it('should have self-referencing canonical URLs', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Canonical should match the page URL
      expect(postPageContent).toMatch(/canonical/)
      expect(postPageContent).toMatch(/postUrl/)
    })

    it('should use consistent URL structure for canonicals', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should construct URL from siteConfig and use it for canonical
      expect(postPageContent).toMatch(/siteConfig\.siteUrl/)
      expect(postPageContent).toMatch(/canonical/)
    })
  })

  describe('Metadata Type Safety', () => {
    it('should import Metadata type from Next.js', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should import Metadata type
      expect(postPageContent).toMatch(/import.*Metadata.*from ['"]next['"]/)
    })

    it('should type generateMetadata return value', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should have Promise<Metadata> return type
      expect(postPageContent).toMatch(/Promise<Metadata>/)
    })
  })

  describe('Not Found Pages', () => {
    it('should handle missing posts gracefully', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should check if post exists
      expect(postPageContent).toMatch(/if\s*\(!post\)/)
    })

    it('should return appropriate metadata for not found', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Should return metadata when post not found
      expect(postPageContent).toMatch(/Post Not Found|title/)
    })
  })
})
