#!/usr/bin/env node

/**
 * Content Quality Analysis Script
 *
 * Analyzes blog posts for:
 * - Duplicate content detection
 * - Thin content identification (< 300 words)
 * - Content quality metrics
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Configuration
const MIN_WORD_COUNT = 300 // Minimum words for quality content
const SIMILARITY_THRESHOLD = 0.85 // 85% similarity = duplicate
const POSTS_DIR = path.join(__dirname, '../_posts')
const OUTPUT_FILE = path.join(
  __dirname,
  '../.taskmaster/reports/content-quality-report.json'
)

/**
 * Extract content from markdown file (excluding frontmatter)
 */
function extractContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '')

  // Remove markdown syntax
  const cleaned = withoutFrontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ') // Normalize whitespace
    .trim()

  return cleaned
}

/**
 * Count words in text
 */
function countWords(text) {
  // Korean and English word counting
  const koreanWords = (text.match(/[가-힣]+/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  return koreanWords + englishWords
}

/**
 * Calculate Jaccard similarity between two texts
 */
function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/))
  const words2 = new Set(text2.toLowerCase().split(/\s+/))

  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

/**
 * Generate content hash for exact duplicate detection
 */
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex')
}

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir) {
  const files = []

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        traverse(fullPath)
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  traverse(dir)
  return files
}

/**
 * Extract title from frontmatter
 */
function extractTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/title:\s*['"]([^'"]+)['"]/)
  return match ? match[1] : path.basename(filePath, '.md')
}

/**
 * Main analysis function
 */
function analyzeContentQuality() {
  console.log('🔍 Starting content quality analysis...\n')

  const files = findMarkdownFiles(POSTS_DIR)
  console.log(`📄 Found ${files.length} markdown files\n`)

  const analysis = []
  const contentMap = new Map() // hash -> files

  // Analyze each file
  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file)
    const content = extractContent(file)
    const wordCount = countWords(content)
    const hash = generateHash(content)
    const title = extractTitle(file)

    const fileAnalysis = {
      file: relativePath,
      title,
      wordCount,
      isThinContent: wordCount < MIN_WORD_COUNT,
      hash,
      duplicateOf: null,
      similarTo: [],
    }

    // Check for exact duplicates
    if (contentMap.has(hash)) {
      fileAnalysis.duplicateOf = contentMap.get(hash)
      console.log(`⚠️  DUPLICATE: ${relativePath}`)
      console.log(`   → Exact duplicate of: ${fileAnalysis.duplicateOf}`)
    } else {
      contentMap.set(hash, relativePath)
    }

    // Check for thin content
    if (fileAnalysis.isThinContent) {
      console.log(`📏 THIN CONTENT: ${relativePath}`)
      console.log(`   → Word count: ${wordCount} (minimum: ${MIN_WORD_COUNT})`)
    }

    analysis.push({ ...fileAnalysis, content })
  }

  console.log('\n🔍 Checking for similar content...\n')

  // Check for similar content (not exact duplicates)
  for (let i = 0; i < analysis.length; i++) {
    for (let j = i + 1; j < analysis.length; j++) {
      const file1 = analysis[i]
      const file2 = analysis[j]

      // Skip if already marked as duplicate
      if (file1.duplicateOf || file2.duplicateOf) continue

      const similarity = calculateSimilarity(file1.content, file2.content)

      if (similarity >= SIMILARITY_THRESHOLD) {
        file1.similarTo.push({
          file: file2.file,
          similarity: (similarity * 100).toFixed(1),
        })
        file2.similarTo.push({
          file: file1.file,
          similarity: (similarity * 100).toFixed(1),
        })

        console.log(`🔄 SIMILAR: ${file1.file}`)
        console.log(`   ↔️ ${file2.file}`)
        console.log(`   → Similarity: ${(similarity * 100).toFixed(1)}%`)
      }
    }
  }

  // Prepare summary
  const duplicates = analysis.filter(a => a.duplicateOf)
  const thinContent = analysis.filter(a => a.isThinContent && !a.duplicateOf)
  const similar = analysis.filter(a => a.similarTo.length > 0 && !a.duplicateOf)

  const summary = {
    totalFiles: files.length,
    duplicateCount: duplicates.length,
    thinContentCount: thinContent.length,
    similarContentCount: similar.length,
    healthyContentCount:
      analysis.length - duplicates.length - thinContent.length,
    minWordCount: MIN_WORD_COUNT,
    similarityThreshold: SIMILARITY_THRESHOLD,
    analyzedAt: new Date().toISOString(),
  }

  // Remove content from output (too large)
  const cleanedAnalysis = analysis.map(({ content, ...rest }) => rest)

  // Save report
  const report = {
    summary,
    duplicates,
    thinContent,
    similar,
    allFiles: cleanedAnalysis,
  }

  // Ensure reports directory exists
  const reportsDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2))

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 CONTENT QUALITY ANALYSIS SUMMARY')
  console.log('='.repeat(60))
  console.log(`📄 Total Files:          ${summary.totalFiles}`)
  console.log(`✅ Healthy Content:      ${summary.healthyContentCount}`)
  console.log(`⚠️  Duplicate Content:    ${summary.duplicateCount}`)
  console.log(`📏 Thin Content:         ${summary.thinContentCount}`)
  console.log(`🔄 Similar Content:      ${summary.similarContentCount}`)
  console.log('='.repeat(60))
  console.log(`\n📁 Report saved to: ${OUTPUT_FILE}\n`)

  return report
}

// Run analysis
if (require.main === module) {
  try {
    analyzeContentQuality()
  } catch (error) {
    console.error('❌ Error during analysis:', error)
    process.exit(1)
  }
}

module.exports = { analyzeContentQuality }
