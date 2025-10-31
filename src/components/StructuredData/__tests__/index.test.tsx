import React from 'react'
import { render } from '@testing-library/react'
import StructuredData from '../index'

/**
 * Helper function to extract and parse JSON-LD from rendered component
 */
function getJsonLd(container: HTMLElement): any {
  const script = container.querySelector('script[type="application/ld+json"]')
  expect(script).not.toBeNull()
  return JSON.parse(script?.textContent || '{}')
}

/**
 * Helper function to find a specific schema type in @graph array
 */
function findSchemaByType(jsonLd: any, schemaType: string): any {
  return jsonLd['@graph'].find((item: any) => item['@type'] === schemaType)
}

describe('StructuredData Component', () => {
  describe('BlogPosting Schema', () => {
    const blogPostData = {
      title: 'Test Blog Post Title',
      description:
        'This is a test blog post description for Schema.org validation',
      url: 'https://blog.jell.kr/posts/test-post',
      datePublished: '2025-01-15T00:00:00.000Z',
      dateModified: '2025-01-20T00:00:00.000Z',
      author: 'Test Author',
      category: 'Development',
      tags: ['typescript', 'testing', 'tdd'],
      image: 'https://blog.jell.kr/images/test-image.png',
    }

    it('should render valid BlogPosting JSON-LD with all required fields', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      expect(jsonLd).toHaveProperty('@context', 'https://schema.org')
      expect(jsonLd).toHaveProperty('@graph')
      expect(Array.isArray(jsonLd['@graph'])).toBe(true)

      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')
      expect(blogPosting).toBeDefined()
      expect(blogPosting).toHaveProperty('headline', blogPostData.title)
      expect(blogPosting).toHaveProperty(
        'datePublished',
        blogPostData.datePublished
      )
      expect(blogPosting).toHaveProperty(
        'dateModified',
        blogPostData.dateModified
      )
    })

    it('should include valid author Person schema', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')

      expect(blogPosting.author).toHaveProperty('@type', 'Person')
      expect(blogPosting.author).toHaveProperty('name')
      expect(blogPosting.author).toHaveProperty('url')
    })

    it('should include valid ImageObject schema', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')

      expect(blogPosting.image).toHaveProperty('@type', 'ImageObject')
      expect(blogPosting.image).toHaveProperty('url')
      expect(blogPosting.image.url).toMatch(/^https:\/\//)
    })

    it('should use absolute HTTPS URLs for all links', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')

      expect(blogPosting.url).toMatch(/^https:\/\//)
      expect(blogPosting.mainEntityOfPage).toHaveProperty('@type', 'WebPage')
      expect(blogPosting.mainEntityOfPage.url).toMatch(/^https:\/\//)
    })

    it('should include publisher with logo', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')

      expect(blogPosting.publisher).toHaveProperty('@type', 'Person')
      expect(blogPosting.publisher).toHaveProperty('logo')
      expect(blogPosting.publisher.logo).toHaveProperty('@type', 'ImageObject')
    })

    it('should include keywords array', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')

      expect(blogPosting).toHaveProperty('keywords')
      expect(typeof blogPosting.keywords).toBe('string')
      expect(blogPosting.keywords).toContain('typescript')
      expect(blogPosting.keywords).toContain('testing')
    })
  })

  describe('BreadcrumbList Schema', () => {
    const blogPostData = {
      title: 'Test Post',
      url: 'https://blog.jell.kr/posts/dev/test',
      category: 'Development',
    }

    it('should render valid BreadcrumbList JSON-LD', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const breadcrumb = findSchemaByType(jsonLd, 'BreadcrumbList')

      expect(breadcrumb).toBeDefined()
      expect(breadcrumb).toHaveProperty('itemListElement')
      expect(Array.isArray(breadcrumb.itemListElement)).toBe(true)
      expect(breadcrumb.itemListElement.length).toBeGreaterThanOrEqual(3)
    })

    it('should have correct breadcrumb item positions', () => {
      const { container } = render(
        <StructuredData type="article" data={blogPostData} />
      )

      const jsonLd = getJsonLd(container)
      const breadcrumb = findSchemaByType(jsonLd, 'BreadcrumbList')

      breadcrumb.itemListElement.forEach((item: any, index: number) => {
        expect(item).toHaveProperty('@type', 'ListItem')
        expect(item).toHaveProperty('position', index + 1)
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('item')
      })
    })
  })

  describe('WebSite Schema', () => {
    it('should render valid WebSite JSON-LD with SearchAction', () => {
      const { container } = render(<StructuredData type="website" />)

      const jsonLd = getJsonLd(container)
      const website = findSchemaByType(jsonLd, 'WebSite')

      expect(website).toBeDefined()
      expect(website).toHaveProperty('url')
      expect(website).toHaveProperty('name')
      expect(website).toHaveProperty('potentialAction')
      expect(website.potentialAction).toHaveProperty('@type', 'SearchAction')
    })

    it('should have valid SearchAction with target URL template', () => {
      const { container } = render(<StructuredData type="website" />)

      const jsonLd = getJsonLd(container)
      const website = findSchemaByType(jsonLd, 'WebSite')

      expect(website.potentialAction.target).toHaveProperty(
        '@type',
        'EntryPoint'
      )
      expect(website.potentialAction.target.urlTemplate).toContain(
        '{search_term_string}'
      )
      expect(website.potentialAction).toHaveProperty('query-input')
    })
  })

  describe('Schema Relationships', () => {
    it('should properly link schemas using @id references', () => {
      const { container } = render(
        <StructuredData
          type="article"
          data={{
            title: 'Test',
            url: 'https://blog.jell.kr/posts/test',
          }}
        />
      )

      const jsonLd = getJsonLd(container)
      const blogPosting = findSchemaByType(jsonLd, 'BlogPosting')
      const person = findSchemaByType(jsonLd, 'Person')

      expect(blogPosting.author).toHaveProperty('@id')
      expect(person).toHaveProperty('@id')
      expect(blogPosting.author['@id']).toBe(person['@id'])
    })
  })

  describe('JSON-LD Format Validation', () => {
    it('should produce valid JSON that can be parsed', () => {
      const { container } = render(<StructuredData type="website" />)

      const script = container.querySelector(
        'script[type="application/ld+json"]'
      )
      expect(script).not.toBeNull()

      expect(() => {
        JSON.parse(script?.textContent || '')
      }).not.toThrow()
    })

    it('should include required @context and @graph properties', () => {
      const { container } = render(<StructuredData type="website" />)

      const script = container.querySelector(
        'script[type="application/ld+json"]'
      )
      const jsonLd = JSON.parse(script?.textContent || '{}')

      expect(jsonLd).toHaveProperty('@context')
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd).toHaveProperty('@graph')
      expect(Array.isArray(jsonLd['@graph'])).toBe(true)
    })
  })
})
