# 성능 최적화 권고사항

**목표**: 웹사이트 로딩 시간 50% 단축 및 Core Web Vitals 90점 달성  
**현재 상태**: 번들 크기 754MB, 성능 지표 미측정  
**목표 상태**: 번들 크기 400MB 미만, LCP < 2.5s, FID < 100ms

## 🎯 성능 최적화 전략 개요

### 우선순위 매트릭스

| 개선사항         | 영향도 | 구현 난이도 | 투자 대비 효과 | 우선순위 |
| ---------------- | ------ | ----------- | -------------- | -------- |
| 번들 크기 최적화 | High   | Medium      | Very High      | 1        |
| 이미지 최적화    | High   | Low         | High           | 2        |
| 폰트 로딩 최적화 | Medium | Low         | High           | 3        |
| 코드 분할 개선   | Medium | Medium      | Medium         | 4        |
| 캐싱 전략 강화   | Medium | Low         | Medium         | 5        |

## 📦 번들 크기 최적화

### 현재 상태 분석

```bash
# 현재 빌드 크기
총 크기: 754MB
├── node_modules: 438MB (58%)
├── static files: 316MB (42%)
└── JS bundles: 적정 수준 (13K-65K)
```

### 1.1 Bundle Analyzer 도입

**설치 및 설정**:

```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  ...nextConfig,
  // 추가 최적화 설정
  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/free-solid-svg-icons',
      'lucide-react',
    ],
  },
})
```

**사용법**:

```bash
ANALYZE=true npm run build
```

### 1.2 의존성 최적화

**FontAwesome 최적화**:

```typescript
// ❌ 전체 아이콘 팩 import (현재)
import { faTags, faSearch } from '@fortawesome/free-solid-svg-icons'

// ✅ 개별 아이콘 import (권장)
import faTags from '@fortawesome/free-solid-svg-icons/faTags'
import faSearch from '@fortawesome/free-solid-svg-icons/faSearch'
```

**Lodash 대신 개별 유틸리티**:

```typescript
// ❌ 전체 lodash import
import _ from 'lodash'

// ✅ 개별 함수 import 또는 native 메서드 사용
import debounce from 'lodash/debounce'
// 또는
const debounce = (func, wait) => {
  /* native 구현 */
}
```

### 1.3 Tree Shaking 최적화

**package.json 설정**:

```json
{
  "sideEffects": ["*.css", "*.scss", "./src/app/globals.css"]
}
```

**Import 최적화**:

```typescript
// ❌ 잘못된 import 패턴
import * as React from 'react'
import { Component } from 'react'

// ✅ 최적화된 import 패턴
import React, { Component, useState, useEffect } from 'react'
```

## 🖼️ 이미지 최적화

### 현재 상태

- 이미지 중복: public/ + out/ 동일 파일 존재
- 포맷: 주로 PNG/JPG (최적화 여지 있음)
- 크기: 반응형 이미지 미적용

### 2.1 이미지 처리 파이프라인 구축

**Sharp 기반 최적화 스크립트**:

```javascript
// scripts/optimize-images.js
const sharp = require('sharp')
const glob = require('glob')
const path = require('path')

async function optimizeImage(inputPath, outputPath) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  // WebP 변환 + 품질 최적화
  await image
    .webp({ quality: 85 })
    .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'))

  // 원본 포맷 최적화
  if (metadata.format === 'jpeg') {
    await image.jpeg({ quality: 85, progressive: true }).toFile(outputPath)
  } else if (metadata.format === 'png') {
    await image.png({ compressionLevel: 9 }).toFile(outputPath)
  }
}

// 이미지 일괄 최적화 실행
async function processImages() {
  const images = glob.sync('public/images/**/*.{jpg,jpeg,png}')

  for (const imagePath of images) {
    const outputPath = imagePath.replace('public/', 'public/optimized/')
    await optimizeImage(imagePath, outputPath)
    console.log(`Optimized: ${imagePath}`)
  }
}

processImages()
```

### 2.2 반응형 이미지 시스템

