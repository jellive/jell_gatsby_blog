'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faTags, faSearch } from '@fortawesome/free-solid-svg-icons'
import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useCommandPalette } from '@/components/CommandPalette/CommandPaletteProvider'
import { useDeviceType } from '@/hooks/useDeviceType'

export interface HeaderProps {
  siteTitle: string
}

const Header: React.FC<HeaderProps> = ({ siteTitle }) => {
  const [isHide, setIsHide] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { openPalette } = useCommandPalette()
  const { isMobile, isTablet, touchEnabled } = useDeviceType()

  // Handle bio opacity based on header visibility
  useEffect(() => {
    const bio: HTMLDivElement | null = document.querySelector('.bio')
    if (bio) {
      if (isHide === true) {
        bio.style.opacity = '0'
        bio.style.pointerEvents = 'none'
      } else {
        bio.style.opacity = '1'
        bio.style.pointerEvents = 'all'
      }
    }
  }, [isHide])

  // Initialize scroll listener (mobile detection now handled by useDeviceType hook)
  useEffect(() => {
    // Ensure header is always visible on main page
    if (pathname === '/') {
      setIsHide(false)
    }

    // Scroll listener for header hide/show (disabled on main page)
    const handleScroll = () => {
      // Don't hide header on main page
      if (pathname === '/') {
        setIsHide(false)
        return
      }

      const currentYPos = window.pageYOffset
      setIsHide(window.pageYOffset > 50)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    <TooltipProvider>
      <header
        id="Header"
        role="banner"
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-200',
          isHide ? '-translate-y-full' : 'translate-y-0',
          'border-border/50 bg-background/80 border-b backdrop-blur-lg',
          'px-4 md:px-6',
          'h-[70px] md:h-[80px]'
        )}
        aria-label="사이트 헤더 및 주 네비게이션"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label={`${siteTitle} 홈페이지로 이동`}
              className="group flex items-center gap-3"
            >
              <div className="border-border/60 group-hover:border-primary/40 relative overflow-hidden rounded-full border transition-all duration-200">
                <img
                  src="https://avatars.githubusercontent.com/u/7909227?v=4"
                  alt="Jell의 프로필 이미지"
                  width="36"
                  height="36"
                  className="h-9 w-9 object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <h1 className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary md:text-xl">
                {siteTitle}
              </h1>
            </Link>
          </div>

          <nav
            id="nav"
            className="hidden md:block"
            role="navigation"
            aria-label="주요 네비게이션"
          >
            <ul className="flex items-center gap-1" role="list">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push('/tags')}
                      className={cn(
                        'h-10 w-10 rounded-full',
                        'hover:bg-muted',
                        'transition-colors duration-200'
                      )}
                      aria-label="태그 페이지로 이동"
                    >
                      <Fa icon={faTags} className="text-lg" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>모든 태그 보기</p>
                  </TooltipContent>
                </Tooltip>
              </li>

              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={openPalette}
                      className={cn(
                        'h-10 w-10 rounded-full',
                        'hover:bg-muted',
                        'transition-colors duration-200'
                      )}
                      aria-label="검색하기 (Cmd+K)"
                    >
                      <Fa icon={faSearch} className="text-lg" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-2">
                      <span>빠른 검색</span>
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        ⌘K
                      </kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </li>

              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-muted">
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>테마 변경</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </TooltipProvider>
  )
}

export default Header
