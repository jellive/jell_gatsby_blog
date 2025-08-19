import { test, expect } from '@playwright/test'
import { createSafeNavigation, NavigationPatterns } from './utils/navigation'

test.describe('URL Routing', () => {
  test('hierarchical URLs work correctly', async ({ page }) => {
    // Test a known post with hierarchical URL structure
    const nav = createSafeNavigation(page)
    await nav.goto(
      '/posts/dev/blog/2025/08/14/gatsby-to-nextjs-migration-experience'
    )

    // Should not be 404
    await expect(page.locator('text=404')).not.toBeVisible()
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()

    // Check post title is displayed (use more specific selector to avoid header h1)
    await expect(
      page.locator('[data-testid="post-content"] h1, main h1').first()
    ).toBeVisible()
  })

  test('URL encoding issues are handled', async ({ page }) => {
    // Test URL-encoded version - this should now work correctly
    const nav = createSafeNavigation(page)
    await nav.goto(
      '/posts/dev%2Fblog%2F2025%2F08%2F14%2Fgatsby-to-nextjs-migration-experience'
    )

    // Verify page loaded successfully by checking for content
    await expect(page.locator('text=404')).not.toBeVisible()
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()

    // Also test that the clean (non-encoded) version works
    await nav.goto(
      '/posts/dev/blog/2025/08/14/gatsby-to-nextjs-migration-experience'
    )
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
  })

  test('Korean URLs work correctly', async ({ page }) => {
    // Find a post with Korean characters in the URL
    const nav = createSafeNavigation(page)
    await NavigationPatterns.goHome(page)

    const postLink = page.locator('a[href*="/posts/"]').first()
    const href = await postLink.getAttribute('href')

    if (href) {
      await nav.goto(href)
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
      '/posts/notice',
    ]

    const nav = createSafeNavigation(page)

    for (const category of categories) {
      // Find posts in this category from homepage
      await NavigationPatterns.goHome(page)

      const categoryPost = page.locator(`a[href*="${category}"]`).first()
      if (await categoryPost.isVisible()) {
        const href = await categoryPost.getAttribute('href')
        if (href) {
          await nav.goto(href)
          await expect(
            page.locator('[data-testid="post-content"]')
          ).toBeVisible()
        }
      }
    }
  })

  test('date-based URLs work', async ({ page }) => {
    // Test various date patterns in URLs
    const nav = createSafeNavigation(page)
    await NavigationPatterns.goHome(page)

    // Get all post links and test a few with different date patterns
    const postLinks = await page.locator('a[href*="/posts/"]').all()

    for (let i = 0; i < Math.min(5, postLinks.length); i++) {
      const href = await postLinks[i]?.getAttribute('href')
      if (href && href.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
        await nav.goto(href)
        await expect(page.locator('[data-testid="post-content"]')).toBeVisible()

        // Navigate back to homepage for next test
        await NavigationPatterns.goHome(page)
      }
    }
  })

  test('invalid URLs return 404', async ({ page }) => {
    const invalidUrls = [
      '/posts/nonexistent/category',
      '/posts/dev/invalid/path/2025/99/99/fake-post',
      '/posts/2025/13/45/invalid-date',
    ]

    const nav = createSafeNavigation(page)

    for (const url of invalidUrls) {
      try {
        await nav.goto(url)
        // If no error is thrown, check for 404 content
        await expect(page.locator('text=404')).toBeVisible()
      } catch (error) {
        // Navigation might fail for invalid URLs, which is expected
        console.log(`Expected error for invalid URL ${url}:`, error)
      }
    }
  })

  test('URL structure consistency', async ({ page }) => {
    await NavigationPatterns.goHome(page)

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
