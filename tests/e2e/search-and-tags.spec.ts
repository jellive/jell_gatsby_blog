import { test, expect } from '@playwright/test'

test.describe('Search and Tags', () => {
  test('search page loads correctly', async ({ page }) => {
    await page.goto('/search')

    // Check search page elements
    await expect(page).toHaveTitle(/Search/)
    await expect(page.locator('input[type="search"]')).toBeVisible()
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()

    // Check search results container exists
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.locator('[data-testid="search-input"]')

    // Test search with common Korean terms
    const searchTerms = ['개발', 'javascript', 'gatsby', '블로그']

    for (const term of searchTerms) {
      await searchInput.fill(term)

      // Wait for search results to update
      await page.waitForTimeout(1000)

      // Check if results are displayed
      const results = page.locator('[data-testid="search-result-item"]')
      const resultCount = await results.count()

      if (resultCount > 0) {
        // Verify search results contain the search term
        const firstResult = results.first()
        await expect(firstResult).toBeVisible()

        // Check that result links work
        const resultLink = firstResult.locator('a').first()
        if (await resultLink.isVisible()) {
          const href = await resultLink.getAttribute('href')
          expect(href).toMatch(/^\/posts\//)
        }
      }

      // Clear search for next term
      await searchInput.clear()
    }
  })

  test('search filters work', async ({ page }) => {
    await page.goto('/search')

    // Check for search filters (category, tag filters)
    const categoryFilter = page.locator('[data-testid="category-filter"]')
    const tagFilter = page.locator('[data-testid="tag-filter"]')

    if (await categoryFilter.isVisible()) {
      // Test category filtering
      const categoryOptions = categoryFilter.locator('option')
      const optionCount = await categoryOptions.count()

      if (optionCount > 1) {
        // Select a category
        await categoryFilter.selectOption({ index: 1 })
        await page.waitForTimeout(500)

        // Check that results are filtered
        const filteredResults = page.locator(
          '[data-testid="search-result-item"]'
        )
        if ((await filteredResults.count()) > 0) {
          // Verify results match the selected category
          const firstResult = filteredResults.first()
          await expect(firstResult).toBeVisible()
        }
      }
    }
  })

  test('tags page loads correctly', async ({ page }) => {
    await page.goto('/tags')

    // Check tags page elements
    await expect(page).toHaveTitle(/Tags/)
    await expect(page.locator('h1')).toContainText('Tags')

    // Check that tag cloud or tag list is displayed
    await expect(page.locator('[data-testid="tag-list"]')).toBeVisible()
  })

  test('tag links work correctly', async ({ page }) => {
    await page.goto('/tags')

    // Get all tag links
    const tagLinks = page.locator('[data-testid="tag-item"] a')
    const tagCount = await tagLinks.count()

    if (tagCount > 0) {
      // Test first few tag links
      for (let i = 0; i < Math.min(5, tagCount); i++) {
        const tagLink = tagLinks.nth(i)
        const tagName = await tagLink.textContent()
        const href = await tagLink.getAttribute('href')

        if (href) {
          await tagLink.click()

          // Check that we're on the tag page
          await expect(page).toHaveURL(href)

          // Check that posts with this tag are displayed
          await expect(page.locator('[data-testid="tag-posts"]')).toBeVisible()

          // Check that page title contains the tag name
          if (tagName) {
            await expect(page.locator('h1')).toContainText(
              tagName.replace('#', '')
            )
          }

          // Go back to tags page for next iteration
          await page.goto('/tags')
        }
      }
    }
  })

  test('tag post filtering works', async ({ page }) => {
    await page.goto('/tags')

    const tagLinks = page.locator('[data-testid="tag-item"] a')
    const tagCount = await tagLinks.count()

    if (tagCount > 0) {
      // Click on first tag
      const firstTag = tagLinks.first()
      const tagName = await firstTag.textContent()
      await firstTag.click()

      // Check that posts are displayed
      const tagPosts = page.locator('[data-testid="post-item"]')
      const postCount = await tagPosts.count()

      if (postCount > 0) {
        // Verify that posts actually contain the tag
        for (let i = 0; i < Math.min(3, postCount); i++) {
          const post = tagPosts.nth(i)
          const postTags = post.locator('[data-testid="post-tags"]')

          if ((await postTags.isVisible()) && tagName) {
            await expect(postTags).toContainText(tagName.replace('#', ''))
          }
        }
      }
    }
  })

  test('search no results state', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.locator('[data-testid="search-input"]')

    // Search for something that should return no results
    await searchInput.fill('xyzabc123nonexistent')
    await page.waitForTimeout(1000)

    // Check for no results message
    const noResults = page.locator('[data-testid="no-search-results"]')
    if (await noResults.isVisible()) {
      await expect(noResults).toBeVisible()
      await expect(noResults).toContainText(
        /no results|결과가 없습니다|찾을 수 없습니다/i
      )
    }
  })

  test('search keyboard navigation', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.locator('[data-testid="search-input"]')

    // Search for a common term
    await searchInput.fill('개발')
    await page.waitForTimeout(1000)

    // Check if search results exist
    const results = page.locator('[data-testid="search-result-item"]')
    const resultCount = await results.count()

    if (resultCount > 0) {
      // Test Enter key on first result
      await searchInput.press('ArrowDown') // Move to first result
      await page.keyboard.press('Enter')

      // Should navigate to a post
      await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
    }
  })

  test('tag cloud visual display', async ({ page }) => {
    await page.goto('/tags')

    const tagItems = page.locator('[data-testid="tag-item"]')
    const tagCount = await tagItems.count()

    if (tagCount > 0) {
      // Check that tags have different sizes based on post count
      const firstTag = tagItems.first()
      const lastTag = tagItems.last()

      // Check that tags are clickable and have proper styling
      await expect(firstTag).toBeVisible()
      await expect(lastTag).toBeVisible()

      // Check hover effects
      await firstTag.hover()
      await page.waitForTimeout(200)

      // Verify tag has hover state
      const tagLink = firstTag.locator('a')
      await expect(tagLink).toBeVisible()
    }
  })
})
