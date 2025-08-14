'use client'

import React, { useEffect, useState } from 'react'

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
    <div 
      id="top"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'all' : 'none'
      }}
      onClick={scrollToTop}
    >
      <svg 
        aria-hidden="true" 
        focusable="false" 
        data-prefix="fas" 
        data-icon="angle-double-up" 
        role="img" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 320 512"
      >
        <path 
          fill="currentColor" 
          d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.4 24.6-9.4 33.9 0zm0-128l136 136c9.4 9.4 9.4 24.6 0 33.9L290.3 224c-9.4 9.4-24.6 9.4-33.9 0L160 127.9 63.6 224.3c-9.4 9.4-24.6 9.4-33.9 0L7 201.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.4 24.6-9.4 33.9 0z"
        />
      </svg>
    </div>
  )
}

export default ScrollToTop