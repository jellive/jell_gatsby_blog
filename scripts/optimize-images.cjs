#!/usr/bin/env node

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

// 이미지 최적화 설정
const OPTIMIZATION_CONFIG = {
  // JPEG 설정
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
  },
  // PNG 설정
  png: {
    quality: 90,
    progressive: true,
    compressionLevel: 9,
  },
  // WebP 설정 (현대 브라우저용)
  webp: {
    quality: 85,
    effort: 6,
  },
  // AVIF 설정 (최신 브라우저용)
  avif: {
    quality: 75,
    effort: 4,
  },
}

// 처리할 이미지 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// 최대 이미지 크기 (픽셀)
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080

/**
 * 디렉토리를 재귀적으로 탐색하여 모든 이미지 파일을 찾습니다.
 */
async function findImages(dir) {
  const images = []

  try {
    const entries = await readdir(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stats = await stat(fullPath)

      if (stats.isDirectory()) {
        // 재귀적으로 하위 디렉토리 탐색
        const subImages = await findImages(fullPath)
        images.push(...subImages)
      } else if (stats.isFile()) {
        const ext = path.extname(entry).toLowerCase()
        if (IMAGE_EXTENSIONS.includes(ext)) {
          images.push({
            path: fullPath,
            size: stats.size,
            extension: ext,
          })
        }
      }
    }
  } catch (error) {
    console.log(`⚠️  Directory access error: ${dir} - ${error.message}`)
  }

  return images
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 변환합니다.
 */
function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 10) / 10 + ' ' + sizes[i]
}

/**
 * 단일 이미지를 최적화합니다.
 */
async function optimizeImage(imagePath) {
  try {
    const originalStats = await stat(imagePath)
    const originalSize = originalStats.size

    // 최적화를 건너뛸 크기 (이미 충분히 작은 파일)
    if (originalSize < 100 * 1024) {
      // 100KB 미만
      return {
        skipped: true,
        reason: 'File already small',
        originalSize,
        optimizedSize: originalSize,
      }
    }

    const ext = path.extname(imagePath).toLowerCase()
    const tempPath = imagePath + '.temp'

    // Sharp로 이미지 처리
    let sharpInstance = sharp(imagePath)

    // 이미지 메타데이터 획득
    const metadata = await sharpInstance.metadata()

    // 크기 조정 (너무 큰 이미지의 경우)
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // 확장자별 최적화 설정 적용
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        sharpInstance = sharpInstance.jpeg(OPTIMIZATION_CONFIG.jpeg)
        break
      case '.png':
        sharpInstance = sharpInstance.png(OPTIMIZATION_CONFIG.png)
        break
      case '.webp':
        sharpInstance = sharpInstance.webp(OPTIMIZATION_CONFIG.webp)
        break
      default:
        // 지원하지 않는 형식은 건너뛰기
        return {
          skipped: true,
          reason: 'Unsupported format',
          originalSize,
          optimizedSize: originalSize,
        }
    }

    // 최적화된 이미지를 임시 파일로 저장
    await sharpInstance.toFile(tempPath)

    // 최적화된 파일 크기 확인
    const tempStats = await stat(tempPath)
    const optimizedSize = tempStats.size

    // 최적화 효과가 있는 경우에만 교체
    if (optimizedSize < originalSize) {
      // 원본을 최적화된 파일로 교체
      fs.renameSync(tempPath, imagePath)

      const savedBytes = originalSize - optimizedSize
      const savedPercent = Math.round((savedBytes / originalSize) * 100)

      return {
        success: true,
        originalSize,
        optimizedSize,
        savedBytes,
        savedPercent,
      }
    } else {
      // 최적화 효과가 없으면 임시 파일 삭제
      fs.unlinkSync(tempPath)
      return {
        skipped: true,
        reason: 'No optimization benefit',
        originalSize,
        optimizedSize: originalSize,
      }
    }
  } catch (error) {
    console.error(`❌ Error optimizing ${imagePath}:`, error.message)

    // 오류 발생 시 임시 파일 정리
    const tempPath = imagePath + '.temp'
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }

    return {
      error: true,
      message: error.message,
      originalSize: 0,
      optimizedSize: 0,
    }
  }
}

/**
 * 메인 최적화 함수
 */
async function optimizeImages() {
  console.log('🖼️  이미지 최적화를 시작합니다...')

  // 출력 디렉토리에서 이미지 찾기
  const outImagesDir = path.join(process.cwd(), 'out', 'images')

  if (!fs.existsSync(outImagesDir)) {
    console.log('❌ out/images 디렉토리를 찾을 수 없습니다.')
    console.log('먼저 "npm run build"를 실행해주세요.')
    process.exit(1)
  }

  console.log(`📂 ${outImagesDir}에서 이미지를 스캔합니다...`)

  // 모든 이미지 파일 찾기
  const images = await findImages(outImagesDir)

  if (images.length === 0) {
    console.log('✅ 최적화할 이미지를 찾을 수 없습니다.')
    return
  }

  // 크기별로 정렬 (큰 파일부터)
  images.sort((a, b) => b.size - a.size)

  console.log(`🔍 ${images.length}개의 이미지 파일을 발견했습니다.`)
  console.log(
    `📊 총 크기: ${formatBytes(images.reduce((sum, img) => sum + img.size, 0))}`
  )

  // 통계 변수
  let optimized = 0
  let skipped = 0
  let errors = 0
  let totalOriginalSize = 0
  let totalOptimizedSize = 0

  // 각 이미지 최적화
  for (const [index, image] of images.entries()) {
    const progress = `[${index + 1}/${images.length}]`
    const relativePath = path.relative(process.cwd(), image.path)

    console.log(
      `${progress} 처리 중: ${relativePath} (${formatBytes(image.size)})`
    )

    const result = await optimizeImage(image.path)

    totalOriginalSize += result.originalSize
    totalOptimizedSize += result.optimizedSize

    if (result.success) {
      optimized++
      console.log(
        `  ✅ 최적화 완료: ${formatBytes(result.savedBytes)} 절약 (${result.savedPercent}%)`
      )
    } else if (result.skipped) {
      skipped++
      console.log(`  ⏭️  건너뜀: ${result.reason}`)
    } else if (result.error) {
      errors++
      console.log(`  ❌ 오류: ${result.message}`)
    }
  }

  // 결과 요약
  console.log('\n🎉 이미지 최적화가 완료되었습니다!')
  console.log('📊 요약:')
  console.log(`  • 처리된 파일: ${images.length}개`)
  console.log(`  • 최적화됨: ${optimized}개`)
  console.log(`  • 건너뜀: ${skipped}개`)
  console.log(`  • 오류: ${errors}개`)
  console.log(`  • 원본 크기: ${formatBytes(totalOriginalSize)}`)
  console.log(`  • 최적화 후: ${formatBytes(totalOptimizedSize)}`)

  if (totalOriginalSize > totalOptimizedSize) {
    const totalSaved = totalOriginalSize - totalOptimizedSize
    const totalSavedPercent = Math.round((totalSaved / totalOriginalSize) * 100)
    console.log(
      `  • 절약된 용량: ${formatBytes(totalSaved)} (${totalSavedPercent}%)`
    )
  }

  console.log(
    '\n💡 팁: WebP 형식으로 추가 변환하려면 다음 단계를 고려해보세요.'
  )
}

// 스크립트가 직접 실행된 경우
if (require.main === module) {
  optimizeImages()
    .then(() => {
      console.log('\n✅ 모든 최적화 작업이 완료되었습니다.')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ 최적화 중 오류가 발생했습니다:', error)
      process.exit(1)
    })
}

module.exports = { optimizeImages }
