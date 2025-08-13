'use client'

import React, { useEffect, useRef } from 'react'
import './toc.css'

interface TocProps {
  toc: string
  isOutside: boolean
}

const Toc = (props: TocProps) => {
  const { toc, isOutside } = props
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tocRef.current) return

    const handleTocClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      
      // Only handle anchor links within TOC
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault()
        
        const targetId = target.hash.slice(1)
        const targetElement = document.getElementById(targetId)
        
        if (targetElement) {
          // Smooth scroll to target with offset for fixed header
          const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '6rem'
          const offset = parseFloat(headerHeight) * 16 + 20 // Convert rem to px and add some padding
          
          const targetPosition = targetElement.offsetTop - offset
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
          
          // Update URL hash without triggering default behavior
          if (history.replaceState) {
            history.replaceState(null, '', target.hash)
          }
          
          // Add temporary focus indicator
          target.style.opacity = '1'
          target.style.fontWeight = 'bold'
          
          setTimeout(() => {
            target.style.opacity = ''
            target.style.fontWeight = ''
          }, 1500)
        }
      }
    }

    // Add event listener to TOC container
    tocRef.current.addEventListener('click', handleTocClick)
    
    return () => {
      tocRef.current?.removeEventListener('click', handleTocClick)
    }
  }, [toc])

  if (!toc || toc === '') {
    return null
  }

  return (
    <div 
      ref={tocRef}
      className={`toc ${isOutside ? 'outside' : 'inside'}`} 
      dangerouslySetInnerHTML={{ __html: toc }}
    />
  )
}

export default Toc