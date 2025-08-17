import { test, expect } from '@playwright/test'

test.describe('URL Routing', () => {
  test('hierarchical URLs work correctly', async ({ page }) => {
    // Test a known post with hierarchical URL structure
    await page.goto('/posts/dev/blog/2025/08/14/gatsby-to-nextjs-migration-experience')
    
    // Should not be 404
    await expect(page.locator('text=404')).not.toBeVisible()
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
    
    // Check post title is displayed (use more specific selector to avoid header h1)
    await expect(page.locator('[data-testid="post-content"] h1, main h1').first()).toBeVisible()
  })

  test('URL encoding issues are handled', async ({ page }) => {
    // Test URL-encoded version - this should now work correctly
    const response = await page.goto('/posts/dev%2Fblog%2F2025%2F08%2F14%2Fgatsby-to-nextjs-migration-experience')
    
    // Server should handle URL-encoded paths correctly and return 200
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
    
    // Also test that the clean (non-encoded) version works
    await page.goto('/posts/dev/blog/2025/08/14/gatsby-to-nextjs-migration-experience')
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
  })

  test('Korean URLs work correctly', async ({ page }) => {
    // Find a post with Korean characters in the URL
    await page.goto('/')
    
    const postLink = page.locator('a[href*="/posts/"]').first()
    const href = await postLink.getAttribute('href')
    
    if (href) {
      await page.goto(href)
      await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
      
      // Check that Korean content is displayed properly
      await expect(page.locator('body')).toContainText(/[가-힣]/)
    }
  })

  test('category URLs work', async ({ page }) => {
    // Test different category URL patterns
    const categories = [
      '/posts/dev/js/tip',
      '/posts/bicycle',
      '/posts/game',
      '/posts/chat',
      '/posts/notice'
    ]
    
    for (const category of categories) {
      // Find posts in this category from homepage
      await page.goto('/')
      
      const categoryPost = page.locator(`a[href*="${category}"]`).first()
      if (await categoryPost.isVisible()) {
        const href = await categoryPost.getAttribute('href')
        if (href) {
          await page.goto(href)
          await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
        }
      }
    }
  })

  test('date-based URLs work', async ({ page }) => {
    // Test various date patterns in URLs
    await page.goto('/')
    
    // Get all post links and test a few with different date patterns
    const postLinks = await page.locator('a[href*="/posts/"]').all()
    
    for (let i = 0; i < Math.min(5, postLinks.length); i++) {
      const href = await postLinks[i].getAttribute('href')
      if (href && href.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
        await page.goto(href)
        await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
        
        // Navigate back to homepage for next test
        await page.goto('/')
      }
    }
  })

  test('invalid URLs return 404', async ({ page }) => {
    const invalidUrls = [
      '/posts/nonexistent/category',
      '/posts/dev/invalid/path/2025/99/99/fake-post',
      '/posts/2025/13/45/invalid-date'
    ]
    
    for (const url of invalidUrls) {
      const response = await page.goto(url)
      expect(response?.status()).toBe(404)
      await expect(page.locator('text=404')).toBeVisible()
    }
  })

  test('URL structure consistency', async ({ page }) => {
    await page.goto('/')
    
    // Collect all post URLs and verify they follow the expected pattern
    const postLinks = await page.locator('a[href*="/posts/"]').all()
    
    for (const link of postLinks) {
      const href = await link.getAttribute('href')
      if (href) {
        // Check URL follows pattern: /posts/category/.../YYYY/MM/DD/title
        const urlPattern = /^\/posts\/[^\/]+.*\/\d{4}\/\d{2}\/\d{2}\/[^\/]+$/
        expect(href).toMatch(urlPattern)
      }
    }
  })
})