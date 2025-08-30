'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faTags,
  faSearch,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
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

export interface HeaderProps {
  siteTitle: string
}

const Header: React.FC<HeaderProps> = ({ siteTitle }) => {
  const [isHide, setIsHide] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { openPalette } = useCommandPalette()

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

  // Initialize mobile detection and scroll listener
  useEffect(() => {
    // Mobile detection (simple version without external library)
    const checkMobile = () => {
      const userAgent = window.navigator.userAgent
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent))
    }

    checkMobile()

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

  // Tag hover effect handlers
  const tagSpanVisibleToggle = (isVisible: boolean) => {
    const tag: HTMLSpanElement | null = document.querySelector('.tag-wrap>span')
    if (tag && isVisible) {
      tag.style.opacity = '1'
      tag.style.visibility = 'visible'
    }
    if (tag && !isVisible) {
      tag.style.opacity = '0'
      tag.style.visibility = 'hidden'
    }
  }

  return (
    <TooltipProvider>
      <header
        id="Header"
        role="banner"
        className={`${isHide ? 'hide' : 'show'} ${isMobile ? 'mobile' : ''} relative`}
        aria-label="사이트 헤더 및 주 네비게이션"
      >
        <div className="header-title">
          <Link
            href="/"
            aria-label={`${siteTitle} 홈페이지로 이동`}
            className="flex items-center"
          >
            <div className="header-profile-image-wrap">
              <img
                src="https://avatars.githubusercontent.com/u/7909227?v=4"
                alt="Jell의 프로필 이미지"
                width="48"
                height="48"
                className="rounded-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </Link>

          <Link href="/" aria-label={`${siteTitle} 사이트 홈으로 이동`}>
            <h1 className="header-title-text">{siteTitle}</h1>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'group relative flex h-12 w-12 items-center justify-center',
              'border-border/30 rounded-md border',
              'hover:border-border/60 hover:scale-105',
              'active:scale-95',
              'transition-all duration-200',
              'hover:bg-accent/10 bg-transparent',
              // Responsive sizing for mobile
              'max-md:h-11 max-md:w-11 max-sm:h-10 max-sm:w-10'
            )}
            aria-label={
              mobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            data-testid="mobile-menu-toggle"
          >
            <Fa
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-lg transition-all duration-200"
              aria-hidden="true"
            />
            <span className="sr-only">
              {mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            </span>
          </Button>
        </div>

        <nav
          id="nav"
          className="hidden md:block"
          role="navigation"
          aria-label="주요 네비게이션"
        >
          <ul className="flex items-center justify-center gap-2" role="list">
            <li className="flex items-center justify-center">
              <div className="tag-wrap flex items-center justify-center">
                <span className="sr-only">TAG</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push('/tags')}
                      className={cn(
                        'group relative flex h-12 w-12 items-center justify-center',
                        'border-border/30 rounded-md border',
                        'hover:border-border/60 hover:scale-105',
                        'active:scale-95',
                        'transition-all duration-200',
                        'hover:bg-accent/10 bg-transparent'
                      )}
                      onMouseEnter={() => {
                        tagSpanVisibleToggle(true)
                      }}
                      onMouseLeave={() => {
                        tagSpanVisibleToggle(false)
                      }}
                      aria-label="태그 페이지로 이동"
                      title="모든 태그 보기"
                    >
                      <Fa
                        icon={faTags}
                        className={cn(
                          'text-lg transition-all duration-200',
                          'group-hover:scale-110',
                          'text-green-500 dark:text-green-400',
                          'group-hover:text-green-600 dark:group-hover:text-green-300',
                          'group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                        )}
                        aria-hidden="true"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>모든 태그 보기</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>

            <li className="flex items-center justify-center">
              <div className="search-wrap flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={openPalette}
                      className={cn(
                        'group relative flex h-12 w-12 items-center justify-center',
                        'border-border/30 rounded-md border',
                        'hover:border-border/60 hover:scale-105',
                        'active:scale-95',
                        'transition-all duration-200',
                        'hover:bg-accent/10 bg-transparent'
                      )}
                      aria-label="검색하기 (Cmd+K)"
                    >
                      <Fa
                        icon={faSearch}
                        className={cn(
                          'text-lg transition-all duration-200',
                          'group-hover:scale-110',
                          'text-purple-500 dark:text-purple-400',
                          'group-hover:text-purple-600 dark:group-hover:text-purple-300',
                          'group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                        )}
                        aria-hidden="true"
                      />
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
              </div>
            </li>

            <li className="flex items-center justify-center">
              <div className="theme-wrap flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center">
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>테마 변경 (라이트 → 다크 → 시스템)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={cn(
              'absolute left-0 right-0 top-full z-50 md:hidden',
              'bg-background/95 border-b border-border backdrop-blur-sm',
              'shadow-lg'
            )}
            data-testid="mobile-menu"
          >
            <div className="space-y-4 p-4">
              <Button
                variant="ghost"
                onClick={() => {
                  router.push('/tags')
                  setMobileMenuOpen(false)
                }}
                className="w-full justify-start gap-2"
              >
                <Fa
                  icon={faTags}
                  className="text-green-500"
                  aria-hidden="true"
                />
                <span>Tags</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  openPalette()
                  setMobileMenuOpen(false)
                }}
                className="w-full justify-start gap-2"
              >
                <Fa
                  icon={faSearch}
                  className="text-purple-500"
                  aria-hidden="true"
                />
                <span>Search</span>
              </Button>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </header>
    </TooltipProvider>
  )
}

export default Header
