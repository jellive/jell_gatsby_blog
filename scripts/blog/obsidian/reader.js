#!/usr/bin/env node

// Obsidian vault reader
// Scans vault for recent notes and organizes by PARA structure

import { readFile, readdir, stat } from 'fs/promises'
import { join, extname, resolve } from 'path'
import { homedir } from 'os'
import { VAULT_PATH, PARA_FOLDERS } from './config.js'

function expandPath(p) {
  return p.startsWith('~') ? p.replace('~', homedir()) : resolve(p)
}

async function scanDirectory(dirPath, maxDepth = 3, currentDepth = 0) {
  if (currentDepth > maxDepth) return []

  const results = []
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)

      // Skip hidden files and folders
      if (entry.name.startsWith('.')) continue

      if (entry.isDirectory()) {
        const subResults = await scanDirectory(
          fullPath,
          maxDepth,
          currentDepth + 1
        )
        results.push(...subResults)
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        try {
          const fileStat = await stat(fullPath)
          results.push({
            path: fullPath,
            name: entry.name.replace('.md', ''),
            modified: fileStat.mtime,
            size: fileStat.size,
          })
        } catch {
          // Skip files we can't stat
        }
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  return results
}

async function readNoteContent(notePath) {
  const content = await readFile(notePath, 'utf-8')

  // Extract YAML frontmatter if present
  let metadata = {}
  let body = content
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (fmMatch) {
    // Simple YAML parsing for common fields
    const yaml = fmMatch[1]
    body = fmMatch[2]
    const tagMatch = yaml.match(/tags:\s*\[(.*?)\]/)
    if (tagMatch) {
      metadata.tags = tagMatch[1]
        .split(',')
        .map(t => t.trim().replace(/['"]/g, ''))
    }
    const titleMatch = yaml.match(/title:\s*(.+)/)
    if (titleMatch) metadata.title = titleMatch[1].trim()
  }

  return { metadata, body, raw: content }
}

export async function scanVault({ folder, recentDays = 30 } = {}) {
  const vaultPath = expandPath(VAULT_PATH)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - recentDays)

  const results = {}

  const foldersToScan = folder
    ? {
        [folder]: PARA_FOLDERS[folder] || { path: folder, description: folder },
      }
    : PARA_FOLDERS

  for (const [name, config] of Object.entries(foldersToScan)) {
    const folderPath = join(vaultPath, config.path)
    const notes = await scanDirectory(folderPath)

    // Filter by recency
    const recent = notes
      .filter(n => n.modified >= cutoffDate)
      .sort((a, b) => b.modified - a.modified)

    results[name] = {
      ...config,
      notes: recent,
      totalCount: notes.length,
      recentCount: recent.length,
    }
  }

  return results
}

// CLI entry
if (process.argv.length > 1 && process.argv[1].includes('reader.js')) {
  const recentDays = process.argv.includes('--recent')
    ? parseInt(process.argv[process.argv.indexOf('--recent') + 1]) || 30
    : 30

  const folder = process.argv.includes('--folder')
    ? process.argv[process.argv.indexOf('--folder') + 1]
    : undefined

  try {
    const results = await scanVault({ folder, recentDays })

    console.log(`Obsidian Vault: ${expandPath(VAULT_PATH)}`)
    console.log(`Recent notes (last ${recentDays} days):\n`)

    for (const [name, data] of Object.entries(results)) {
      console.log(
        `📂 ${name} (${data.description}) - ${data.recentCount}/${data.totalCount} notes`
      )
      if (data.notes.length === 0) {
        console.log('   (no recent notes)')
      } else {
        for (const note of data.notes.slice(0, 10)) {
          const dateStr = note.modified.toISOString().slice(0, 10)
          console.log(`   ${dateStr} | ${note.name}`)
        }
        if (data.notes.length > 10) {
          console.log(`   ... and ${data.notes.length - 10} more`)
        }
      }
      console.log()
    }
  } catch (e) {
    console.error(`Error scanning vault: ${e.message}`)
    console.error(
      'Check OBSIDIAN_VAULT_PATH env var or scripts/blog/obsidian/config.js'
    )
    process.exit(1)
  }
}

export { readNoteContent, expandPath }
