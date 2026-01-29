'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faTags,
  faSearch,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  useMobileOptimization,
  useMobilePerformance,
} from '@/hooks/useDeviceType'

interface MobileBottomNavProps {
  className?: string
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const pathname = usePathname()
  const { mobileOnly } = useMobileOptimization()
  const { getOptimizedProps } = useMobilePerformance()

  // Handle scroll behavior - hide/show navigation with mobile optimization
  useEffect(() => {
    const optimizedProps = getOptimizedProps()

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY
      const isNearTop = currentScrollY < 100

      // Show scroll to top button when scrolled down significantly
      setShowScrollTop(currentScrollY > 300)

      // Auto-hide navigation when scrolling down, show when scrolling up or near top
      if (isNearTop) {
        setIsVisible(true)
      } else {
        setIsVisible(!isScrollingDown || currentScrollY < lastScrollY)
      }

      setLastScrollY(currentScrollY)
    }

    // Throttle scroll events for better performance - optimized delay for mobile
    let timeoutId: NodeJS.Timeout
    const throttleDelay = optimizedProps.reducedMotion ? 20 : 16 // ~50fps on mobile, ~60fps on desktop

    const throttledHandleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, throttleDelay)
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      clearTimeout(timeoutId)
    }
  }, [lastScrollY, getOptimizedProps])

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Check if path is active
  const isActive = (path: string) => {
    if (!pathname) return false
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  // Use mobile optimization hook for conditional rendering
  return mobileOnly(
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
        'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-md',
        'border-border/40 border-t',
        'safe-bottom', // Handle iOS safe area
        'transform transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        className
      )}
      role="navigation"
      aria-label="모바일 하단 네비게이션"
    >
      <div className="mx-auto max-w-md px-4 py-2">
        <div className="flex items-center justify-around">
          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              'group flex flex-col items-center justify-center gap-1',
              'h-16 w-16 rounded-xl transition-all duration-200',
              'hover:bg-accent/50 active:scale-95',
              'min-h-[56px] min-w-[56px]', // Enhanced touch target
              isActive('/') && [
                'bg-primary/10 text-primary',
                'border-primary/20 border shadow-sm',
              ]
            )}
          >
            <Link href="/" aria-label="홈으로 이동">
              <Fa
                icon={faHome}
                className={cn(
                  'text-base transition-all duration-200',
                  'group-hover:scale-110',
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                홈
              </span>
            </Link>
          </Button>

          {/* Tags Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              'group flex flex-col items-center justify-center gap-1',
              'h-16 w-16 rounded-xl transition-all duration-200',
              'hover:bg-accent/50 active:scale-95',
              'min-h-[56px] min-w-[56px]', // Enhanced touch target
              isActive('/tags') && [
                'bg-primary/10 text-primary',
                'border-primary/20 border shadow-sm',
              ]
            )}
          >
            <Link href="/tags" aria-label="태그 페이지로 이동">
              <Fa
                icon={faTags}
                className={cn(
                  'text-base transition-all duration-200',
                  'group-hover:scale-110',
                  isActive('/tags') ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive('/tags') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                태그
              </span>
            </Link>
          </Button>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              'group flex flex-col items-center justify-center gap-1',
              'h-16 w-16 rounded-xl transition-all duration-200',
              'hover:bg-accent/50 active:scale-95',
              'min-h-[56px] min-w-[56px]', // Enhanced touch target
              isActive('/search') && [
                'bg-primary/10 text-primary',
                'border-primary/20 border shadow-sm',
              ]
            )}
          >
            <Link href="/search" aria-label="검색 페이지로 이동">
              <Fa
                icon={faSearch}
                className={cn(
                  'text-base transition-all duration-200',
                  'group-hover:scale-110',
                  isActive('/search') ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive('/search') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                검색
              </span>
            </Link>
          </Button>

          {/* Scroll to Top Button - Only visible when scrolled */}
          {showScrollTop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className={cn(
                'group flex flex-col items-center justify-center gap-1',
                'h-16 w-16 rounded-xl transition-all duration-200',
                'hover:bg-accent/50 active:scale-95',
                'min-h-[56px] min-w-[56px]', // Enhanced touch target
                'duration-200 animate-in fade-in slide-in-from-bottom-2'
              )}
              aria-label="페이지 맨 위로 이동"
            >
              <Fa
                icon={faArrowUp}
                className={cn(
                  'text-base transition-all duration-200',
                  'group-hover:scale-110',
                  'text-muted-foreground'
                )}
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-muted-foreground">
                맨위로
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* iOS Safe Area Bottom Padding */}
      <div className="h-safe-bottom bg-background/95" />
    </nav>
  )
}

export default MobileBottomNav
