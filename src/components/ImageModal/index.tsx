'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faExpand,
  faCompress,
  faDownload,
  faShare,
  faChevronLeft,
  faChevronRight,
  faInfo,
  faEye,
} from '@fortawesome/free-solid-svg-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface ImageData {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

interface ImageModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  images: ImageData[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export default function ImageModal({
  isOpen,
  onOpenChange,
  images,
  currentIndex,
  onIndexChange,
}: ImageModalProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  // Reset state when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setIsZoomed(false)
      setImageLoaded(false)
      setShowInfo(false)
    }
  }, [isOpen, currentIndex])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (hasMultipleImages && currentIndex > 0) {
            onIndexChange(currentIndex - 1)
          }
          break
        case 'ArrowRight':
          if (hasMultipleImages && currentIndex < images.length - 1) {
            onIndexChange(currentIndex + 1)
          }
          break
        case 'Escape':
          onOpenChange(false)
          break
        case 'i':
        case 'I':
          setShowInfo(prev => !prev)
          break
        case 'z':
        case 'Z':
          setIsZoomed(prev => !prev)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    isOpen,
    currentIndex,
    hasMultipleImages,
    images.length,
    onIndexChange,
    onOpenChange,
  ])

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1)
    }
  }

  const handleDownload = () => {
    if (currentImage) {
      // Create download link
      const link = document.createElement('a')
      link.href = currentImage.src
      link.download = currentImage.alt || 'image'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (currentImage && navigator.share) {
      try {
        await navigator.share({
          title: currentImage.alt || 'Image',
          text: currentImage.caption || currentImage.alt || 'Shared image',
          url: currentImage.src,
        })
      } catch (error) {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(currentImage.src)
      }
    } else if (currentImage) {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(currentImage.src)
    }
  }

  if (!currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'h-auto max-h-[95vh] w-auto max-w-[95vw] p-0',
          'border-border/50 bg-background/95 backdrop-blur-md',
          'focus:outline-none'
        )}
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>이미지 확대 보기</DialogTitle>
          <DialogDescription>
            {currentImage.alt || '이미지를 확대하여 볼 수 있습니다'}
          </DialogDescription>
        </DialogHeader>

        {/* Navigation Controls */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                'absolute left-4 top-1/2 z-50 -translate-y-1/2',
                'bg-background/80 h-10 w-10 rounded-full backdrop-blur-sm',
                'border-border/50 border hover:bg-background',
                'disabled:cursor-not-allowed disabled:opacity-30'
              )}
              aria-label="이전 이미지"
            >
              <Fa icon={faChevronLeft} className="text-sm" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
              className={cn(
                'absolute right-4 top-1/2 z-50 -translate-y-1/2',
                'bg-background/80 h-10 w-10 rounded-full backdrop-blur-sm',
                'border-border/50 border hover:bg-background',
                'disabled:cursor-not-allowed disabled:opacity-30'
              )}
              aria-label="다음 이미지"
            >
              <Fa icon={faChevronRight} className="text-sm" />
            </Button>
          </>
        )}

        {/* Toolbar */}
        <div
          className={cn(
            'absolute left-4 right-4 top-4 z-50',
            'flex items-center justify-between gap-2'
          )}
        >
          {/* Image Counter */}
          {hasMultipleImages && (
            <Badge
              variant="secondary"
              className="bg-background/80 border-border/50 border backdrop-blur-sm"
            >
              {currentIndex + 1} / {images.length}
            </Badge>
          )}

          <div className="flex-1" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(prev => !prev)}
              className={cn(
                'bg-background/80 h-9 w-9 rounded-full backdrop-blur-sm',
                'border-border/50 border hover:bg-background',
                showInfo && 'bg-primary text-primary-foreground'
              )}
              aria-label="이미지 정보 표시"
              title="이미지 정보 (I)"
            >
              <Fa icon={faInfo} className="text-xs" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsZoomed(prev => !prev)}
              className={cn(
                'bg-background/80 h-9 w-9 rounded-full backdrop-blur-sm',
                'border-border/50 border hover:bg-background'
              )}
              aria-label={isZoomed ? '축소' : '확대'}
              title={isZoomed ? '축소 (Z)' : '확대 (Z)'}
            >
              <Fa icon={isZoomed ? faCompress : faExpand} className="text-xs" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className={cn(
                'bg-background/80 h-9 w-9 rounded-full backdrop-blur-sm',
                'border-border/50 border hover:bg-background'
              )}
              aria-label="이미지 공유"
              title="이미지 공유"
            >
              <Fa icon={faShare} className="text-xs" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className={cn(
                'bg-background/80 h-9 w-9 rounded-full backdrop-blur-sm',
                'border-border/50 border hover:bg-background'
              )}
              aria-label="이미지 다운로드"
              title="이미지 다운로드"
            >
              <Fa icon={faDownload} className="text-xs" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div
          className={cn(
            'relative flex items-center justify-center',
            'max-h-[90vh] min-h-[200px] overflow-hidden',
            'bg-black/20'
          )}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          )}

          <img
            src={currentImage.src}
            alt={currentImage.alt}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'max-h-full max-w-full object-contain transition-all duration-300',
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in',
              !imageLoaded && 'opacity-0'
            )}
            onClick={() => setIsZoomed(prev => !prev)}
            style={{
              maxWidth: isZoomed ? 'none' : '100%',
              maxHeight: isZoomed ? 'none' : '90vh',
            }}
          />
        </div>

        {/* Image Info Panel */}
        {showInfo && (currentImage.alt || currentImage.caption) && (
          <div
            className={cn(
              'absolute bottom-4 left-4 right-4 z-50',
              'bg-background/90 border-border/50 rounded-lg border p-4 backdrop-blur-md'
            )}
          >
            {currentImage.alt && (
              <h3 className="mb-2 font-medium text-foreground">
                {currentImage.alt}
              </h3>
            )}

            {currentImage.caption &&
              currentImage.caption !== currentImage.alt && (
                <>
                  <Separator className="my-2" />
                  <p className="text-sm text-muted-foreground">
                    {currentImage.caption}
                  </p>
                </>
              )}

            {(currentImage.width || currentImage.height) && (
              <>
                <Separator className="my-2" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Fa icon={faEye} className="text-[10px]" />
                  <span>
                    {currentImage.width && currentImage.height
                      ? `${currentImage.width} × ${currentImage.height}px`
                      : '원본 크기'}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div
          className={cn(
            'absolute bottom-4 left-1/2 z-40 -translate-x-1/2',
            'bg-background/80 text-xs text-muted-foreground backdrop-blur-sm',
            'border-border/30 rounded-full border px-3 py-1.5',
            'opacity-60 transition-opacity duration-200 hover:opacity-100'
          )}
        >
          <div className="flex items-center gap-3">
            {hasMultipleImages && (
              <>
                <span>← → 이미지 탐색</span>
                <span>•</span>
              </>
            )}
            <span>Z 확대/축소</span>
            <span>•</span>
            <span>I 정보</span>
            <span>•</span>
            <span>ESC 닫기</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
