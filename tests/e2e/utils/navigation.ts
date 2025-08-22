import { Page, expect } from '@playwright/test'

/**
 * Safe navigation utility for E2E tests
 * Handles timeout issues and provides fallback strategies
 */
export class SafeNavigation {
  constructor(private page: Page) {}

  /**
   * Navigate to a URL with multiple fallback strategies
   */
  async goto(
    url: string,
    options?: { timeout?: number; waitUntil?: string }
  ): Promise<void> {
    // Increase timeout for heavy pages like /tags
    const isHeavyPage = url.includes('/tags') || url.includes('/search')
    const defaultTimeout = isHeavyPage ? 45000 : 25000
    const { timeout = defaultTimeout, waitUntil = 'domcontentloaded' } =
      options || {}

    // Strategy 1: Primary navigation with extended timeout for heavy pages
    try {
      await this.page.goto(url, {
        waitUntil: waitUntil as any,
        timeout,
      })

      // Wait for essential elements to be ready
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 })
      return
    } catch (error) {
      // Only log on heavy pages and actual failures
      if (isHeavyPage) {
        console.warn(`❌ Primary navigation failed for ${url}`)
      }
    }

    // Strategy 2: Fallback with 'load' event and longer timeout
    try {
      await this.page.goto(url, {
        waitUntil: 'load',
        timeout: Math.max(30000, timeout * 0.8),
      })
      return
    } catch (fallbackError) {
      // Only log heavy page fallback failures
      if (isHeavyPage) {
        console.warn(`❌ Fallback navigation failed for ${url}`)
      }
    }

    // Strategy 3: Minimal navigation without wait conditions
    try {
      await this.page.goto(url, {
        timeout: 20000,
      })

      // Wait for basic page structure
      await this.page.waitForSelector('body', { timeout: 8000 })

      // For heavy pages, wait a bit longer for content to load
      if (isHeavyPage) {
        await this.page.waitForTimeout(3000)

        // Try to wait for specific content indicators
        try {
          if (url.includes('/tags')) {
            await this.page.waitForSelector(
              '[data-testid="tag-list"], .tag-list, h1',
              { timeout: 5000 }
            )
          }
        } catch (contentWaitError) {
          // Silent failure for content wait - not critical
        }
      }

      return
    } catch (lastResortError) {
      // Only log actual failures
      console.error(`💥 All navigation strategies failed for ${url}`)
      const errorMessage =
        lastResortError instanceof Error
          ? lastResortError.message
          : String(lastResortError)
      throw new Error(
        `Failed to navigate to ${url} after multiple attempts. Last error: ${errorMessage}`
      )
    }
  }

  /**
   * Navigate and wait for specific selector to be visible
   */
  async gotoAndWaitFor(
    url: string,
    selector: string,
    options?: { timeout?: number; waitUntil?: string }
  ): Promise<void> {
    await this.goto(url, options)

    try {
      await this.page.waitForSelector(selector, { timeout: 10000 })
    } catch (error) {
      console.warn(
        `Selector ${selector} not found after navigation to ${url}:`,
        error
      )
      // Don't throw here, let the test decide if this is critical
    }
  }

  /**
   * Navigate with retry logic
   */
  async gotoWithRetry(
    url: string,
    maxRetries: number = 2,
    options?: { timeout?: number; waitUntil?: string }
  ): Promise<void> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.goto(url, options)
        return // Success
      } catch (error) {
        lastError = error as Error
        console.warn(
          `Navigation attempt ${attempt + 1} failed for ${url}:`,
          error
        )

        if (attempt < maxRetries) {
          // Wait before retry
          await this.page.waitForTimeout(1000 * (attempt + 1))
        }
      }
    }

    throw (
      lastError ||
      new Error(`Failed to navigate to ${url} after ${maxRetries + 1} attempts`)
    )
  }

  /**
   * Click element and navigate with safety checks
   */
  async clickAndNavigate(
    selector: string,
    expectedUrl?: string | RegExp,
    options?: { timeout?: number }
  ): Promise<void> {
    const { timeout = 15000 } = options || {}

    try {
      // Wait for element to be clickable
      await this.page.waitForSelector(selector, { timeout: 10000 })

      // Click the element
      await this.page.click(selector, { timeout })

      // Wait for navigation to complete
      try {
        await this.page.waitForLoadState('domcontentloaded', { timeout })
      } catch (navError) {
        console.warn('Navigation load state timeout:', navError)
        // Continue anyway, the page might have loaded
      }

      // Check if URL changed or matches expected
      if (expectedUrl) {
        const newUrl = this.page.url()
        if (expectedUrl instanceof RegExp) {
          expect(newUrl).toMatch(expectedUrl)
        } else {
          expect(newUrl).toContain(expectedUrl)
        }
      }
    } catch (error) {
      console.warn(`Click and navigate failed for selector ${selector}:`, error)
      throw error
    }
  }

  /**
   * Safe navigation for test setup - ensures basic page functionality
   */
  async ensurePageReady(
    url: string,
    essentialSelector: string = 'body'
  ): Promise<void> {
    await this.goto(url)

    // Ensure essential elements are present
    await expect(this.page.locator(essentialSelector)).toBeVisible()

    // Basic page health check
    const title = await this.page.title()
    expect(title).toBeTruthy()
    expect(title).not.toContain('404')
    expect(title).not.toContain('Error')
  }
}

/**
 * Create a SafeNavigation instance for a page
 */
export function createSafeNavigation(page: Page): SafeNavigation {
  return new SafeNavigation(page)
}

/**
 * Common navigation patterns for specific page types
 */
export const NavigationPatterns = {
  /**
   * Navigate to homepage and ensure it loads
   */
  async goHome(page: Page): Promise<void> {
    const nav = createSafeNavigation(page)
    await nav.ensurePageReady('/', 'header')
  },

  /**
   * Navigate to search page
   */
  async goSearch(page: Page): Promise<void> {
    const nav = createSafeNavigation(page)
    await nav.gotoAndWaitFor('/search', 'h1')
  },

  /**
   * Navigate to tags page
   */
  async goTags(page: Page): Promise<void> {
    const nav = createSafeNavigation(page)
    await nav.gotoAndWaitFor('/tags', '[data-testid="tag-list"]')
  },

  /**
   * Navigate to a specific post
   */
  async goPost(page: Page, postUrl: string): Promise<void> {
    const nav = createSafeNavigation(page)
    await nav.gotoAndWaitFor(postUrl, '[data-testid="post-content"]')
  },
}
