#!/usr/bin/env node

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

// 최신 이미지 포맷 설정
const MODERN_FORMATS = {
  webp: {
    quality: 85,
    effort: 6,
    lossless: false,
  },
  avif: {
    quality: 75,
    effort: 4,
    speed: 4,
  },
}

// 원본 이미지 확장자 (WebP/AVIF로 변환할 대상)
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png']

/**
 * 디렉토리를 재귀적으로 탐색하여 모든 이미지 파일을 찾습니다.
 */
async function findSourceImages(dir) {
  const images = []

  try {
    const entries = await readdir(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stats = await stat(fullPath)

      if (stats.isDirectory()) {
        // 재귀적으로 하위 디렉토리 탐색
        const subImages = await findSourceImages(fullPath)
        images.push(...subImages)
      } else if (stats.isFile()) {
        const ext = path.extname(entry).toLowerCase()
        if (SOURCE_EXTENSIONS.includes(ext)) {
          images.push({
            path: fullPath,
            size: stats.size,
            extension: ext,
            name: path.parse(entry).name,
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
 * 단일 이미지를 WebP와 AVIF 포맷으로 변환합니다.
 */
async function generateModernFormats(imagePath, imageInfo) {
  const results = {
    webp: { success: false, error: null, outputPath: null, size: 0 },
    avif: { success: false, error: null, outputPath: null, size: 0 },
  }

  const dir = path.dirname(imagePath)
  const baseName = imageInfo.name

  // WebP 변환
  try {
    const webpPath = path.join(dir, `${baseName}.webp`)

    // 이미 WebP 파일이 존재하는지 확인
    if (!fs.existsSync(webpPath)) {
      await sharp(imagePath).webp(MODERN_FORMATS.webp).toFile(webpPath)

      const webpStats = await stat(webpPath)
      results.webp = {
        success: true,
        error: null,
        outputPath: webpPath,
        size: webpStats.size,
      }
    } else {
      // 이미 존재하는 경우 크기만 확인
      const webpStats = await stat(webpPath)
      results.webp = {
        success: true,
        error: null,
        outputPath: webpPath,
        size: webpStats.size,
        skipped: true,
      }
    }
  } catch (error) {
    results.webp.error = error.message
    console.error(`❌ WebP conversion failed for ${imagePath}:`, error.message)
  }

  // AVIF 변환
  try {
    const avifPath = path.join(dir, `${baseName}.avif`)

    // 이미 AVIF 파일이 존재하는지 확인
    if (!fs.existsSync(avifPath)) {
      await sharp(imagePath).avif(MODERN_FORMATS.avif).toFile(avifPath)

      const avifStats = await stat(avifPath)
      results.avif = {
        success: true,
        error: null,
        outputPath: avifPath,
        size: avifStats.size,
      }
    } else {
      // 이미 존재하는 경우 크기만 확인
      const avifStats = await stat(avifPath)
      results.avif = {
        success: true,
        error: null,
        outputPath: avifPath,
        size: avifStats.size,
        skipped: true,
      }
    }
  } catch (error) {
    results.avif.error = error.message
    console.error(`❌ AVIF conversion failed for ${imagePath}:`, error.message)
  }

  return results
}

/**
 * 메인 변환 함수
 */
async function generateModernImageFormats() {
  console.log('🚀 차세대 이미지 포맷 생성을 시작합니다...')

  // 출력 디렉토리에서 이미지 찾기
  const outImagesDir = path.join(process.cwd(), 'out', 'images')

  if (!fs.existsSync(outImagesDir)) {
    console.log('❌ out/images 디렉토리를 찾을 수 없습니다.')
    console.log('먼저 "npm run build"를 실행해주세요.')
    process.exit(1)
  }

  console.log(`📂 ${outImagesDir}에서 이미지를 스캔합니다...`)

  // 모든 원본 이미지 파일 찾기
  const sourceImages = await findSourceImages(outImagesDir)

  if (sourceImages.length === 0) {
    console.log('✅ 변환할 이미지를 찾을 수 없습니다.')
    return
  }

  // 크기별로 정렬 (큰 파일부터)
  sourceImages.sort((a, b) => b.size - a.size)

  console.log(`🔍 ${sourceImages.length}개의 원본 이미지 파일을 발견했습니다.`)
  console.log(
    `📊 총 크기: ${formatBytes(sourceImages.reduce((sum, img) => sum + img.size, 0))}`
  )

  // 통계 변수
  let webpGenerated = 0
  let avifGenerated = 0
  let webpSkipped = 0
  let avifSkipped = 0
  let errors = 0
  let totalWebpSize = 0
  let totalAvifSize = 0

  // 각 이미지 변환
  for (const [index, image] of sourceImages.entries()) {
    const progress = `[${index + 1}/${sourceImages.length}]`
    const relativePath = path.relative(process.cwd(), image.path)

    console.log(
      `${progress} 처리 중: ${relativePath} (${formatBytes(image.size)})`
    )

    const results = await generateModernFormats(image.path, image)

    // WebP 결과 처리
    if (results.webp.success) {
      if (results.webp.skipped) {
        webpSkipped++
        console.log(`  📄 WebP 이미 존재: ${formatBytes(results.webp.size)}`)
      } else {
        webpGenerated++
        totalWebpSize += results.webp.size
        const compression = Math.round(
          ((image.size - results.webp.size) / image.size) * 100
        )
        console.log(
          `  ✅ WebP 생성: ${formatBytes(results.webp.size)} (${compression}% 압축)`
        )
      }
    } else if (results.webp.error) {
      errors++
    }

    // AVIF 결과 처리
    if (results.avif.success) {
      if (results.avif.skipped) {
        avifSkipped++
        console.log(`  📄 AVIF 이미 존재: ${formatBytes(results.avif.size)}`)
      } else {
        avifGenerated++
        totalAvifSize += results.avif.size
        const compression = Math.round(
          ((image.size - results.avif.size) / image.size) * 100
        )
        console.log(
          `  ✅ AVIF 생성: ${formatBytes(results.avif.size)} (${compression}% 압축)`
        )
      }
    } else if (results.avif.error) {
      errors++
    }
  }

  // 결과 요약
  console.log('\n🎉 차세대 이미지 포맷 생성이 완료되었습니다!')
  console.log('📊 요약:')
  console.log(`  • 처리된 원본 파일: ${sourceImages.length}개`)
  console.log(`  • WebP 새로 생성: ${webpGenerated}개`)
  console.log(`  • WebP 이미 존재: ${webpSkipped}개`)
  console.log(`  • AVIF 새로 생성: ${avifGenerated}개`)
  console.log(`  • AVIF 이미 존재: ${avifSkipped}개`)
  console.log(`  • 오류 발생: ${errors}개`)

  if (webpGenerated > 0) {
    console.log(`  • WebP 총 크기: ${formatBytes(totalWebpSize)}`)
  }
  if (avifGenerated > 0) {
    console.log(`  • AVIF 총 크기: ${formatBytes(totalAvifSize)}`)
  }

  console.log('\n💡 다음 단계:')
  console.log('   1. OptimizedImage 컴포넌트를 구현하세요')
  console.log('   2. 기존 img 태그를 OptimizedImage로 교체하세요')
  console.log('   3. Lighthouse로 성능 개선을 확인하세요')
}

// 스크립트가 직접 실행된 경우
if (require.main === module) {
  generateModernImageFormats()
    .then(() => {
      console.log('\n✅ 모든 변환 작업이 완료되었습니다.')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ 변환 중 오류가 발생했습니다:', error)
      process.exit(1)
    })
}

module.exports = { generateModernImageFormats }
