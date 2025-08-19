#!/usr/bin/env node

/**
 * TypeScript Compliance Verification Script
 *
 * This script runs comprehensive TypeScript and ESLint checks
 * to identify and report issues across the entire codebase.
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log('blue', `\n🔍 ${description}...`)
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    log('green', `✅ ${description} passed`)
    return { success: true, output: result }
  } catch (error) {
    log('red', `❌ ${description} failed`)
    if (error.stdout) {
      console.log(error.stdout)
    }
    if (error.stderr) {
      console.error(error.stderr)
    }
    return { success: false, error: error.message }
  }
}

function main() {
  log('blue', '🚀 Starting TypeScript Compliance Verification\n')

  // Check if we're in the right directory
  if (!existsSync('package.json')) {
    log(
      'red',
      '❌ package.json not found. Run this script from the project root.'
    )
    process.exit(1)
  }

  const checks = [
    {
      command: 'npm run type-check',
      description: 'TypeScript type checking',
    },
    {
      command: 'npm run lint',
      description: 'ESLint code quality check',
    },
    {
      command: 'npm run format:check',
      description: 'Prettier formatting check',
    },
    {
      command: 'npm run build',
      description: 'Build verification',
    },
  ]

  const results = []

  for (const check of checks) {
    const result = runCommand(check.command, check.description)
    results.push({
      ...check,
      ...result,
    })
  }

  // Summary
  log('blue', '\n📊 Summary Report:')
  log('blue', '==================')

  const passed = results.filter(r => r.success).length
  const total = results.length

  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${result.description}`)
  })

  log('blue', `\nResults: ${passed}/${total} checks passed`)

  if (passed === total) {
    log('green', '\n🎉 All TypeScript compliance checks passed!')
    log('green', '✨ Your code is ready for production!')
  } else {
    log('red', '\n🚨 Some checks failed. Please fix the issues above.')
    log('yellow', '\n💡 Quick fixes:')
    log('yellow', '   - Run: npm run lint -- --fix')
    log('yellow', '   - Run: npm run format')
    log('yellow', '   - Check: docs/DEVELOPMENT_GUIDELINES.md')
    process.exit(1)
  }
}

// Error handling
process.on('uncaughtException', error => {
  log('red', `💥 Uncaught Exception: ${error.message}`)
  process.exit(1)
})

process.on('unhandledRejection', error => {
  log('red', `💥 Unhandled Rejection: ${error.message}`)
  process.exit(1)
})

main()