**Next.js Image 컴포넌트 활용**:

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className
}) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      onError={() => {
        // WebP 지원하지 않는 브라우저 대응
        setImgSrc(src.replace('.webp', '.jpg'))
      }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### 2.3 이미지 CDN 도입 (선택사항)

**Cloudinary 또는 Vercel Image 최적화**:

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

## 🔤 폰트 로딩 최적화

### 현재 상태

- Pretendard CDN 사용 (외부 의존성)
- Google Fonts CDN 사용
- font-display: swap 부분 적용

### 3.1 폰트 로컬 호스팅

**폰트 파일 다운로드 및 설정**:

```bash
# 폰트 파일 다운로드
mkdir -p public/fonts
# Pretendard 폰트 파일들을 public/fonts/에 저장
```

```css
/* app/globals.css 개선 */
@font-face {
  font-family: 'Pretendard Variable';
  src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
  font-weight: 45 920;
  font-style: normal;
  font-display: swap;
  unicode-range:
    U+AC00-D7AF, U+1100-11FF, U+3130-318F, U+A960-A97F, U+D7B0-D7FF;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
```

### 3.2 폰트 서브셋 생성

**한국어 최적화 서브셋**:

```javascript
// scripts/generate-font-subset.js
const fontkit = require('fontkit')
const fs = require('fs')

// 자주 사용되는 한국어 2350자 + 영문 + 숫자 + 기호
const koreanSubset = '가각간갇...' // 완전한 리스트

async function createSubset() {
  const font = fontkit.openSync('fonts/PretendardVariable.woff2')
  const subset = font.createSubset()

  // 서브셋 문자 추가
  for (const char of koreanSubset) {
    subset.includeGlyph(font.glyphForCodePoint(char.codePointAt(0)))
  }

  const data = subset.encode()
  fs.writeFileSync('public/fonts/PretendardVariable-Subset.woff2', data)
}
```

### 3.3 폰트 미리 로드

**Critical 폰트 preload**:

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/fonts/PretendardVariable-Subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/JetBrainsMono-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## ⚡ 코드 분할 및 지연 로딩

### 4.1 컴포넌트 레벨 지연 로딩

**무거운 컴포넌트 동적 import**:

```typescript
// 현재 코드 (즉시 로드)
import Disqus from '@/components/Comments/Disqus'

// 개선된 코드 (지연 로드)
import dynamic from 'next/dynamic'

const Disqus = dynamic(() => import('@/components/Comments/Disqus'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded" />,
  ssr: false
})

// 조건부 로딩
const CommandPalette = dynamic(
  () => import('@/components/CommandPalette'),
  { ssr: false }
)
```

### 4.2 라이브러리 지연 로딩

**Prism.js 동적 로딩**:

```typescript
// lib/prism-loader.ts
export async function loadPrism(language: string) {
  // 기본 Prism 로딩
  await import('prismjs')

  // 언어별 문법 동적 로딩
  if (language !== 'javascript') {
    await import(`prismjs/components/prism-${language}`)
  }

  // 테마 동적 로딩
  await import('prismjs/themes/prism-tomorrow.css')
}
```

### 4.3 Route 기반 분할

**페이지별 번들 분석**:

```typescript
// app/posts/[...slug]/page.tsx 최적화
import dynamic from 'next/dynamic'

// TOC는 긴 포스트에만 필요
const TableOfContents = dynamic(() => import('@/components/Toc'), {
  ssr: false
})

// 소셜 공유는 사용자 액션 시에만 로딩
const SocialShare = dynamic(() => import('@/components/SocialShare'), {
  ssr: false
})

export default function PostPage({ params }: { params: { slug: string[] } }) {
  const [showToc, setShowToc] = useState(false)

  return (
    <article>
      {/* 포스트 내용 */}
      {showToc && <TableOfContents />}
    </article>
  )
}
```

## 🗄️ 캐싱 전략 최적화

### 5.1 Netlify 캐시 헤더 개선

**netlify.toml 최적화**:

```toml
# 정적 자산 장기 캐싱
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# 이미지 캐싱
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=2592000"
    Vary = "Accept-Encoding"

# HTML 페이지 캐싱
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=86400, must-revalidate"

# API 응답 캐싱
[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

### 5.2 Service Worker 캐싱

**PWA 캐싱 전략**:

```typescript
// public/sw.js
const CACHE_NAME = 'jell-blog-v1'
const STATIC_ASSETS = [
  '/',
  '/fonts/PretendardVariable-Subset.woff2',
  '/fonts/JetBrainsMono-Variable.woff2',
  '/_next/static/css/app.css',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

// 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request).then(fetchResponse => {
            const responseClone = fetchResponse.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone)
            })
            return fetchResponse
          })
        )
      })
    )
  }
})
```

## 📊 성능 모니터링 시스템

### 6.1 Web Vitals 수집

**성능 지표 측정**:

```typescript
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface WebVitalsMetric {
  name: string
  value: number
  delta: number
  id: string
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Google Analytics 4로 전송
  if (typeof gtag !== 'undefined') {
    gtag('event', 'web_vitals', {
      event_category: 'Performance',
      event_label: metric.name,
      value: Math.round(metric.value),
      custom_map: {
        metric_id: metric.id,
        metric_delta: metric.delta,
      },
    })
  }

  // 개발 환경에서 콘솔 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric)
  }
}

