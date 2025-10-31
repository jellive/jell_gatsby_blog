'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  priority?: boolean
  sizes?: string
  loading?: 'lazy' | 'eager'
  quality?: number
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
}

/**
 * 최적화된 이미지 컴포넌트
 * WebP, AVIF 포맷을 우선적으로 사용하고 원본으로 fallback
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '100vw',
  loading = 'lazy',
  quality = 85,
  onLoad,
  onError,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  // 이미지 경로에서 확장자 제거
  const getBasePath = (imagePath: string): string => {
    const lastDotIndex = imagePath.lastIndexOf('.')
    if (lastDotIndex === -1) return imagePath
    return imagePath.substring(0, lastDotIndex)
  }

  // 이미지 포맷별 경로 생성
  const basePath = getBasePath(src)
  const avifSrc = `${basePath}.avif`
  const webpSrc = `${basePath}.webp`

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // 로딩 상태나 뷰포트 밖에 있을 때 플레이스홀더 표시
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-800',
          'flex items-center justify-center',
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
          ...style,
        }}
        aria-label={`Loading ${alt}`}
      >
        <svg
          className="h-8 w-8 text-gray-400 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <picture className={cn('block', className)}>
      {/* AVIF (최신 포맷, 최고 압축률) */}
      <source srcSet={avifSrc} type="image/avif" />

      {/* WebP (널리 지원되는 현대 포맷) */}
      <source srcSet={webpSrc} type="image/webp" />

      {/* 원본 이미지 (fallback) */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          {
            'opacity-0': !isLoaded && !hasError,
            'opacity-100': isLoaded || hasError,
          },
          className
        )}
        style={style}
        {...props}
      />
    </picture>
  )
}

export default OptimizedImage
