/**
 * Performance Optimization Test Suite
 * Tests for Core Web Vitals metrics (LCP, FID, CLS)
 *
 * Test Strategy:
 * 1. Verify image optimization configuration
 * 2. Check resource loading priorities
 * 3. Validate font loading strategy
 * 4. Test preload/prefetch directives
 */

describe('Performance Optimization', () => {
  describe('LCP (Largest Contentful Paint)', () => {
    describe('Image Optimization', () => {
      it('should configure Next.js Image with WebP and AVIF formats', () => {
        // This test validates next.config.js image configuration
        const nextConfig = require('../../../next.config.js')

        expect(nextConfig.default.images.formats).toContain('image/webp')
        expect(nextConfig.default.images.formats).toContain('image/avif')
      })

      it('should set appropriate cache TTL for images', () => {
        const nextConfig = require('../../../next.config.js')

        // Expect at least 1 year cache (31536000 seconds)
        expect(
          nextConfig.default.images.minimumCacheTTL
        ).toBeGreaterThanOrEqual(31536000)
      })
    })

    describe('Resource Prioritization', () => {
      it('should preload critical fonts', async () => {
        // Test will verify font preloading in layout
        const layoutPath = require.resolve('../../app/layout.tsx')
        const fs = require('fs')
        const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

        // Check for font preload link tags
        expect(layoutContent).toMatch(/rel=["']preload["']/)
        expect(layoutContent).toMatch(/as=["']font["']/)
      })

      it('should configure font display strategy', async () => {
        const layoutPath = require.resolve('../../app/layout.tsx')
        const fs = require('fs')
        const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

        // Check for font-display: swap configuration in URL parameter
        // Google Fonts URLs use ?display=swap or &display=swap format
        expect(layoutContent).toMatch(/[?&]display=swap/)
      })
    })

    describe('Render Blocking Resources', () => {
      it('should remove console.log in production', () => {
        const nextConfig = require('../../../next.config.js')

        // Verify console removal configuration exists
        // In production: removeConsole is an object with exclude array
        // In development: removeConsole is false
        const removeConsole = nextConfig.default.compiler.removeConsole

        if (process.env.NODE_ENV === 'production') {
          expect(removeConsole).toEqual(
            expect.objectContaining({
              exclude: expect.arrayContaining(['error', 'warn']),
            })
          )
        } else {
          // In development or test, it can be false or an object
          expect(
            removeConsole === false ||
              (typeof removeConsole === 'object' && removeConsole !== null)
          ).toBe(true)
        }
      })

      it('should enable React strict mode', () => {
        const nextConfig = require('../../../next.config.js')

        expect(nextConfig.default.reactStrictMode).toBe(true)
      })
    })
  })

  describe('Performance Headers', () => {
    it('should configure image caching headers', async () => {
      const nextConfig = require('../../../next.config.js')
      const headers = await nextConfig.default.headers()

      // Find image cache headers
      const imageHeaders = headers.find(
        (h: { source: string }) => h.source === '/images/(.*)'
      )

      expect(imageHeaders).toBeDefined()
      expect(imageHeaders?.headers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'Cache-Control',
            value: expect.stringContaining('public'),
          }),
        ])
      )
    })

    it('should set security headers for all routes', async () => {
      const nextConfig = require('../../../next.config.js')
      const headers = await nextConfig.default.headers()

      // Find root route headers
      const rootHeaders = headers.find(
        (h: { source: string }) => h.source === '/(.*)'
      )

      expect(rootHeaders).toBeDefined()
      expect(rootHeaders?.headers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          }),
        ])
      )
    })
  })

  describe('Bundle Optimization', () => {
    it('should optimize package imports', () => {
      const nextConfig = require('../../../next.config.js')

      expect(
        nextConfig.default.experimental?.optimizePackageImports
      ).toBeDefined()
      expect(nextConfig.default.experimental?.optimizePackageImports).toContain(
        '@fortawesome/react-fontawesome'
      )
      expect(nextConfig.default.experimental?.optimizePackageImports).toContain(
        'lucide-react'
      )
    })
  })
})
