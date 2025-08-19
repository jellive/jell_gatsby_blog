/**
 * Security utilities for safe HTML processing and sanitization
 *
 * This module provides secure methods for handling HTML content,
 * preventing XSS attacks and HTML injection vulnerabilities.
 */

import createDOMPurify from 'isomorphic-dompurify'

// Initialize DOMPurify for both server and client environments
const DOMPurify = createDOMPurify()

/**
 * Safely extract text content from HTML strings
 *
 * This function uses DOMPurify to safely strip HTML tags and prevent
 * injection attacks that could occur with simple regex replacements.
 *
 * @param htmlString - The HTML string to extract text from
 * @param maxLength - Maximum length of extracted text (default: 40)
 * @returns Safely extracted text content
 */
export function safeExtractText(
  htmlString: string,
  maxLength: number = 40
): string {
  if (!htmlString || typeof htmlString !== 'string') {
    return 'NO_TEXT'
  }

  try {
    // First sanitize the HTML to remove any potentially dangerous content
    const sanitized = DOMPurify.sanitize(htmlString, {
      ALLOWED_TAGS: [], // Remove all tags
      ALLOWED_ATTR: [], // Remove all attributes
      KEEP_CONTENT: true, // Keep text content
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    })

    // Enhanced safety: comprehensive dangerous content removal
    const text = sanitized
      .replace(/&[a-zA-Z0-9#]+;/g, ' ') // Remove HTML entities
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/data:/gi, '') // Remove data: protocols
      .replace(/vbscript:/gi, '') // Remove vbscript: protocols
      .replace(/alert\s*\([^)]*\)/gi, '') // Remove alert() calls
      .replace(/eval\s*\([^)]*\)/gi, '') // Remove eval() calls
      .replace(/expression\s*\([^)]*\)/gi, '') // Remove expression() calls
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // If the sanitization resulted in empty or very short content, return NO_TEXT
    if (!text || text.length < 2) {
      return 'NO_TEXT'
    }

    // Truncate safely
    return text.length > maxLength
      ? text.substring(0, maxLength).trim() + '...'
      : text
  } catch (error) {
    return 'NO_TEXT'
  }
}

/**
 * Safely extract text from heading elements
 *
 * Specifically designed for heading elements, this function safely
 * extracts text content while handling nested elements and complex structures.
 *
 * @param headingHtml - HTML string containing heading element
 * @returns Safely extracted heading text
 */
export function safeExtractHeadingText(headingHtml: string): string {
  if (!headingHtml || typeof headingHtml !== 'string') {
    return 'NO_TEXT'
  }

  try {
    // Multi-step extraction for maximum safety

    // Step 1: Try to extract content between heading tags
    const contentMatch = headingHtml.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i)
    if (contentMatch?.[1]) {
      return safeExtractText(contentMatch[1])
    }

    // Step 2: Try to extract any content between > and <
    const simpleMatch = headingHtml.match(/>([^<]+)</)?.[1]
    if (simpleMatch) {
      return safeExtractText(simpleMatch)
    }

    // Step 3: Fallback to full sanitization
    return safeExtractText(headingHtml)
  } catch (error) {
    return 'NO_TEXT'
  }
}

/**
 * Validate and sanitize ID attributes
 *
 * Ensures ID values are safe for use in HTML and URLs
 *
 * @param id - The ID string to validate
 * @returns Safe ID string or 'NO_ID' if invalid
 */
export function sanitizeId(id: string | undefined | null): string {
  if (!id || typeof id !== 'string') {
    return 'NO_ID'
  }

  try {
    // Remove any potentially dangerous characters
    const sanitized = DOMPurify.sanitize(id, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    })

    // Ensure ID follows HTML standards (letters, digits, hyphens, underscores, periods)
    // Also remove HTML entities
    const validId = sanitized
      .replace(/&[a-zA-Z0-9#]+;/g, '') // Remove HTML entities
      .replace(/[^a-zA-Z0-9\-_.]/g, '') // Keep only valid ID characters

    return validId || 'NO_ID'
  } catch (error) {
    return 'NO_ID'
  }
}

/**
 * Safely truncate text content for display
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Safely truncated text
 */
export function safeTruncate(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  // Find the last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.7) {
    // Only use space if it's not too far back
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}

/**
 * Security-focused HTML processing configuration
 */
export const SAFE_HTML_CONFIG = {
  // For text extraction - remove all tags
  TEXT_ONLY: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },

  // For heading processing - allow only safe inline elements
  HEADING_SAFE: {
    ALLOWED_TAGS: ['strong', 'em', 'code'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
} as const

/**
 * Test suite for security utilities
 *
 * This function runs basic security tests to ensure our utilities
 * properly handle various attack vectors.
 */
export function runSecurityTests(): boolean {
  const tests = [
    // Basic HTML injection
    {
      input: '<script>alert("xss")</script>Hello',
      expected: 'Hello',
      description: 'Script tag injection',
    },
    // Nested tags
    {
      input: '<div><script>alert("xss")</script>Safe Text</div>',
      expected: 'Safe Text',
      description: 'Nested script injection',
    },
    // Event handlers
    {
      input: '<span onload="alert(\'xss\')">Text</span>',
      expected: 'Text',
      description: 'Event handler injection',
    },
    // Malformed HTML
    {
      input: '<div>Text<script>alert("xss")</script>More</div>',
      expected: 'Text More',
      description: 'Mixed content with script',
    },
  ]

  // Only log in development environment or during testing
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.log('🛡️ Running security tests...')
  }

  let passed = 0
  for (const test of tests) {
    try {
      const result = safeExtractText(test.input)
      const success = result.includes(test.expected.substring(0, 10))

      if (success) {
        passed++
        if (
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
        ) {
          console.log(`✅ ${test.description}: PASS`)
        }
      } else {
        if (
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
        ) {
          console.error(`❌ ${test.description}: FAIL`)
          console.error(`   Expected: ${test.expected}`)
          console.error(`   Got: ${result}`)
        }
      }
    } catch (error) {
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test'
      ) {
        console.error(`💥 ${test.description}: ERROR - ${error}`)
      }
    }
  }

  const success = passed === tests.length
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.log(`🛡️ Security tests: ${passed}/${tests.length} passed`)
  }

  return success
}