// 자동 측정 시작
export function initWebVitals() {
  getCLS(reportWebVitals)
  getFID(reportWebVitals)
  getFCP(reportWebVitals)
  getLCP(reportWebVitals)
  getTTFB(reportWebVitals)
}
```

### 6.2 Performance Observer

**상세 성능 분석**:

```typescript
// lib/performance-monitor.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startMonitoring() {
    // 네비게이션 타이밍
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.reportNavigationTiming(entry as PerformanceNavigationTiming)
        }
      }
    }).observe({ entryTypes: ['navigation'] })

    // 리소스 타이밍
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        this.analyzeResourceTiming(entry as PerformanceResourceTiming)
      }
    }).observe({ entryTypes: ['resource'] })
  }

  private reportNavigationTiming(timing: PerformanceNavigationTiming) {
    const metrics = {
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      loadComplete: timing.loadEventEnd - timing.loadEventStart,
      firstByte: timing.responseStart - timing.requestStart,
      domParsing: timing.domComplete - timing.domLoading,
    }

    console.log('Navigation Metrics:', metrics)
  }

  private analyzeResourceTiming(timing: PerformanceResourceTiming) {
    // 느린 리소스 식별
    const loadTime = timing.responseEnd - timing.requestStart
    if (loadTime > 1000) {
      // 1초 이상
      console.warn('Slow resource:', timing.name, `${loadTime}ms`)
    }
  }
}
```

## 🎯 성능 목표 및 측정

### Core Web Vitals 목표

| 지표                           | 현재   | 목표    | 측정 도구      |
| ------------------------------ | ------ | ------- | -------------- |
| LCP (Largest Contentful Paint) | 미측정 | < 2.5s  | Web Vitals API |
| FID (First Input Delay)        | 미측정 | < 100ms | Web Vitals API |
| CLS (Cumulative Layout Shift)  | 미측정 | < 0.1   | Web Vitals API |

### 추가 성능 지표

| 지표                   | 현재   | 목표    | 측정 도구       |
| ---------------------- | ------ | ------- | --------------- |
| 번들 크기              | 754MB  | < 400MB | Bundle Analyzer |
| 페이지 로드 시간       | 미측정 | < 2s    | Lighthouse      |
| Time to Interactive    | 미측정 | < 3s    | Lighthouse      |
| First Contentful Paint | 미측정 | < 1.8s  | Web Vitals API  |

## 🚀 실행 계획

### Phase 1: 즉시 실행 (1주)

1. ✅ Bundle Analyzer 설정
2. ✅ 이미지 최적화 스크립트 작성
3. ✅ 폰트 로컬 호스팅 준비
4. ✅ 성능 측정 기준선 설정

### Phase 2: 핵심 최적화 (2주)

1. 🔄 번들 크기 50% 감소
2. 🔄 이미지 WebP 변환 및 압축
3. 🔄 폰트 서브셋 적용
4. 🔄 코드 분할 개선

### Phase 3: 고급 최적화 (1주)

1. ⏳ Service Worker 캐싱
2. ⏳ 성능 모니터링 시스템
3. ⏳ A/B 테스트를 통한 검증
4. ⏳ 최종 성능 측정 및 튜닝

### 성공 기준

- 번들 크기 47% 감소 달성
- Core Web Vitals 90점 이상
- Lighthouse 성능 점수 90점 이상
- 실제 사용자 성능 개선 체감

이 성능 최적화 가이드를 단계적으로 적용하면 웹사이트의 로딩 속도와 사용자 경험을 크게 개선할 수 있습니다.
