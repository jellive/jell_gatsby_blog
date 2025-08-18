'use client'

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentYPos = window.pageYOffset
      setIsVisible(currentYPos > 400) // Show button after scrolling 400px
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button
      id="scroll-to-top"
      variant="outline"
      size="icon"
      className={cn(
        'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full',
        'border-border/50 bg-card/90 backdrop-blur-sm',
        'hover:border-primary hover:bg-primary hover:text-primary-foreground',
        'transition-all duration-300 ease-in-out',
        'shadow-lg hover:scale-110 hover:shadow-xl',
        'focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      )}
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
      title="맨 위로 이동"
    >
      <Fa
        icon={faChevronUp}
        className="text-lg transition-transform duration-200 hover:scale-110"
      />
    </Button>
  )
}

export default ScrollToTop
