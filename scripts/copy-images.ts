import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'

async function copyImages() {
  const postsDirectory = path.join(process.cwd(), '_posts')
  const publicDirectory = path.join(process.cwd(), 'public')

  // 이미지 디렉토리 초기화
  const imagesDirectory = path.join(publicDirectory, 'images')
  await fs.remove(imagesDirectory)
  await fs.ensureDir(imagesDirectory)

  // 마크다운 파일 찾기
  const postFiles = await glob('**/*.md', {
    cwd: postsDirectory,
    nocase: true
  })

  // 각 포스트의 이미지 복사
  for (const postFile of postFiles) {
    const postDir = path.dirname(postFile)
    const postSlug = postFile.replace(/\.md$/, '')
    const imagesDir = path.join(postsDirectory, postDir, 'images')
    const targetDir = path.join(imagesDirectory, postSlug)

    try {
      // 해당 포스트의 images 디렉토리가 있는지 확인
      if (await fs.pathExists(imagesDir)) {
        const imageFiles = await fs.readdir(imagesDir)

        // 각 이미지 파일 복사
        for (const imageFile of imageFiles) {
          const sourcePath = path.join(imagesDir, imageFile)
          const targetPath = path.join(targetDir, imageFile)

          await fs.ensureDir(targetDir)
          await fs.copy(sourcePath, targetPath)
          console.log(`Copied: ${imageFile} -> ${targetPath}`)
        }
      }
    } catch (error) {
      console.error(`Failed to process images for ${postFile}:`, error)
    }
  }
}

copyImages().catch(console.error)
