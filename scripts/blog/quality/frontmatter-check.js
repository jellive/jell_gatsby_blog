// Frontmatter schema validation
// Checks: required fields, category mapping, date format

import matter from 'gray-matter'
import { CATEGORIES } from '../categories.js'

const REQUIRED_FIELDS = ['title', 'date', 'category', 'tags']

const VALID_CATEGORIES = new Set(Object.values(CATEGORIES).map(c => c.category))

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/, // 2025-08-23
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO 8601
]

export function checkFrontmatter(content, filePath) {
  const errors = []
  const warnings = []

  let data
  try {
    const parsed = matter(content)
    data = parsed.data
  } catch (e) {
    errors.push(`Failed to parse frontmatter: ${e.message}`)
    return { errors, warnings }
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ''
    ) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Validate category value
  if (data.category && !VALID_CATEGORIES.has(data.category)) {
    const valid = [...VALID_CATEGORIES].join(', ')
    errors.push(`Invalid category: "${data.category}". Valid: ${valid}`)
  }

  // Validate date format
  if (data.date) {
    const dateStr = String(data.date)
    const validDate = DATE_PATTERNS.some(p => p.test(dateStr))
    if (!validDate) {
      errors.push(
        `Invalid date format: "${dateStr}". Use YYYY-MM-DD or ISO 8601`
      )
    }
  }

  // Validate tags is an array
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push(`tags must be an array, got: ${typeof data.tags}`)
    } else if (data.tags.length === 0) {
      warnings.push('tags array is empty')
    }
  }

  // Warn if title has special characters that may cause issues
  if (data.title && /['"\\]/.test(data.title)) {
    warnings.push(
      'Title contains quotes or backslashes - may cause YAML issues'
    )
  }

  return { errors, warnings, data }
}
