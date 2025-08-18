import { test, expect } from '@playwright/test'

test.describe('Image Paths', () => {
  test('blog post images use correct hierarchical paths', async ({ page }) => {
    // Navigate to a post with images
    await page.goto('/posts/bicycle/2018/08/24/제주도_1일차')

    // Wait for content to load
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()

    // Check that images exist and use correct paths
    const images = page.locator('[data-testid="post-content"] img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const image = images.nth(i)
        const src = await image.getAttribute('src')

        if (src) {
          // Verify the image path follows the pattern: /images/category/year/month/day/images/filename
          expect(src).toMatch(
            /^\/images\/bicycle\/2018\/08\/24\/images\/[^\/]+\.(png|jpg|jpeg|gif|webp)$/i
          )

          // Verify the image actually loads
          const response = await page.request.get(src)
          expect(response.status()).toBe(200)
          expect(response.headers()['content-type']).toMatch(/^image\//)
        }
      }
    }
  })

  test('image paths are consistent across different post categories', async ({
    page,
  }) => {
    // Test different category posts to ensure path pattern is consistent
    const testPosts = [
      {
        path: '/posts/bicycle/2018/08/24/제주도_1일차',
        pattern: /^\/images\/bicycle\/2018\/08\/24\/images\//,
      },
      // Add more test cases as needed based on available posts
    ]

    for (const testPost of testPosts) {
      await page.goto(testPost.path)

      // Check if page loads successfully
      const postContent = page.locator('[data-testid="post-content"]')
      if (await postContent.isVisible()) {
        const images = postContent.locator('img')
        const imageCount = await images.count()

        if (imageCount > 0) {
          const firstImageSrc = await images.first().getAttribute('src')
          if (firstImageSrc) {
            expect(firstImageSrc).toMatch(testPost.pattern)
          }
        }
      }
    }
  })

  test('image URLs work correctly when accessed directly', async ({ page }) => {
    // Test direct image access
    const testImageUrl = '/images/bicycle/2018/08/24/images/20180813_181529.png'

    const response = await page.request.get(testImageUrl)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')

    // Check cache headers (development vs production have different cache settings)
    const cacheControl = response.headers()['cache-control']
    expect(cacheControl).toBeDefined()
    // In development: max-age=0, in production: max-age=31536000
    expect(cacheControl).toMatch(/max-age=\d+/)
  })

  test('non-existent images return 404', async ({ page }) => {
    const nonExistentImageUrl =
      '/images/bicycle/2018/08/24/images/non-existent-image.png'

    const response = await page.request.get(nonExistentImageUrl)
    expect(response.status()).toBe(404)
  })

  test('invalid image paths return 404', async ({ page }) => {
    const invalidPaths = [
      '/images/invalid/path/images/test.png',
      '/images/bicycle/images/test.png', // Missing date parts
      '/images/bicycle/2018/images/test.png', // Missing month and day
    ]

    for (const invalidPath of invalidPaths) {
      const response = await page.request.get(invalidPath)
      expect(response.status()).toBe(404)
    }
  })

  test('different image formats are served correctly', async ({ page }) => {
    // Test different image formats if available
    const imageFormats = [
      {
        path: '/images/bicycle/2018/08/24/images/20180813_181529.png',
        contentType: 'image/png',
      },
      // Add more formats as needed based on available images
    ]

    for (const imageFormat of imageFormats) {
      const response = await page.request.get(imageFormat.path)
      if (response.status() === 200) {
        expect(response.headers()['content-type']).toBe(imageFormat.contentType)
      }
    }
  })

  test('featured images use correct paths', async ({ page }) => {
    // Navigate to homepage and check post thumbnails/featured images
    await page.goto('/')

    const postItems = page.locator('[data-testid="post-item"]')
    const postCount = await postItems.count()

    if (postCount > 0) {
      // Check a few posts for featured images
      for (let i = 0; i < Math.min(3, postCount); i++) {
        const postItem = postItems.nth(i)
        const images = postItem.locator('img')
        const imageCount = await images.count()

        if (imageCount > 0) {
          const imageSrc = await images.first().getAttribute('src')
          if (imageSrc && imageSrc.includes('/images/')) {
            // Verify featured image path pattern
            expect(imageSrc).toMatch(
              /^\/images\/[^\/]+\/\d{4}\/\d{2}\/\d{2}\/images\/[^\/]+\.(png|jpg|jpeg|gif|webp)$/i
            )

            // Verify the image loads
            const response = await page.request.get(imageSrc)
            expect(response.status()).toBe(200)
          }
        }
      }
    }
  })
})
