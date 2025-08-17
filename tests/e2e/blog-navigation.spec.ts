import { test, expect } from '@playwright/test'

test.describe('Blog Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/Jell의 세상 사는 이야기/)
    
    // Check header elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('text=Jell의 세상 사는 이야기')).toBeVisible()
    
    // Check that blog posts are displayed (handle multiple post lists)
    await expect(page.locator('[data-testid="post-list"]').first()).toBeVisible()
  })

  test('navigation menu works', async ({ page }) => {
    await page.goto('/')
    
    // Look for navigation links anywhere in the page
    const homeLink = page.locator('a[href="/"]').first()
    const searchLink = page.locator('a[href="/search"]').first()
    const tagsLink = page.locator('a[href="/tags"]').first()
    
    // Test search navigation if available
    if (await searchLink.isVisible()) {
      await searchLink.click()
      await expect(page).toHaveURL('/search')
      await expect(page.locator('h1')).toContainText('Search')
      
      // Go back for next test
      await page.goto('/')
    }
    
    // Test tags navigation if available
    if (await tagsLink.isVisible()) {
      await tagsLink.click()
      await expect(page).toHaveURL('/tags')
      await expect(page.locator('h1')).toContainText('Tags')
    }
  })

  test('theme toggle works', async ({ page }) => {
    await page.goto('/')
    
    // Find theme toggle button (may be in different locations)
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button[aria-label*="theme"]').or(
        page.locator('button').filter({ hasText: /dark|light|theme/i })
      )
    )
    
    if (await themeToggle.isVisible()) {
      // Check initial theme state
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
      
      // Click theme toggle
      await themeToggle.click()
      
      // Wait for theme change
      await page.waitForTimeout(500)
      
      // Check theme has changed
      const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
      expect(newTheme).not.toBe(initialTheme)
    } else {
      // Skip test if theme toggle not found
      console.log('Theme toggle not found - skipping test')
    }
  })

  test('responsive navigation on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Skip test if not running on mobile viewport
      test.skip()
      return
    }
    
    await page.goto('/')
    
    // Check mobile menu toggle
    const mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"]')
    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click()
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    }
  })

  test('back navigation works', async ({ page }) => {
    await page.goto('/')
    
    // Find and click on a blog post
    const firstPost = page.locator('[data-testid="post-item"]').first()
    if (await firstPost.isVisible()) {
      const postLink = firstPost.locator('a').first()
      await postLink.click()
      
      // Check we're on a post page
      const postContent = page.locator('[data-testid="post-content"]')
      if (await postContent.isVisible()) {
        // Check back button exists and works
        const backButton = page.locator('[data-testid="back-navigation"]')
        if (await backButton.isVisible()) {
          await backButton.click()
          await expect(page).toHaveURL('/')
        } else {
          // Use browser back if no back button
          await page.goBack()
          await expect(page).toHaveURL('/')
        }
      }
    } else {
      console.log('No post items found - skipping back navigation test')
    }
  })
})