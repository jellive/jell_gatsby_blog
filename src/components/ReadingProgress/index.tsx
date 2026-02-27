'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faBook, faEye } from '@fortawesome/free-solid-svg-icons'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  target?: string
  className?: string
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  target = '.blog-post-content',
  className = '',
}) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  useEffect(() => {
    const calculateProgress = () => {
      // Find the target content element
      const content = document.querySelector(target) as HTMLElement
      if (!content) return

      // Get scroll position and content dimensions
      const scrollTop = window.pageYOffset
      setIsHeaderVisible(scrollTop <= 50)
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight

      // Get content position and height
      const contentTop = content.offsetTop
      const contentHeight = content.offsetHeight
      const contentBottom = contentTop + contentHeight

      // Calculate if we're within the content area
      const startReading = contentTop
      const finishReading = contentBottom - windowHeight

      // Show progress bar only when in content area
      if (scrollTop >= startReading - 100) {
        setIsVisible(true)

        // Calculate progress percentage
        if (scrollTop <= startReading) {
          setProgress(0)
        } else if (scrollTop >= finishReading) {
          setProgress(100)
        } else {
          const readableDistance = finishReading - startReading
          const progressDistance = scrollTop - startReading
          const percentage = Math.min(
            100,
            Math.max(0, (progressDistance / readableDistance) * 100)
          )
          setProgress(percentage)
        }
      } else {
        setIsVisible(false)
        setProgress(0)
      }
    }

    // Throttle scroll events for better performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial calculation
    calculateProgress()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateProgress)
    }
  }, [target])

  return (
    <Card
      className={cn(
        'fixed left-0 right-0 z-[1000]', // High z-index, just below header (1001)
        isHeaderVisible ? 'top-[70px]' : 'top-0', // Dynamic top position based on header visibility
        'border-border/50 bg-card/95 border-0 border-b backdrop-blur-sm',
        'shadow-sm transition-all duration-300 ease-in-out',
        'rounded-none',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
        className
      )}
    >
      <div className="flex items-center p-2">
        {/* Progress Bar Section */}
        <div className="flex-1 px-3">
          <Progress
            value={progress}
            className={cn(
              'bg-secondary/50 h-2',
              '[&>div]:to-primary/80 [&>div]:bg-gradient-to-r [&>div]:from-primary',
              '[&>div]:transition-all [&>div]:duration-200'
            )}
            aria-label={`읽기 진행률 ${Math.round(progress)}%`}
          />
        </div>

        {/* Progress Text & Icon */}
        <div className="border-border/30 flex items-center gap-2 border-l px-3">
          <Fa
            icon={progress > 95 ? faEye : faBook}
            className={cn(
              'text-xs transition-all duration-300',
              progress > 95
                ? 'animate-pulse text-green-600'
                : 'text-muted-foreground'
            )}
          />
          <Badge
            variant={progress > 95 ? 'default' : 'secondary'}
            className={cn(
              'min-w-[3rem] justify-center text-xs font-medium',
              'transition-all duration-300',
              progress > 95 && 'bg-green-600 text-white hover:bg-green-700'
            )}
          >
            <span className="sr-only">읽기 진행률:</span>
            {Math.round(progress)}%
          </Badge>
        </div>
      </div>

      {/* Completion celebration */}
      {progress >= 100 && (
        <div
          className={cn(
            'absolute -top-1 left-1/2 -translate-x-1/2 transform',
            'animate-bounce text-xs font-medium text-green-600'
          )}
        >
          🎉 완독!
        </div>
      )}
    </Card>
  )
}

export default ReadingProgress
