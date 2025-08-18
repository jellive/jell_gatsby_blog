'use client'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

// FontAwesome configuration for Next.js
// This prevents FontAwesome from adding its CSS since we did it manually above
config.autoAddCss = false

/**
 * FontAwesome initialization component for Next.js App Router
 * This component should be imported in the root layout to properly initialize FontAwesome
 *
 * Key configurations:
 * - autoAddCss: false - Prevents FontAwesome from adding CSS automatically to avoid conflicts
 * - CSS is imported manually above to ensure it's available during SSR
 */
export default function FontAwesomeInit() {
  // This component doesn't render anything, it just initializes FontAwesome
  return null
}
