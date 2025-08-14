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

    console.log('🔗 TOC Event Binding: Setting up click handlers for TOC content')

    const handleTocClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement
      
      // Only handle anchor links within TOC
      if (target && target.tagName === 'A' && target.hash) {
        e.preventDefault()
        
        // Decode URL-encoded hash (Korean text gets encoded)
        const rawTargetId = target.hash.slice(1)
        const targetId = decodeURIComponent(rawTargetId)
        
        // Debug: Log click event details
        console.log('🔍 TOC Click Debug:', {
          clickedLink: target.textContent?.trim(),
          rawHash: target.hash,
          rawTargetId,
          decodedTargetId: targetId
        })
        
        // Log all heading elements with their IDs for debugging
        const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        console.log('📋 Available Headings:', allHeadings.map(h => ({
          tag: h.tagName.toLowerCase(),
          id: h.id,
          text: h.textContent?.trim().substring(0, 30)
        })))
        
        // Enhanced multi-strategy target search
        let targetElement = 
          // Strategy 1: Direct ID match (exact)
          document.getElementById(targetId) || 
          document.getElementById(rawTargetId) ||
          
          // Strategy 2: Attribute selector (handles special characters)
          document.querySelector(`[id="${targetId}"]`) ||
          document.querySelector(`[id="${rawTargetId}"]`) ||
          
          // Strategy 3: Partial ID match (for complex IDs)
          document.querySelector(`[id*="${targetId.replace(/[^a-zA-Z0-9가-힣]/g, '')}"]`) ||
          
          // Strategy 4: Text content match (Korean-friendly)
          Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(el => {
            const elText = el.textContent?.trim() || ''
            const cleanTargetId = targetId.replace(/[-_]/g, ' ').trim()
            const cleanElText = elText.replace(/[-_]/g, ' ').trim()
            
            return elText === targetId || 
                   elText === decodeURIComponent(targetId) ||
                   cleanElText === cleanTargetId ||
                   elText.includes(targetId) ||
                   targetId.includes(elText)
          }) ||
          
          // Strategy 5: Fuzzy text match (for headings with numbers/symbols)
          Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(el => {
            const elText = (el.textContent?.trim() || '').replace(/^\d+\.\s*/, '') // Remove leading numbers
            const cleanTargetId = targetId.replace(/^\d+-/, '') // Remove leading numbers from ID
            
            return elText.toLowerCase().includes(cleanTargetId.toLowerCase()) ||
                   cleanTargetId.toLowerCase().includes(elText.toLowerCase())
          })
        
        // Debug: Log target element search result with more detail
        console.log('🎯 Target Element Search Result:', {
          foundElement: !!targetElement,
          elementType: targetElement?.tagName,
          elementText: targetElement?.textContent?.trim(),
          elementId: targetElement?.id,
          searchStrategies: {
            directId: !!document.getElementById(targetId),
            rawId: !!document.getElementById(rawTargetId),
            querySelector: !!document.querySelector(`[id="${targetId}"]`),
            textMatch: !!Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(el => 
              el.textContent?.trim() === targetId
            )
          }
        })
        
        if (targetElement) {
          console.log('✅ TOC Scroll: Target found, initiating scroll')
          
          // Smooth scroll to target with proper offset calculation
          // Get the actual header height from CSS variables based on screen size
          let headerHeightVar = '--header-height'
          if (window.innerWidth <= 559) {
            headerHeightVar = '--header-height-s'
          } else if (window.innerWidth <= 720) {
            headerHeightVar = '--header-height-m'
          }
          
          const headerHeight = getComputedStyle(document.documentElement).getPropertyValue(headerHeightVar) || '6rem'
          const offset = parseFloat(headerHeight) * 16 + 24 // Convert rem to px and add small padding
          
          const targetPosition = (targetElement as HTMLElement).offsetTop - offset
          
          // Ensure scroll position is valid
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const finalPosition = Math.max(0, Math.min(targetPosition, maxScroll))
          
          console.log('📏 Scroll Details:', {
            headerHeight,
            offset,
            targetPosition,
            finalPosition,
            currentScroll: window.pageYOffset
          })
          
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
              const htmlTarget = targetElement as HTMLElement
              htmlTarget.style.backgroundColor = 'rgba(66, 153, 225, 0.1)'
              htmlTarget.style.borderRadius = '4px'
              htmlTarget.style.transition = 'background-color 0.3s ease'
              
              setTimeout(() => {
                htmlTarget.style.backgroundColor = ''
                setTimeout(() => {
                  htmlTarget.style.borderRadius = ''
                  htmlTarget.style.transition = ''
                }, 300)
              }, 1000)
            }
          }, 100)
          
          setTimeout(() => {
            target.style.opacity = ''
            target.style.fontWeight = ''
          }, 1500)
        } else {
          console.error('❌ TOC Scroll: No target element found for:', targetId)
        }
      }
    }

    // Add event listener to TOC container with enhanced binding
    const tocContainer = tocRef.current
    tocContainer.addEventListener('click', handleTocClick)
    
    // Also ensure all anchor elements are properly accessible
    const tocLinks = tocContainer.querySelectorAll('a[href^="#"]')
    console.log('🔗 TOC Links Found:', tocLinks.length)
    
    return () => {
      if (tocContainer) {
        tocContainer.removeEventListener('click', handleTocClick)
      }
    }
  }, [toc]) // React to TOC content changes

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