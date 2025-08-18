'use client'

import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faListUl, faLink } from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface TocProps {
  toc: string
  isOutside: boolean
}

const Toc = (props: TocProps) => {
  const { toc, isOutside } = props
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tocRef.current) return

    console.log(
      '🔗 TOC Event Binding: Setting up click handlers for TOC content'
    )

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
          decodedTargetId: targetId,
        })

        // Log all heading elements with their IDs for debugging
        const allHeadings = Array.from(
          document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        )
        console.log(
          '📋 Available Headings:',
          allHeadings.map(h => ({
            tag: h.tagName.toLowerCase(),
            id: h.id,
            text: h.textContent?.trim().substring(0, 30),
          }))
        )

        // Enhanced multi-strategy target search
        const targetElement =
          // Strategy 1: Direct ID match (exact)
          document.getElementById(targetId) ||
          document.getElementById(rawTargetId) ||
          // Strategy 2: Attribute selector (handles special characters)
          document.querySelector(`[id="${targetId}"]`) ||
          document.querySelector(`[id="${rawTargetId}"]`) ||
          // Strategy 3: Partial ID match (for complex IDs)
          document.querySelector(
            `[id*="${targetId.replace(/[^a-zA-Z0-9가-힣]/g, '')}"]`
          ) ||
          // Strategy 4: Text content match (Korean-friendly)
          Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(
            el => {
              const elText = el.textContent?.trim() || ''
              const cleanTargetId = targetId.replace(/[-_]/g, ' ').trim()
              const cleanElText = elText.replace(/[-_]/g, ' ').trim()

              return (
                elText === targetId ||
                elText === decodeURIComponent(targetId) ||
                cleanElText === cleanTargetId ||
                elText.includes(targetId) ||
                targetId.includes(elText)
              )
            }
          ) ||
          // Strategy 5: Fuzzy text match (for headings with numbers/symbols)
          Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(
            el => {
              const elText = (el.textContent?.trim() || '').replace(
                /^\d+\.\s*/,
                ''
              ) // Remove leading numbers
              const cleanTargetId = targetId.replace(/^\d+-/, '') // Remove leading numbers from ID

              return (
                elText.toLowerCase().includes(cleanTargetId.toLowerCase()) ||
                cleanTargetId.toLowerCase().includes(elText.toLowerCase())
              )
            }
          )

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
            textMatch: !!Array.from(
              document.querySelectorAll('h1, h2, h3, h4, h5, h6')
            ).find(el => el.textContent?.trim() === targetId),
          },
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

          const headerHeight =
            getComputedStyle(document.documentElement).getPropertyValue(
              headerHeightVar
            ) || '6rem'
          const offset = parseFloat(headerHeight) * 16 + 24 // Convert rem to px and add small padding

          const targetPosition =
            (targetElement as HTMLElement).offsetTop - offset

          // Ensure scroll position is valid
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight
          const finalPosition = Math.max(0, Math.min(targetPosition, maxScroll))

          console.log('📏 Scroll Details:', {
            headerHeight,
            offset,
            targetPosition,
            finalPosition,
            currentScroll: window.pageYOffset,
          })

          window.scrollTo({
            top: finalPosition,
            behavior: 'smooth',
          })

          // Update URL hash without triggering default behavior
          if (history.replaceState) {
            history.replaceState(null, '', target.hash)
          }

          // Remove active class from all TOC links
          const allTocLinks = tocRef.current?.querySelectorAll('a') || []
          allTocLinks.forEach(link => {
            link.classList.remove('toc-active')
            link.style.opacity = ''
            link.style.fontWeight = ''
          })

          // Add persistent active state to clicked link
          target.classList.add('toc-active')
          target.style.opacity = '1'
          target.style.fontWeight = 'bold'
          target.style.color = 'var(--primary)'

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
    <Card
      className={cn(
        'toc-container font-nanum-gothic transition-all duration-300',
        isOutside
          ? cn(
              'fixed right-2 z-[999] min-w-[280px] max-w-[300px]', // Positioned below header (56px) + ReadingProgress (48px) = ~104px
              'bg-card/95 border-border/50 backdrop-blur-sm',
              'opacity-40 shadow-lg hover:opacity-95',
              'max-h-[calc(100vh-8rem)] overflow-hidden', // Adjusted for header + reading progress positioning
              'hidden lg:block' // Hidden on screens smaller than 1024px
            )
          : cn('bg-secondary/30 border-border/30', 'max-w-full')
      )}
      data-testid={isOutside ? 'toc-outside' : 'toc-inside'}
    >
      {isOutside && (
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center gap-2">
            <Fa icon={faListUl} className="text-sm text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Table of Contents
            </span>
          </div>
          <Separator className="mt-2" />
        </CardHeader>
      )}

      <CardContent
        className={cn(
          'p-3',
          isOutside &&
            'scrollbar-thin max-h-[calc(100vh-12rem)] overflow-y-auto', // Adjusted for header + reading progress + TOC header
          '[&::-webkit-scrollbar]:w-1',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-border',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-border/80'
        )}
      >
        <div
          ref={tocRef}
          className={cn(
            'toc-content text-sm',
            '[&_ul]:ml-4 [&_ul]:list-none [&_ul]:space-y-1',
            '[&_li]:leading-relaxed',
            '[&_p]:mb-0',
            '[&_a]:text-muted-foreground [&_a]:no-underline',
            '[&_a]:block [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1',
            '[&_a]:opacity-60 [&_a]:transition-all [&_a]:duration-200',
            '[&_a]:hover:bg-secondary/50 [&_a]:hover:opacity-100',
            '[&_a]:focus:bg-secondary [&_a]:focus:opacity-100',
            '[&_a]:focus:ring-primary/20 [&_a]:focus:ring-2',
            '[&_a.active]:bg-primary/10 [&_a.active]:opacity-100',
            '[&_a.active]:font-medium [&_a.active]:text-primary',
            '[&_a]:max-w-full [&_a]:truncate',
            '[&_img]:hidden' // Hide any images in TOC
          )}
          data-testid="table-of-contents"
          dangerouslySetInnerHTML={{ __html: toc }}
        />

        {isOutside && (
          <div className="border-border/30 mt-3 border-t pt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Fa icon={faLink} className="text-xs" />
              <span>클릭하여 이동</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Toc
