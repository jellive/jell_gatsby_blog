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
      const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement
      
      // Only handle anchor links within TOC
      if (target && target.tagName === 'A' && target.hash) {
        e.preventDefault()
        
        // Decode URL-encoded hash (Korean text gets encoded)
        const rawTargetId = target.hash.slice(1)
        const targetId = decodeURIComponent(rawTargetId)
        
        console.log('TOC Click Debug:', {
          rawHash: target.hash,
          rawTargetId,
          decodedTargetId: targetId
        })
        
        // Try multiple strategies to find the target element
        let targetElement = document.getElementById(targetId) || 
                           document.getElementById(rawTargetId) ||
                           document.querySelector(`[id="${targetId}"]`) ||
                           document.querySelector(`[id="${rawTargetId}"]`) ||
                           document.querySelector(`h1, h2, h3, h4, h5, h6`).parentElement?.querySelector(`[id*="${targetId}"]`) ||
                           Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(el => 
                             el.textContent?.trim() === targetId || 
                             el.textContent?.trim() === decodeURIComponent(targetId)
                           )
        
        console.log('Target element found:', targetElement)
        
        if (targetElement) {
          // Smooth scroll to target with offset for fixed header
          // Get the actual header height from CSS variables based on screen size
          let headerHeightVar = '--header-height'
          if (window.innerWidth <= 559) {
            headerHeightVar = '--header-height-s'
          } else if (window.innerWidth <= 720) {
            headerHeightVar = '--header-height-m'
          }
          
          const headerHeight = getComputedStyle(document.documentElement).getPropertyValue(headerHeightVar) || '6rem'
          const offset = parseFloat(headerHeight) * 16 + 32 // Convert rem to px and add padding (32px = 2rem)
          
          const targetPosition = targetElement.offsetTop - offset
          
          // Ensure scroll position is valid
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const finalPosition = Math.max(0, Math.min(targetPosition, maxScroll))
          
          window.scrollTo({
            top: finalPosition,
            behavior: 'smooth'
          })
          
          // Update URL hash without triggering default behavior
          if (history.replaceState) {
            history.replaceState(null, '', target.hash)
          }
          
          // Add temporary focus indicator
          target.style.opacity = '1'
          target.style.fontWeight = 'bold'
          
          // Also highlight the target heading briefly
          setTimeout(() => {
            if (targetElement) {
              targetElement.style.backgroundColor = 'rgba(66, 153, 225, 0.1)'
              targetElement.style.borderRadius = '4px'
              targetElement.style.transition = 'background-color 0.3s ease'
              
              setTimeout(() => {
                targetElement.style.backgroundColor = ''
                setTimeout(() => {
                  targetElement.style.borderRadius = ''
                  targetElement.style.transition = ''
                }, 300)
              }, 1000)
            }
          }, 100)
          
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