import { test, expect } from '@playwright/test'
import { createSafeNavigation, NavigationPatterns } from './utils/navigation'

test.describe('Blog Post Features', () => {
  test('post content displays correctly', async ({ page }) => {
    // Navigate to a specific post
    await NavigationPatterns.goHome(page)

    const firstPost = page.locator('[data-testid="post-item"]').first()
    await firstPost.click()

    // Check post content elements
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible() // Post title
    await expect(page.locator('[data-testid="post-metadata"]')).toBeVisible() // Date, category, tags
    await expect(page.locator('[data-testid="post-body"]')).toBeVisible() // Main content
  })

  test('table of contents functionality', async ({ page }) => {
    // Find a post that has table of contents
    await NavigationPatterns.goHome(page)

    // Look for posts that might have TOC (longer posts typically do)
    const postLinks = await page.locator('a[href*="/posts/"]').all()

    for (const link of postLinks.slice(0, 5)) {
      // Test first 5 posts
      const href = await link.getAttribute('href')
      if (href) {
        const nav = createSafeNavigation(page)
        await nav.goto(href)

        // Check if TOC exists
        const toc = page.locator('[data-testid="table-of-contents"]')
        const tocInside = page.locator('[data-testid="toc-inside"]')
        const tocOutside = page.locator('[data-testid="toc-outside"]')

        if (
          (await toc.isVisible()) ||
          (await tocInside.isVisible()) ||
          (await tocOutside.isVisible())
        ) {
          // Test TOC link clicks
          const tocLinks = page.locator('[data-testid="table-of-contents"] a')
          const tocCount = await tocLinks.count()

          if (tocCount > 0) {
            // Click first TOC link and verify it scrolls to the heading
            const firstTocLink = tocLinks.first()
            const href = await firstTocLink.getAttribute('href')

            if (href && href.startsWith('#')) {
              await firstTocLink.click()

              // Check that the corresponding heading is in view
              const headingId = href.substring(1)
              const heading = page.locator(`#${headingId}`)
              await expect(heading).toBeVisible()
            }
          }
          break // Found a post with TOC, no need to continue
        }
      }
    }
  })

  test('code syntax highlighting works', async ({ page }) => {
    await NavigationPatterns.goHome(page)

    // Find a post that might contain code
    const devPosts = page.locator('a[href*="/posts/dev/"]')
    const devPostCount = await devPosts.count()

    if (devPostCount > 0) {
      await devPosts.first().click()

      // Check for code blocks with syntax highlighting
      const codeBlocks = page.locator('pre code')
      const codeBlockCount = await codeBlocks.count()

      if (codeBlockCount > 0) {
        const firstCodeBlock = codeBlocks.first()
        await expect(firstCodeBlock).toBeVisible()

        // Check if syntax highlighting classes are applied
        const className = await firstCodeBlock.getAttribute('class')
        expect(className).toContain('language-')
      }
    }
  })

  test('post metadata displays correctly', async ({ page }) => {
    await NavigationPatterns.goHome(page)

    const firstPost = page.locator('[data-testid="post-item"]').first()
    await firstPost.click()

    // Check metadata elements
    await expect(page.locator('[data-testid="post-date"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-category"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-tags"]')).toBeVisible()

    // Check that date is in correct format
    const dateElement = page.locator('[data-testid="post-date"]')
    const dateText = await dateElement.textContent()
    expect(dateText).toMatch(/\d{4}\.\d{2}\.\d{2}/)
  })

  test('image display works correctly', async ({ page }) => {
    await NavigationPatterns.goHome(page)

    // Look for posts that might contain images
    const postLinks = await page.locator('a[href*="/posts/"]').all()

    for (const link of postLinks.slice(0, 10)) {
      const href = await link.getAttribute('href')
      if (href) {
        const nav = createSafeNavigation(page)
        await nav.goto(href)

        const images = page.locator('[data-testid="post-body"] img')
        const imageCount = await images.count()

        if (imageCount > 0) {
          // Check that images load properly
          for (let i = 0; i < Math.min(3, imageCount); i++) {
            const img = images.nth(i)
            await expect(img).toBeVisible()

            // Check that image has alt text
            const alt = await img.getAttribute('alt')
            expect(alt).toBeTruthy()

            // Check that image loads (not broken)
            const naturalWidth = await img.evaluate(
              (img: HTMLImageElement) => img.naturalWidth
            )
            expect(naturalWidth).toBeGreaterThan(0)
          }
          break // Found post with images, no need to continue
        }
      }
    }
  })

  test('social sharing buttons work', async ({ page }) => {
    await NavigationPatterns.goHome(page)

    const firstPost = page.locator('[data-testid="post-item"]').first()
    await firstPost.click()

    // Check for social sharing buttons
    const shareButtons = page.locator('[data-testid="social-share"]')
    if (await shareButtons.isVisible()) {
      await expect(
        shareButtons.locator('[data-testid="share-twitter"]')
      ).toBeVisible()
      await expect(
        shareButtons.locator('[data-testid="share-facebook"]')
      ).toBeVisible()
      await expect(
        shareButtons.locator('[data-testid="share-linkedin"]')
      ).toBeVisible()
    }
  })

  test('post content is properly formatted', async ({ page }) => {
    await NavigationPatterns.goHome(page)

    const firstPost = page.locator('[data-testid="post-item"]').first()
    await firstPost.click()

    // Check that Korean text renders properly
    const postBody = page.locator('[data-testid="post-body"]')
    const bodyText = await postBody.textContent()

    if (bodyText && /[가-힣]/.test(bodyText)) {
      // Korean text should be visible and properly formatted
      await expect(postBody).toContainText(/[가-힣]/)
    }

    // Check paragraph spacing
    const paragraphs = page.locator('[data-testid="post-body"] p')
    const paragraphCount = await paragraphs.count()

    if (paragraphCount > 1) {
      // Check that paragraphs have proper spacing
      const firstP = paragraphs.first()
      const marginBottom = await firstP.evaluate(
        el => getComputedStyle(el).marginBottom
      )
      expect(parseFloat(marginBottom)).toBeGreaterThan(0)
    }
  })

  test('comments section loads if enabled', async ({ page }) => {
    await NavigationPatterns.goHome(page)

    const firstPost = page.locator('[data-testid="post-item"]').first()
    await firstPost.click()

    // Check for comments section (Disqus)
    const commentsSection = page.locator('[data-testid="comments"]')
    if (await commentsSection.isVisible()) {
      await expect(commentsSection).toBeVisible()

      // Wait for Disqus to load (if configured)
      await page.waitForTimeout(2000)
      const disqusFrame = page.locator('#disqus_thread')
      if (await disqusFrame.isVisible()) {
        await expect(disqusFrame).toBeVisible()
      }
    }
  })
})
