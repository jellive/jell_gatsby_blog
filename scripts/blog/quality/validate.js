#!/usr/bin/env node

// Unified quality validator
// Usage: node scripts/blog/quality/validate.js path/to/post.md [path2.md ...]
// Runs all quality checks and reports results

import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { checkFrontmatter } from './frontmatter-check.js'
import { checkTone } from './tone-check.js'
import { checkStructure } from './structure-check.js'

async function validatePost(filePath) {
  const absPath = resolve(filePath)
  const content = await readFile(absPath, 'utf-8')

  const results = {
    file: filePath,
    frontmatter: checkFrontmatter(content, filePath),
    tone: checkTone(content),
    structure: checkStructure(content, filePath),
  }

  const allErrors = [
    ...results.frontmatter.errors.map(e => `[frontmatter] ${e}`),
    ...results.tone.errors.map(e => `[tone] ${e}`),
    ...results.structure.errors.map(e => `[structure] ${e}`),
  ]

  const allWarnings = [
    ...results.frontmatter.warnings.map(w => `[frontmatter] ${w}`),
    ...results.tone.warnings.map(w => `[tone] ${w}`),
    ...results.structure.warnings.map(w => `[structure] ${w}`),
  ]

  return { ...results, allErrors, allWarnings, passed: allErrors.length === 0 }
}

function printResults(result) {
  console.log(`\n--- ${result.file} ---`)

  if (result.passed) {
    console.log('  PASS: All checks passed')
  } else {
    console.log('  FAIL:')
    for (const err of result.allErrors) {
      console.log(`    ERROR: ${err}`)
    }
  }

  if (result.allWarnings.length > 0) {
    for (const warn of result.allWarnings) {
      console.log(`    WARN:  ${warn}`)
    }
  }

  // Stats summary
  const tone = result.tone.stats
  if (tone.total > 0) {
    console.log(
      `    Tone: ${tone.formal} formal, ${tone.informal} informal, ${tone.neutral} neutral`
    )
  }
}

// CLI entry
const files = process.argv.slice(2)
if (files.length === 0) {
  console.error(
    'Usage: node scripts/blog/quality/validate.js <file.md> [file2.md ...]'
  )
  process.exit(1)
}

let hasFailure = false
for (const file of files) {
  try {
    const result = await validatePost(file)
    printResults(result)
    if (!result.passed) hasFailure = true
  } catch (e) {
    console.error(`\n--- ${file} ---`)
    console.error(`  ERROR: ${e.message}`)
    hasFailure = true
  }
}

process.exit(hasFailure ? 1 : 0)

export { validatePost }
