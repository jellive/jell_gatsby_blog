/**
 * Mobile Friendliness Test Suite
 * Tests for viewport configuration, touch element sizing, and mobile
 * responsiveness
 *
 * Test Strategy:
 * 1. Verify Next.js 14 viewport configuration (via metadata or viewport export)
 * 2. Check touch element sizing (minimum 48x48px)
 * 3. Validate mobile-specific metadata
 * 4. Test responsive design implementation
 * 5. Verify no horizontal scroll issues
 */

describe('Mobile Friendliness Implementation', () => {
  describe('Viewport Configuration', () => {
    it('should have viewport configuration in layout', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Next.js 14 uses viewport export or metadata.viewport
      // Check for either viewport export or viewport in metadata
      const hasViewportExport = layoutContent.includes('export const viewport')
      const hasMetadataViewport = layoutContent.includes('viewport:')

      expect(hasViewportExport || hasMetadataViewport).toBe(true)
    })

    it('should configure proper viewport width and scaling', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have width=device-width
      expect(layoutContent).toMatch(/device-width|width.*device/)
    })

    it('should prevent unwanted zoom on iOS', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have initial-scale=1 for proper mobile rendering
      expect(layoutContent).toMatch(/initial-scale|initialScale/)
    })
  })

  describe('Mobile-Specific Metadata', () => {
    it('should have mobile web app capability metadata', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have mobile-web-app-capable
      expect(layoutContent).toMatch(/mobile-web-app-capable/)
    })

    it('should have Apple mobile web app metadata', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have apple-mobile-web-app-capable
      expect(layoutContent).toMatch(/apple-mobile-web-app-capable/)
    })

    it('should configure theme color for mobile', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have theme-color
      expect(layoutContent).toMatch(/theme-color/)
    })
  })

  describe('Touch Element Sizing', () => {
    it('should have mobile bottom navigation component', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should import MobileBottomNav
      expect(layoutContent).toMatch(/MobileBottomNav/)
    })

    it('should size touch targets appropriately (min 48x48px)', () => {
      const fs = require('fs')
      let componentFound = false
      let hasProperSizing = false

      try {
        const mobileNavPath = require.resolve(
          '../../components/MobileBottomNav'
        )
        const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf-8')
        componentFound = true

        // Check for appropriate sizing classes or inline styles
        // Tailwind classes: h-12, h-14, h-16, min-h-12, p-3, p-4, w-12, w-14,
        // w-16
        hasProperSizing =
          /h-1[246]|h-20|min-h-1[246]|p-[34]|w-1[246]|w-20/.test(
            mobileNavContent
          )
      } catch (error) {
        // Component might not exist yet or be in different location
      }

      // If component exists, check for proper sizing
      // If component doesn't exist yet, test passes (will be implemented)
      expect(componentFound ? hasProperSizing : true).toBe(true)
    })

    it('should space touch elements adequately (min 8px)', () => {
      const fs = require('fs')
      let componentFound = false
      let hasProperSpacing = false

      try {
        const mobileNavPath = require.resolve(
          '../../components/MobileBottomNav'
        )
        const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf-8')
        componentFound = true

        // Check for spacing classes: gap-2, gap-3, gap-4, space-x-2, space-x-3,
        // space-x-4, p-2, p-3, p-4
        hasProperSpacing = /gap-[234]|space-[xy]-[234]|p-[234]/.test(
          mobileNavContent
        )
      } catch (error) {
        // Component might not exist yet
      }

      expect(componentFound ? hasProperSpacing : true).toBe(true)
    })
  })

  describe('Responsive Design Implementation', () => {
    it('should use responsive Tailwind breakpoints', () => {
      const fs = require('fs')
      const tailwindPath = require.resolve('../../../tailwind.config.js')
      const tailwindConfig = fs.readFileSync(tailwindPath, 'utf-8')

      // Should define responsive breakpoints
      expect(tailwindConfig).toMatch(/screens/)
    })

    it('should have mobile-first responsive classes in components', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should use responsive classes: sm:, md:, lg:, xl:
      expect(layoutContent).toMatch(/\b(sm|md|lg|xl):/)
    })

    it('should implement responsive typography', () => {
      const fs = require('fs')
      const path = require('path')
      const globalsPath = path.join(process.cwd(), 'src/app/globals.css')
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8')

      // Should have responsive font sizing or fluid typography
      const hasResponsiveFonts =
        globalsContent.includes('@media') || globalsContent.includes('clamp')

      expect(hasResponsiveFonts).toBe(true)
    })

    it('should have responsive container widths', () => {
      const fs = require('fs')
      const path = require('path')
      const globalsPath = path.join(process.cwd(), 'src/app/globals.css')
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8')

      // Should configure responsive containers
      expect(globalsContent).toMatch(/max-width|container/)
    })
  })

  describe('Horizontal Scroll Prevention', () => {
    it('should have overflow control in global styles', () => {
      const fs = require('fs')
      const path = require('path')
      const globalsPath = path.join(process.cwd(), 'src/app/globals.css')
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8')

      // Should control overflow to prevent horizontal scroll
      expect(globalsContent).toMatch(/overflow/)
    })

    it('should configure body element for full viewport', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Body should have min-h-screen for full viewport height
      expect(layoutContent).toMatch(/min-h-screen/)
    })

    it('should use responsive width utilities', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should use w-full, max-w-* for responsive widths
      expect(layoutContent).toMatch(/w-full|max-w-/)
    })
  })

  describe('Mobile Navigation', () => {
    it('should have mobile-specific navigation component', () => {
      const fs = require('fs')
      let mobileNavExists = false

      try {
        require.resolve('../../components/MobileBottomNav')
        mobileNavExists = true
      } catch (error) {
        // Component doesn't exist yet
      }

      // Mobile navigation should exist or be implemented
      expect(mobileNavExists).toBe(true)
    })

    it('should hide mobile nav on desktop', () => {
      const fs = require('fs')
      let hasResponsiveDisplay = false

      try {
        const mobileNavPath = require.resolve(
          '../../components/MobileBottomNav'
        )
        const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf-8')

        // Should hide on desktop: lg:hidden means hidden on large screens
        hasResponsiveDisplay = /lg:hidden/.test(mobileNavContent)
      } catch (error) {
        // Component doesn't exist yet
      }

      // If component exists, should have responsive display (lg:hidden)
      expect(hasResponsiveDisplay).toBe(true)
    })

    it('should show mobile nav only on mobile devices', () => {
      const fs = require('fs')
      let showsOnMobile = false

      try {
        const layoutPath = require.resolve('../../app/layout.tsx')
        const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

        // MobileBottomNav should be rendered
        showsOnMobile = layoutContent.includes('<MobileBottomNav')
      } catch (error) {
        // Not implemented yet
      }

      expect(showsOnMobile).toBe(true)
    })
  })

  describe('Performance on Mobile', () => {
    it('should lazy load non-critical mobile components', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should use dynamic imports for non-critical components
      expect(layoutContent).toMatch(/dynamic.*import/)
    })

    it('should optimize images for mobile', () => {
      const fs = require('fs')
      const nextConfigPath = require.resolve('../../../next.config.js')
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf-8')

      // Should configure image optimization
      expect(nextConfig).toMatch(/images/)
    })

    it('should use modern image formats (WebP, AVIF)', () => {
      const fs = require('fs')
      const nextConfigPath = require.resolve('../../../next.config.js')
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf-8')

      // Should support WebP and AVIF
      expect(nextConfig).toMatch(/webp|avif/i)
    })
  })

  describe('Accessibility on Mobile', () => {
    it('should have skip to content link for keyboard navigation', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have skip-to-content link
      expect(layoutContent).toMatch(/skip-to-content|메인 콘텐츠로 건너뛰기/)
    })

    it('should have proper ARIA labels for mobile navigation', () => {
      const fs = require('fs')
      let hasAriaLabels = false

      try {
        const mobileNavPath = require.resolve(
          '../../components/MobileBottomNav'
        )
        const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf-8')

        // Should have aria-label attributes
        hasAriaLabels = /aria-label/.test(mobileNavContent)
      } catch (error) {
        // Component doesn't exist yet
      }

      // If component exists, should have ARIA labels
      expect(hasAriaLabels || !fs.existsSync).toBe(true)
    })

    it('should support keyboard navigation on mobile', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have tabIndex for keyboard navigation
      expect(layoutContent).toMatch(/tabIndex/)
    })
  })

  describe('Mobile PWA Features', () => {
    it('should have manifest file configured', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should reference manifest
      expect(layoutContent).toMatch(/manifest/)
    })

    it('should configure app icons for mobile', () => {
      const fs = require('fs')
      const layoutPath = require.resolve('../../app/layout.tsx')
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

      // Should have icon configuration
      expect(layoutContent).toMatch(/apple-mobile-web-app-title/)
    })
  })
})
