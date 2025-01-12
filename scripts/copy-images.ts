import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'

async function copyImages() {
  const postsDir = path.join(process.cwd(), '_posts')
  const publicDir = path.join(process.cwd(), 'public/posts')

  // 이미지 파일 찾기 (images 디렉토리 내의 파일들을 찾음)
  const images = await glob('**/images/**/*.{jpg,jpeg,png,gif,webp}', {
    cwd: postsDir,
    absolute: false
  })

  // 각 이미지를 public 디렉토리로 복사하면서 디렉토리 구조 유지
  for (const image of images) {
    const sourcePath = path.join(postsDir, image)
    // 파일 경로에서 마지막 세그먼트(포스트 이름)를 제외한 디렉토리 경로 사용
    const dirPath = path.dirname(path.dirname(image))
    const targetPath = path.join(publicDir, dirPath, 'images', path.basename(image))

    await fs.ensureDir(path.dirname(targetPath))
    await fs.copy(sourcePath, targetPath)
    console.log(`Copied: ${image} -> ${targetPath}`)
  }
}

copyImages().catch(console.error)
