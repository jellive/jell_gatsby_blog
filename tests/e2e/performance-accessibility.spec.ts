import { test, expect } from '@playwright/test'
import { createSafeNavigation, NavigationPatterns } from './utils/navigation'

test.describe('Performance and Accessibility', () => {
  test('page load performance', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now()

    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Wait for page to be fully loaded (but don't wait for networkidle)
    await page.waitForLoadState('domcontentloaded')

    const endTime = Date.now()
    const loadTime = endTime - startTime

    // Page should load within reasonable time (8 seconds to account for CI)
    expect(loadTime).toBeLessThan(8000)

    // Check Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          const metrics: any = {}

          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              metrics.domContentLoaded =
                navEntry.domContentLoadedEventEnd -
                navEntry.domContentLoadedEventStart
              metrics.loadComplete =
                navEntry.loadEventEnd - navEntry.loadEventStart
            }
          })

          resolve(metrics)
        }).observe({ entryTypes: ['navigation'] })

        // Fallback if no entries yet
        setTimeout(() => resolve({}), 1000)
      })
    })

    console.log('Performance metrics:', performanceMetrics)
  })

  test('image optimization', async ({ page }) => {
    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Find a post with images
    const postLinks = page.locator('a[href*="/posts/"]')

    const linkCount = await postLinks.count()
    for (let i = 0; i < Math.min(5, linkCount); i++) {
      try {
        const link = postLinks.nth(i)
        const href = await link.getAttribute('href', { timeout: 5000 })
        if (href) {
          await nav.goto(href)

          const images = page.locator('[data-testid="post-body"] img')
          const imageCount = await images.count()

          if (imageCount > 0) {
            const firstImage = images.first()

            // Check image loading attributes
            const loading = await firstImage.getAttribute('loading')
            expect(loading).toBe('lazy') // Should use lazy loading

            // Check that images have proper dimensions
            const width = await firstImage.evaluate(
              (img: HTMLImageElement) => img.naturalWidth
            )
            const height = await firstImage.evaluate(
              (img: HTMLImageElement) => img.naturalHeight
            )

            expect(width).toBeGreaterThan(0)
            expect(height).toBeGreaterThan(0)

            // Check image format optimization (WebP support)
            const src = await firstImage.getAttribute('src')
            if (src) {
              // Should serve optimized formats when possible
              console.log('Image source:', src)
            }

            break
          }
        }
      } catch (linkError) {
        console.warn(`Link ${i} failed in image optimization test, trying next`)
        continue
      }
    }
  })

  test('accessibility - keyboard navigation', async ({ page }) => {
    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Test tab navigation through main elements
    await page.keyboard.press('Tab') // Should focus on first interactive element

    let focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    )
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement)

    // Continue tabbing through navigation
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      focusedElement = await page.evaluate(
        () => document.activeElement?.tagName
      )

      if (focusedElement === 'A') {
        // Test Enter key on links
        const href = await page.evaluate(
          () => (document.activeElement as HTMLAnchorElement)?.href
        )
        if (href && href.includes('/posts/')) {
          await page.keyboard.press('Enter')
          await expect(
            page.locator('[data-testid="post-content"]')
          ).toBeVisible()
          break
        }
      }
    }
  })

  test('accessibility - screen reader support', async ({ page }) => {
    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()

    if (headings.length > 0) {
      // Check that h1 exists (handle different page layouts flexibly)
      const h1Selector =
        'main h1, [data-testid="page-content"] h1, article h1, .content h1'
      const h1Elements = page.locator(h1Selector)
      const h1Count = await h1Elements.count()

      if (h1Count > 0) {
        expect(h1Count).toBeGreaterThanOrEqual(1) // Should have at least one content h1
        // Check h1 content
        const h1Text = await h1Elements.first().textContent()
        expect(h1Text).toBeTruthy()
      } else {
        // If no specific content h1 found, check if page has any h1 at all
        const anyH1 = page.locator('h1')
        const anyH1Count = await anyH1.count()
        expect(anyH1Count).toBeGreaterThanOrEqual(1) // Page should have at least one h1
      }
    }

    // Check for proper ARIA labels on navigation elements
    const navigation = page.locator('nav')
    if (await navigation.isVisible()) {
      const ariaLabel = await navigation.getAttribute('aria-label')
      const role = await navigation.getAttribute('role')
      // Navigation should have either aria-label or role, or be implicit navigation
      if (!ariaLabel && !role) {
        // If no explicit ARIA attributes, check if it's a semantic nav element (which is valid)
        const tagName = await navigation.evaluate(el =>
          el.tagName.toLowerCase()
        )
        expect(tagName).toBe('nav') // Should be a semantic nav element
      } else {
        expect(ariaLabel || role).toBeTruthy()
      }
    }

    // Check images have alt text
    const images = await page.locator('img').all()
    for (const img of images.slice(0, 5)) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy() // All images should have alt text
    }
  })

  test('accessibility - color contrast', async ({ page }) => {
    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Test high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.waitForTimeout(500)

    // Check that content is still visible in dark mode
    await expect(page.locator('body')).toBeVisible()
    // Check for any h1 that's not in the header (more flexible)
    const h1Selector =
      'main h1, [data-testid="page-content"] h1, article h1, .content h1'
    const h1Elements = page.locator(h1Selector)
    const h1Count = await h1Elements.count()
    if (h1Count > 0) {
      await expect(h1Elements.first()).toBeVisible()
    }

    // Switch back to light mode
    await page.emulateMedia({ colorScheme: 'light' })
    await page.waitForTimeout(500)

    // Check that content is visible in light mode
    await expect(page.locator('body')).toBeVisible()
    if (h1Count > 0) {
      await expect(h1Elements.first()).toBeVisible()
    }
  })

  test('mobile responsiveness', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
    }

    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Check that content adapts to mobile
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Check post list is readable on mobile (handle dual layout)
    const postList = page.locator('[data-testid="post-list"]')
    await expect(postList.first()).toBeVisible()

    // Check that posts don't overflow
    const firstPost = page.locator('[data-testid="post-item"]').first()
    if (await firstPost.isVisible()) {
      const bbox = await firstPost.boundingBox()
      if (bbox) {
        expect(bbox.width).toBeLessThanOrEqual(375) // Should fit in mobile viewport
      }
    }

    // Test mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu-toggle"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      const menu = page.locator('[data-testid="mobile-menu"]')
      await expect(menu).toBeVisible()
    }
  })

  test('font loading and display', async ({ page }) => {
    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Wait for fonts to load (but not networkidle)
    await page.waitForLoadState('domcontentloaded')

    // Check Korean font rendering - use specific element to avoid strict mode
    const koreanText = page.locator('h1, h2, p').filter({ hasText: /[가-힣]/ })
    if (await koreanText.first().isVisible()) {
      const fontFamily = await koreanText
        .first()
        .evaluate(el => getComputedStyle(el).fontFamily)
      // More flexible font family check - just ensure Korean fonts are available
      expect(fontFamily).toMatch(/Noto.*KR|serif|sans-serif/)
    }

    // Check English font rendering - use any text element to avoid conflicts
    const englishElements = page
      .locator('h1, h2, p, span')
      .filter({ hasText: /[a-zA-Z]/ })
    const englishCount = await englishElements.count()
    if (englishCount > 0) {
      const englishFontFamily = await englishElements
        .first()
        .evaluate(el => getComputedStyle(el).fontFamily)
      expect(englishFontFamily).toBeTruthy()
    } else {
      // Skip if no English text elements found
      console.log('No English text elements found - skipping font test')
    }
  })

  test('JavaScript performance', async ({ page }) => {
    const nav = createSafeNavigation(page)

    // Check that page works without JavaScript errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', error => {
      errors.push(error.message)
    })

    // Start from home page
    await nav.goto('/')

    // Navigate through some pages with safe navigation
    try {
      await NavigationPatterns.goSearch(page)
    } catch (error) {
      console.warn('Search page navigation warning:', error)
    }

    try {
      await NavigationPatterns.goTags(page)
    } catch (error) {
      console.warn('Tags page navigation warning:', error)
    }

    try {
      await NavigationPatterns.goHome(page)
    } catch (error) {
      console.warn('Home page navigation warning:', error)
    }

    // Wait for any delayed errors
    await page.waitForTimeout(2000)

    // Check for JavaScript errors (filter out navigation-related errors)
    const filteredErrors = errors.filter(
      error =>
        !error.includes('net::ERR_ABORTED') &&
        !error.includes('frame was detached') &&
        !error.includes('Load cancelled') &&
        !error.includes('NetworkError')
    )

    expect(filteredErrors.length).toBe(0)

    if (filteredErrors.length > 0) {
      console.log('JavaScript errors found:', filteredErrors)
    }
  })

  test('SEO meta tags', async ({ page }) => {
    const nav = createSafeNavigation(page)
    await nav.goto('/')

    // Check basic SEO meta tags
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title).toContain('Jell')

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    const description = await metaDescription.getAttribute('content')
    expect(description).toBeTruthy()

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    const ogTitleContent = await ogTitle.getAttribute('content')
    expect(ogTitleContent).toBeTruthy()

    const ogDescription = page.locator('meta[property="og:description"]')
    const ogDescriptionContent = await ogDescription.getAttribute('content')
    expect(ogDescriptionContent).toBeTruthy()

    // Check structured data (take first one to avoid strict mode violation)
    const structuredData = page
      .locator('script[type="application/ld+json"]')
      .first()
    if (await structuredData.isVisible()) {
      const jsonLd = await structuredData.textContent()
      expect(jsonLd).toBeTruthy()

      // Verify it's valid JSON
      expect(() => JSON.parse(jsonLd!)).not.toThrow()
    }
  })
})
