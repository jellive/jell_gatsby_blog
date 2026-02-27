// Korean-aware line wrapper
// Breaks lines at natural clause boundaries while respecting max length

const MAX_LENGTH = 150

// Korean clause-ending particles and connectors (good break points)
const BREAK_AFTER = [
  '하고 ',
  '하며 ',
  '하면 ',
  '하면서 ',
  '이고 ',
  '이며 ',
  '이면 ',
  '지만 ',
  '는데 ',
  '으며 ',
  '에서 ',
  '으로 ',
  '에게 ',
  '때문에 ',
  '위해서 ',
  '통해서 ',
  '경우에 ',
  '한편, ',
  '또한 ',
  '그리고 ',
  '그러나 ',
  '하지만 ',
  '따라서 ',
  '그래서 ',
  '즉, ',
  '), ',
  '). ',
]

function isInProtectedBlock(line) {
  // Don't wrap these line types
  return (
    line.startsWith('#') ||
    line.startsWith('```') ||
    line.startsWith('|') ||
    line.startsWith('![') ||
    line.startsWith('> ') ||
    line.startsWith('- ') ||
    line.startsWith('* ') ||
    /^\d+\.\s/.test(line) ||
    line.startsWith('---')
  )
}

function hasInlineCode(text, pos) {
  // Check if position is inside inline code (backtick pairs)
  let inCode = false
  for (let i = 0; i < pos; i++) {
    if (text[i] === '`') inCode = !inCode
  }
  return inCode
}

function hasLink(text, pos) {
  // Check if position is inside a markdown link
  const before = text.slice(0, pos)
  const openBracket = before.lastIndexOf('[')
  const closeParen = text.indexOf(')', pos)
  if (openBracket === -1 || closeParen === -1) return false
  const closeAndOpen = text.slice(openBracket, closeParen + 1)
  return /\[.*\]\(.*\)/.test(closeAndOpen)
}

function wrapLine(line) {
  if (line.length <= MAX_LENGTH) return line
  if (isInProtectedBlock(line)) return line

  const parts = []
  let remaining = line

  while (remaining.length > MAX_LENGTH) {
    let bestBreak = -1

    // Find the best break point within max length
    for (const pattern of BREAK_AFTER) {
      let searchFrom = 0
      while (searchFrom < MAX_LENGTH) {
        const idx = remaining.indexOf(pattern, searchFrom)
        if (idx === -1 || idx + pattern.length > MAX_LENGTH) break

        const breakPos = idx + pattern.length
        // Don't break inside inline code or links
        if (
          !hasInlineCode(remaining, breakPos) &&
          !hasLink(remaining, breakPos)
        ) {
          if (breakPos > bestBreak) bestBreak = breakPos
        }
        searchFrom = idx + 1
      }
    }

    // Fallback: break at last space before max length
    if (bestBreak === -1) {
      for (let i = MAX_LENGTH; i > MAX_LENGTH * 0.4; i--) {
        if (
          remaining[i] === ' ' &&
          !hasInlineCode(remaining, i) &&
          !hasLink(remaining, i)
        ) {
          bestBreak = i + 1
          break
        }
      }
    }

    // Last resort: just cut at max length
    if (bestBreak === -1) bestBreak = MAX_LENGTH

    parts.push(remaining.slice(0, bestBreak).trimEnd())
    remaining = remaining.slice(bestBreak).trimStart()
  }

  if (remaining) parts.push(remaining)

  return parts.join('\n')
}

export function wrapContent(content) {
  const lines = content.split('\n')
  const result = []
  let inCodeBlock = false
  let inFrontmatter = false
  let fmCount = 0

  for (const line of lines) {
    // Track frontmatter
    if (line.trim() === '---') {
      fmCount++
      if (fmCount <= 2) {
        inFrontmatter = fmCount === 1
        if (fmCount === 2) inFrontmatter = false
      }
      result.push(line)
      continue
    }
    if (inFrontmatter) {
      result.push(line)
      continue
    }

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      result.push(line)
      continue
    }
    if (inCodeBlock) {
      result.push(line)
      continue
    }

    result.push(wrapLine(line))
  }

  return result.join('\n')
}

// CLI entry
if (process.argv[2]) {
  const { readFile, writeFile } = await import('fs/promises')
  const filePath = process.argv[2]
  const content = await readFile(filePath, 'utf-8')
  const wrapped = wrapContent(content)
  if (process.argv.includes('--in-place')) {
    await writeFile(filePath, wrapped, 'utf-8')
    console.log(`Wrapped: ${filePath}`)
  } else {
    process.stdout.write(wrapped)
  }
}
