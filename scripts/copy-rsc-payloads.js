import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'out')

let count = 0

function copyRscPayloads(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const fullPath = join(dir, entry.name)
    const indexTxt = join(fullPath, 'index.txt')

    try {
      const content = readFileSync(indexTxt)
      writeFileSync(fullPath + '.txt', content)
      count++
    } catch {
      // No index.txt in this directory, skip
    }

    copyRscPayloads(fullPath)
  }
}

copyRscPayloads(outDir)
console.log(`✅ RSC payload .txt files copied: ${count} files`)
