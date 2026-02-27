// 존댓말 (formal Korean) pattern checker
// Ensures blog posts maintain consistent formal tone

// Common 존댓말 endings that indicate proper formal tone
const FORMAL_ENDINGS = [
  /습니다[.!?]?\s*$/, // ~습니다
  /ㅂ니다[.!?]?\s*$/, // ~ㅂ니다
  /세요[.!?]?\s*$/, // ~세요
  /겠습니다[.!?]?\s*$/, // ~겠습니다
  /시오[.!?]?\s*$/, // ~시오
  /입니다[.!?]?\s*$/, // ~입니다
]

// Informal endings to flag (반말)
const INFORMAL_ENDINGS = [
  /[^다]다[.!?]?\s*$/, // ~다 (but not 습니다/ㅂ니다)
  /[^요]야[.!?]?\s*$/, // ~야
  /거든[.!?]?\s*$/, // ~거든
  /잖아[.!?]?\s*$/, // ~잖아
  /는데[.!?]?\s*$/, // ~는데 (as sentence ending)
]

// Lines to skip during tone analysis
function shouldSkipLine(line) {
  const trimmed = line.trim()
  if (!trimmed) return true
  if (trimmed.startsWith('#')) return true // headings
  if (trimmed.startsWith('```')) return true // code blocks
  if (trimmed.startsWith('|')) return true // tables
  if (trimmed.startsWith('-') || trimmed.startsWith('*')) return true // lists
  if (trimmed.startsWith('>')) return true // blockquotes
  if (trimmed.startsWith('!')) return true // images
  if (trimmed.startsWith('[')) return true // links at line start
  if (/^\d+\./.test(trimmed)) return true // numbered lists
  if (trimmed.length < 5) return true // too short
  return false
}

export function checkTone(content) {
  const errors = []
  const warnings = []
  const stats = { formal: 0, informal: 0, neutral: 0, total: 0 }

  const lines = content.split('\n')
  let inCodeBlock = false
  let inFrontmatter = false
  let frontmatterCount = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Track frontmatter boundaries
    if (line.trim() === '---') {
      frontmatterCount++
      if (frontmatterCount <= 2) {
        inFrontmatter = frontmatterCount === 1
        if (frontmatterCount === 2) inFrontmatter = false
        continue
      }
    }
    if (inFrontmatter) continue

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    if (shouldSkipLine(line)) continue

    stats.total++

    const isFormal = FORMAL_ENDINGS.some(p => p.test(line))
    const isInformal = INFORMAL_ENDINGS.some(p => p.test(line))

    if (isFormal) {
      stats.formal++
    } else if (isInformal) {
      stats.informal++
      warnings.push(
        `Line ${i + 1}: Informal tone detected: "${line.trim().slice(-20)}"`
      )
    } else {
      stats.neutral++
    }
  }

  // Calculate formality ratio
  const contentLines = stats.formal + stats.informal
  if (contentLines > 0) {
    const formalRatio = stats.formal / contentLines
    if (formalRatio < 0.5 && stats.informal > 2) {
      errors.push(
        `Low formality ratio: ${(formalRatio * 100).toFixed(0)}% ` +
          `(${stats.formal} formal, ${stats.informal} informal sentences)`
      )
    }
  }

  return { errors, warnings, stats }
}
