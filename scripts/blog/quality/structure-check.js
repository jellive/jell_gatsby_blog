// Structure validator
// Checks: TOC presence, heading hierarchy, line length

const MAX_LINE_LENGTH = 150 // from .markdownlint-cli2.jsonc

export function checkStructure(content, filePath) {
  const errors = []
  const warnings = []

  const lines = content.split('\n')
  let hasToc = false
  let hasH1 = false
  let inCodeBlock = false
  let inFrontmatter = false
  let frontmatterCount = 0
  const headingLevels = []
  const longLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Track frontmatter
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
      if (!inCodeBlock && line.trim() === '```toc') {
        hasToc = true
      }
      inCodeBlock = !inCodeBlock
      continue
    }

    // Skip line length check inside code blocks
    if (inCodeBlock) continue

    // Check headings
    const headingMatch = line.match(/^(#{1,6})\s/)
    if (headingMatch) {
      const level = headingMatch[1].length
      headingLevels.push({ level, line: lineNum, text: line.trim() })
      if (level === 1) hasH1 = true
    }

    // Check line length (skip links, images, and tables)
    if (line.length > MAX_LINE_LENGTH) {
      // Allow long lines for URLs, images, tables
      const isException =
        /^\s*\[.*\]\(http/.test(line) ||
        /^\s*!\[/.test(line) ||
        /^\s*\|/.test(line) ||
        /https?:\/\/\S{50,}/.test(line)

      if (!isException) {
        longLines.push({ line: lineNum, length: line.length })
      }
    }
  }

  // TOC check
  if (!hasToc) {
    errors.push('Missing TOC block (```toc```)')
  }

  // H1 check (should not have H1 in content)
  if (hasH1) {
    const h1Lines = headingLevels
      .filter(h => h.level === 1)
      .map(h => `line ${h.line}`)
    errors.push(`H1 heading found (use H2+ only): ${h1Lines.join(', ')}`)
  }

  // Heading hierarchy check (no skipping levels)
  for (let i = 1; i < headingLevels.length; i++) {
    const prev = headingLevels[i - 1]
    const curr = headingLevels[i]
    if (curr.level > prev.level + 1) {
      warnings.push(
        `Heading level skip at line ${curr.line}: ` +
          `H${prev.level} → H${curr.level} (${curr.text})`
      )
    }
  }

  // Long lines
  if (longLines.length > 0) {
    const first5 = longLines.slice(0, 5)
    for (const { line, length } of first5) {
      warnings.push(`Line ${line}: ${length} chars (max ${MAX_LINE_LENGTH})`)
    }
    if (longLines.length > 5) {
      warnings.push(`...and ${longLines.length - 5} more long lines`)
    }
  }

  return {
    errors,
    warnings,
    stats: {
      hasToc,
      hasH1,
      headingCount: headingLevels.length,
      longLineCount: longLines.length,
    },
  }
}
