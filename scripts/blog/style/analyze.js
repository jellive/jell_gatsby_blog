#!/usr/bin/env node

// Corpus analyzer - scans existing posts to build a writing style profile
// Usage: node scripts/blog/style/analyze.js [--output profile.json]

import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_OUTPUT = join(__dirname, 'profile.json')

// Extract prose lines (skip code, frontmatter, headings, etc.)
function extractProse(content) {
  const lines = content.split('\n')
  const prose = []
  let inCodeBlock = false
  let inFrontmatter = false
  let fmCount = 0

  for (const line of lines) {
    if (line.trim() === '---') {
      fmCount++
      inFrontmatter = fmCount === 1
      if (fmCount === 2) inFrontmatter = false
      continue
    }
    if (inFrontmatter) continue
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue
    if (line.trim().startsWith('#')) continue
    if (line.trim().startsWith('|')) continue
    if (line.trim().startsWith('![')) continue
    if (!line.trim() || line.trim().length < 5) continue
    prose.push(line.trim())
  }
  return prose
}

// Count Korean sentence endings
function analyzeEndings(proseLines) {
  const endings = {}
  const patterns = [
    { name: '습니다', regex: /습니다[.!?]?\s*$/ },
    { name: '입니다', regex: /입니다[.!?]?\s*$/ },
    { name: '세요', regex: /세요[.!?]?\s*$/ },
    { name: '겠습니다', regex: /겠습니다[.!?]?\s*$/ },
    { name: '됩니다', regex: /됩니다[.!?]?\s*$/ },
    { name: '있습니다', regex: /있습니다[.!?]?\s*$/ },
    { name: '보겠습니다', regex: /보겠습니다[.!?]?\s*$/ },
    { name: '바랍니다', regex: /바랍니다[.!?]?\s*$/ },
  ]

  for (const line of proseLines) {
    for (const { name, regex } of patterns) {
      if (regex.test(line)) {
        endings[name] = (endings[name] || 0) + 1
      }
    }
  }
  return endings
}

// Extract transition phrases
function extractTransitions(proseLines) {
  const transitionPatterns = [
    '그래서',
    '따라서',
    '하지만',
    '그러나',
    '그런데',
    '또한',
    '그리고',
    '즉,',
    '예를 들어',
    '물론',
    '실제로',
    '결론적으로',
    '마지막으로',
    '우선',
    '다음으로',
    '이제',
    '여기서',
    '참고로',
    '이처럼',
    '이렇게',
    '그럼',
    '자,',
  ]
  const found = {}
  for (const line of proseLines) {
    for (const phrase of transitionPatterns) {
      if (line.includes(phrase)) {
        found[phrase] = (found[phrase] || 0) + 1
      }
    }
  }
  return found
}

// Analyze sentence length distribution
function analyzeLengths(proseLines) {
  const lengths = proseLines.map(l => l.length)
  if (lengths.length === 0) return { avg: 0, min: 0, max: 0, median: 0 }

  lengths.sort((a, b) => a - b)
  const sum = lengths.reduce((a, b) => a + b, 0)
  return {
    avg: Math.round(sum / lengths.length),
    min: lengths[0],
    max: lengths[lengths.length - 1],
    median: lengths[Math.floor(lengths.length / 2)],
    count: lengths.length,
  }
}

// Extract example sentences (representative samples)
function extractExamples(proseLines, count = 10) {
  // Pick sentences that are typical length and have common patterns
  const avgLen =
    proseLines.reduce((a, l) => a + l.length, 0) / proseLines.length
  const candidates = proseLines.filter(
    l => l.length > avgLen * 0.5 && l.length < avgLen * 1.5
  )

  // Shuffle and take samples
  const shuffled = candidates.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Analyze per-category patterns
function buildCategoryProfile(posts) {
  const byCategory = {}

  for (const post of posts) {
    const cat = post.data.category || 'unknown'
    if (!byCategory[cat])
      byCategory[cat] = { proseLines: [], codeBlocks: 0, postCount: 0 }
    byCategory[cat].postCount++
    byCategory[cat].proseLines.push(...post.prose)

    // Count code blocks
    const codeMatches = post.content.match(/```[\s\S]*?```/g)
    if (codeMatches) byCategory[cat].codeBlocks += codeMatches.length
  }

  const profiles = {}
  for (const [cat, data] of Object.entries(byCategory)) {
    profiles[cat] = {
      postCount: data.postCount,
      avgCodeBlocks:
        data.postCount > 0 ? Math.round(data.codeBlocks / data.postCount) : 0,
      sentenceLengths: analyzeLengths(data.proseLines),
      endings: analyzeEndings(data.proseLines),
      examples: extractExamples(data.proseLines, 5),
    }
  }
  return profiles
}

// Detect personal markers (first-person patterns, unique expressions)
function detectPersonalMarkers(proseLines) {
  const markers = {
    firstPerson: 0,
    question: 0,
    exclamation: 0,
    parenthetical: 0,
  }
  const firstPersonPatterns = [/저는/, /저의/, /제가/, /저도/, /저 역시/]

  for (const line of proseLines) {
    for (const p of firstPersonPatterns) {
      if (p.test(line)) {
        markers.firstPerson++
        break
      }
    }
    if (line.endsWith('?')) markers.question++
    if (line.endsWith('!')) markers.exclamation++
    if (/\(.*\)/.test(line)) markers.parenthetical++
  }
  return markers
}

async function analyzeCorpus() {
  const files = await glob('_posts/**/*.md')
  console.log(`Found ${files.length} posts to analyze`)

  const posts = []
  for (const file of files) {
    try {
      const raw = await readFile(file, 'utf-8')
      const { data, content } = matter(raw)
      const prose = extractProse(raw)
      posts.push({ file, data, content, prose })
    } catch (e) {
      console.warn(`Skipping ${file}: ${e.message}`)
    }
  }

  console.log(`Successfully parsed ${posts.length} posts`)

  // Aggregate all prose
  const allProse = posts.flatMap(p => p.prose)

  const profile = {
    generatedAt: new Date().toISOString(),
    postCount: posts.length,
    overall: {
      sentenceLengths: analyzeLengths(allProse),
      endings: analyzeEndings(allProse),
      transitions: extractTransitions(allProse),
      personalMarkers: detectPersonalMarkers(allProse),
      examples: extractExamples(allProse, 15),
    },
    byCategory: buildCategoryProfile(posts),
  }

  const outputPath = process.argv.includes('--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : DEFAULT_OUTPUT

  await writeFile(outputPath, JSON.stringify(profile, null, 2), 'utf-8')
  console.log(`Style profile written to: ${outputPath}`)
  console.log(`\nSummary:`)
  console.log(`  Posts analyzed: ${profile.postCount}`)
  console.log(
    `  Avg sentence length: ${profile.overall.sentenceLengths.avg} chars`
  )
  console.log(
    `  Top endings: ${Object.entries(profile.overall.endings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k}(${v})`)
      .join(', ')}`
  )
  console.log(
    `  Top transitions: ${Object.entries(profile.overall.transitions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => `${k}(${v})`)
      .join(', ')}`
  )

  return profile
}

analyzeCorpus()

export { analyzeCorpus, extractProse, analyzeEndings }
