import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const info = {
  timestamp: new Date().toISOString(),
  buildId: `build-${Date.now()}`,
  version: Date.now(),
  nodeEnv: process.env.NODE_ENV || 'production',
  netlifyDeployId: process.env.DEPLOY_ID || '',
  commitRef: process.env.COMMIT_REF || '',
  branch: process.env.BRANCH || 'master',
  deployUrl: process.env.DEPLOY_URL || 'https://blog.jell.kr',
  cacheStatus: 'fresh',
}

mkdirSync(publicDir, { recursive: true })
writeFileSync(
  join(publicDir, 'deployment-info.json'),
  JSON.stringify(info, null, 2)
)
console.log('✅ deployment-info.json generated:', info.buildId)
