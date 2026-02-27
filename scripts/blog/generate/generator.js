#!/usr/bin/env node

// AI generation orchestrator
// This module is designed to be used FROM Claude Code slash commands,
// not as a standalone API caller. The actual AI generation happens
// through Claude Code's own capabilities.
//
// Usage flow:
// 1. /new-post command calls scaffold.js
// 2. If AI generation requested, this module builds the generation plan
// 3. Claude Code uses the plan + prompts to generate each section
// 4. line-wrapper.js wraps the output
// 5. validate.js checks quality

import { readFile, writeFile } from 'fs/promises'
import { generateOutline, outlineToMarkdown } from './outline.js'
import { buildSectionPrompt, detectAIPatterns } from './section-writer.js'
import { wrapContent } from './line-wrapper.js'
import { getCategoryConfig } from '../categories.js'

// Generate a complete generation plan that Claude Code can follow
export async function createGenerationPlan({
  title,
  category,
  description,
  sections,
}) {
  const config = getCategoryConfig(category)

  // Build outline
  const outline = generateOutline({
    title,
    category: config.category,
    description,
    sections,
  })

  // Build prompts for each section
  const sectionPlans = []
  for (let i = 0; i < outline.sections.length; i++) {
    const section = outline.sections[i]
    const prompt = await buildSectionPrompt({
      category: config.category,
      topic: `${title} - ${description || ''}`,
      section,
      sectionIndex: i,
      totalSections: outline.sections.length,
    })
    sectionPlans.push({
      heading: section.heading,
      level: section.level,
      isIntro: section.isIntro || false,
      isConclusion: section.isConclusion || false,
      notes: section.notes || '',
      prompt,
    })
  }

  return {
    outline,
    outlinePreview: outlineToMarkdown(outline),
    sectionPlans,
    postMetadata: {
      title,
      category: config.category,
      tags: config.tags,
      description,
    },
  }
}

// Post-process generated content
export async function postProcessContent(filePath) {
  const content = await readFile(filePath, 'utf-8')

  // Wrap lines
  const wrapped = wrapContent(content)

  // Detect AI patterns
  const aiPatterns = detectAIPatterns(wrapped)

  // Write back
  await writeFile(filePath, wrapped, 'utf-8')

  return {
    filePath,
    wrapped: content !== wrapped,
    aiPatterns,
    hasAIPatterns: aiPatterns.length > 0,
  }
}

// CLI entry for post-processing
if (process.argv[2] === '--post-process' && process.argv[3]) {
  const result = await postProcessContent(process.argv[3])
  console.log(`Post-processed: ${result.filePath}`)
  if (result.wrapped) console.log('  Lines wrapped to 150-char limit')
  if (result.hasAIPatterns) {
    console.log(
      `  WARNING: ${result.aiPatterns.length} AI-like patterns detected:`
    )
    for (const p of result.aiPatterns) {
      console.log(`    Line ${p.line}: ${p.text.slice(0, 60)}...`)
    }
  } else {
    console.log('  No AI patterns detected')
  }
}
