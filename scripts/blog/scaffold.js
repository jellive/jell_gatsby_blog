#!/usr/bin/env node

// Post scaffolding CLI
// Usage: node scripts/blog/scaffold.js --category dev/js --title "제목" [--draft]
// Creates directory structure with frontmatter and TOC block

import { mkdir, writeFile, access } from 'fs/promises'
import { join } from 'path'
import { getCategoryConfig } from './categories.js'

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--category' && argv[i + 1]) {
      args.category = argv[++i]
    } else if (argv[i] === '--title' && argv[i + 1]) {
      args.title = argv[++i]
    } else if (argv[i] === '--tags' && argv[i + 1]) {
      args.tags = argv[++i].split(',').map(t => t.trim())
    } else if (argv[i] === '--draft') {
      args.draft = true
    } else if (argv[i] === '--date' && argv[i + 1]) {
      args.date = argv[++i]
    }
  }
  return args
}

function getTodayDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return { full: `${y}-${m}-${d}`, year: String(y), month: m, day: d }
}

function buildFrontmatter({ title, date, category, tags }) {
  const tagList = tags.map(t => `'${t}'`).join(', ')
  return [
    '---',
    `title: '${title}'`,
    `date: '${date}'`,
    `category: '${category}'`,
    `tags: [${tagList}]`,
    '---',
  ].join('\n')
}

function buildContent(frontmatter) {
  return `${frontmatter}

## 목차

\`\`\`toc

\`\`\`

## 개요

`
}

async function scaffold(options) {
  const {
    category: categoryPath,
    title,
    tags: extraTags,
    draft,
    date: dateOverride,
  } = options

  if (!categoryPath || !title) {
    console.error(
      'Usage: node scripts/blog/scaffold.js --category <cat> --title <title> [--tags tag1,tag2] [--draft] [--date YYYY-MM-DD]'
    )
    console.error(
      'Example: node scripts/blog/scaffold.js --category dev/js --title "제목" --draft'
    )
    process.exit(1)
  }

  const config = getCategoryConfig(categoryPath)
  const {
    full: dateStr,
    year,
    month,
    day,
  } = dateOverride
    ? {
        full: dateOverride,
        year: dateOverride.slice(0, 4),
        month: dateOverride.slice(5, 7),
        day: dateOverride.slice(8, 10),
      }
    : getTodayDate()

  // Merge tags: category defaults + user-provided
  const tags = [...new Set([...config.tags, ...(extraTags || [])])]

  const rootDir = draft ? '_drafts' : '_posts'
  const postDir = join(rootDir, categoryPath, year, month, day)
  const fileName = `${title}.md`
  const filePath = join(postDir, fileName)
  const imagesDir = join(postDir, 'images')

  // Check if file already exists
  try {
    await access(filePath)
    console.error(`Error: File already exists: ${filePath}`)
    process.exit(1)
  } catch {
    // File doesn't exist, proceed
  }

  // Create directories
  await mkdir(postDir, { recursive: true })
  await mkdir(imagesDir, { recursive: true })

  // Build content
  const frontmatter = buildFrontmatter({
    title,
    date: dateStr,
    category: config.category,
    tags,
  })
  const content = buildContent(frontmatter)

  // Write file
  await writeFile(filePath, content, 'utf-8')

  console.log(`Created: ${filePath}`)
  console.log(`Images:  ${imagesDir}/`)
  console.log(`Category: ${config.category}`)
  console.log(`Tags: ${tags.join(', ')}`)

  return filePath
}

// Run if called directly
const args = parseArgs(process.argv)
scaffold(args)

export { scaffold, buildFrontmatter, getTodayDate }
