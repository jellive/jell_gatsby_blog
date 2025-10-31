/**
 * Structured Data Test Suite
 * Tests for Schema.org markup implementation
 *
 * Test Strategy:
 * 1. Verify Article schema implementation
 * 2. Check BreadcrumbList schema
 * 3. Validate WebSite schema
 * 4. Test JSON-LD format compliance
 * 5. Verify required fields presence
 */

describe('Structured Data Implementation', () => {
  describe('StructuredData Component', () => {
    it('should have StructuredData component file', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      expect(componentContent).toBeDefined()
    })

    it('should use JSON-LD format', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should use application/ld+json script type
      expect(componentContent).toMatch(/application\/ld\+json/)
    })

    it('should have @context for schema.org', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should reference schema.org context
      expect(componentContent).toMatch(/schema\.org/)
      expect(componentContent).toMatch(/@context/)
    })
  })

  describe('Article Schema (BlogPosting)', () => {
    it('should implement BlogPosting schema for articles', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should have BlogPosting type
      expect(componentContent).toMatch(/BlogPosting/)
    })

    it('should include headline field', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Article schema requires headline
      expect(componentContent).toMatch(/headline/)
    })

    it('should include image field', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Article schema requires image
      expect(componentContent).toMatch(/image/)
      expect(componentContent).toMatch(/ImageObject/)
    })

    it('should include datePublished field', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Article schema requires datePublished
      expect(componentContent).toMatch(/datePublished/)
    })

    it('should include dateModified field', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Article schema requires dateModified
      expect(componentContent).toMatch(/dateModified/)
    })

    it('should include author information', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Article schema requires author
      expect(componentContent).toMatch(/author/)
      expect(componentContent).toMatch(/Person/)
    })

    it('should include publisher information', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Article schema requires publisher
      expect(componentContent).toMatch(/publisher/)
    })

    it('should include mainEntityOfPage', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should link to main entity (WebPage)
      expect(componentContent).toMatch(/mainEntityOfPage/)
      expect(componentContent).toMatch(/WebPage/)
    })
  })

  describe('BreadcrumbList Schema', () => {
    it('should implement BreadcrumbList schema', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should have BreadcrumbList type
      expect(componentContent).toMatch(/BreadcrumbList/)
    })

    it('should have itemListElement for breadcrumbs', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // BreadcrumbList requires itemListElement
      expect(componentContent).toMatch(/itemListElement/)
    })

    it('should include position and name for list items', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // ListItem requires position and name
      expect(componentContent).toMatch(/position/)
      expect(componentContent).toMatch(/ListItem/)
    })

    it('should link breadcrumb items with URLs', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Each breadcrumb item should have an item (URL)
      expect(componentContent).toMatch(/item:/)
    })
  })

  describe('WebSite Schema', () => {
    it('should implement WebSite schema', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should have WebSite type
      expect(componentContent).toMatch(/WebSite/)
    })

    it('should include site name and description', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // WebSite schema requires name and description
      expect(componentContent).toMatch(/name/)
      expect(componentContent).toMatch(/description/)
    })

    it('should include site URL', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // WebSite schema requires url
      expect(componentContent).toMatch(/url/)
    })

    it('should include SearchAction for site search', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should have potentialAction with SearchAction
      expect(componentContent).toMatch(/SearchAction/)
      expect(componentContent).toMatch(/potentialAction/)
    })

    it('should have query-input for search functionality', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // SearchAction requires query-input
      expect(componentContent).toMatch(/query-input/)
    })
  })

  describe('Schema Integration', () => {
    it('should be imported in post pages', () => {
      const fs = require('fs')
      const postPagePath = require.resolve('../../app/posts/[...slug]/page.tsx')
      const postPageContent = fs.readFileSync(postPagePath, 'utf-8')

      // Post pages should import StructuredData
      expect(postPageContent).toMatch(/import.*StructuredData/)
    })

    it('should use @graph for multiple schemas', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should use @graph array for multiple schema items
      expect(componentContent).toMatch(/@graph/)
    })

    it('should reference entities with @id', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Entities should have @id for referencing
      expect(componentContent).toMatch(/@id/)
    })
  })

  describe('Required Schema Fields', () => {
    it('should include inLanguage field', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should specify language (ko-KR for Korean)
      expect(componentContent).toMatch(/inLanguage/)
      expect(componentContent).toMatch(/ko-KR/)
    })

    it('should include sameAs for social profiles', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Person schema should have sameAs for social profiles
      expect(componentContent).toMatch(/sameAs/)
    })

    it('should use siteConfig for consistent data', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should import and use siteConfig
      expect(componentContent).toMatch(/import.*siteConfig/)
      expect(componentContent).toMatch(/siteConfig\./)
    })
  })

  describe('Article-Specific Fields', () => {
    it('should include keywords field for articles', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Articles should have keywords
      expect(componentContent).toMatch(/keywords/)
    })

    it('should include articleSection for categorization', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Articles should have articleSection (category)
      expect(componentContent).toMatch(/articleSection/)
    })

    it('should include about field for topic', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Articles should have about field
      expect(componentContent).toMatch(/about/)
    })

    it('should include wordCount for reading metrics', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Articles should have wordCount
      expect(componentContent).toMatch(/wordCount/)
    })

    it('should include timeRequired for estimated reading time', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Articles should have timeRequired in ISO 8601 duration format
      expect(componentContent).toMatch(/timeRequired/)
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should have TypeScript interface for props', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Should have StructuredDataProps interface
      expect(componentContent).toMatch(/interface.*StructuredDataProps/)
    })

    it('should type the data prop', () => {
      const fs = require('fs')
      const componentPath = require.resolve(
        '../../components/StructuredData/index.tsx'
      )
      const componentContent = fs.readFileSync(componentPath, 'utf-8')

      // Data prop should be typed
      expect(componentContent).toMatch(/data\?:/)
    })
  })
})
