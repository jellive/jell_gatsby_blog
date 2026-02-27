#!/usr/bin/env node

// Obsidian note → blog post converter
// Transforms Obsidian-specific syntax to standard markdown

import { readFile, writeFile } from 'fs/promises'

// Convert [[wikilinks]] to plain text or markdown links
function convertWikilinks(content) {
  // [[Page|Display Text]] → Display Text
  content = content.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
  // [[Page]] → Page
  content = content.replace(/\[\[([^\]]+)\]\]/g, '$1')
  return content
}

// Convert Obsidian callouts to blockquotes
function convertCallouts(content) {
  // > [!note] Title → > **Note**: Title
  // > [!tip] → > **Tip**:
  // > [!warning] → > **Warning**:
  const calloutTypes = {
    note: '참고',
    tip: '팁',
    warning: '주의',
    important: '중요',
    info: '정보',
    caution: '주의',
    example: '예시',
  }

  return content.replace(/> \[!([\w-]+)\]\s*(.*)/g, (_, type, title) => {
    const label = calloutTypes[type.toLowerCase()] || type
    return title ? `> **${label}**: ${title}` : `> **${label}**`
  })
}

// Remove Obsidian-specific metadata and syntax
function cleanObsidianSyntax(content) {
  // Remove %%comments%%
  content = content.replace(/%%[\s\S]*?%%/g, '')

  // Remove Obsidian query blocks
  content = content.replace(/```dataview[\s\S]*?```/g, '')
  content = content.replace(/```query[\s\S]*?```/g, '')

  // Convert ==highlights== to **bold**
  content = content.replace(/==(.*?)==/g, '**$1**')

  // Convert ~~ (already standard markdown, keep as-is)
  return content
}

// Extract key content sections for blog outline
function extractOutline(content) {
  const headings = []
  const lines = content.split('\n')

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      })
    }
  }

  return headings
}

// Full transformation pipeline
export function transformNote(content, options = {}) {
  let result = content

  // Remove Obsidian frontmatter (we'll generate new blog frontmatter)
  result = result.replace(/^---\n[\s\S]*?\n---\n/, '')

  result = convertWikilinks(result)
  result = convertCallouts(result)
  result = cleanObsidianSyntax(result)

  // Clean up excessive blank lines
  result = result.replace(/\n{3,}/g, '\n\n')
  result = result.trim()

  const outline = extractOutline(result)

  return {
    content: result,
    outline,
    wordCount: result.replace(/[^가-힣a-zA-Z]/g, '').length,
  }
}

// Extract tags from Obsidian note
export function extractTags(content) {
  const tags = new Set()

  // YAML frontmatter tags
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (fmMatch) {
    const tagMatch = fmMatch[1].match(/tags:\s*\[(.*?)\]/)
    if (tagMatch) {
      tagMatch[1]
        .split(',')
        .forEach(t => tags.add(t.trim().replace(/['"]/g, '')))
    }
  }

  // Inline #tags (but not headings)
  const inlineTags = content.match(/(?<=\s)#([가-힣a-zA-Z][\w가-힣]*)/g)
  if (inlineTags) {
    inlineTags.forEach(t => tags.add(t.replace('#', '')))
  }

  return [...tags]
}

// CLI entry
if (process.argv[2] === '--input' && process.argv[3]) {
  const inputPath = process.argv[3]
  const raw = await readFile(inputPath, 'utf-8')
  const { content, outline, wordCount } = transformNote(raw)
  const tags = extractTags(raw)

  console.log(`Transformed: ${inputPath}`)
  console.log(`Word count: ~${wordCount}`)
  console.log(`Tags: ${tags.join(', ') || '(none)'}`)
  console.log(
    `Outline: ${outline.map(h => `${'  '.repeat(h.level - 1)}${h.text}`).join('\n')}`
  )

  if (process.argv.includes('--output')) {
    const outputPath = process.argv[process.argv.indexOf('--output') + 1]
    await writeFile(outputPath, content, 'utf-8')
    console.log(`Output written to: ${outputPath}`)
  } else {
    console.log('\n--- Transformed Content ---\n')
    console.log(content)
  }
}
