'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
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
  const { isMobile } = useDeviceType()

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

      setIsHide(window.pageYOffset > 50)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    <header
      id="Header"
      role="banner"
      className={`${isHide ? 'hide' : 'show'} ${isMobile ? 'mobile' : ''}`}
      aria-label="사이트 헤더 및 주 네비게이션"
    >
      <div className="header-inner">
        {/* Logo: [jell.] */}
        <Link
          href="/"
          className="header-logo"
          aria-label={`${siteTitle} 홈페이지로 이동`}
        >
          <span className="logo-bracket">[</span>
          <span className="logo-name">jell</span>
          <span className="logo-dot">.</span>
          <span className="logo-bracket">]</span>
        </Link>

        {/* Navigation */}
        <nav
          className="header-nav"
          role="navigation"
          aria-label="주요 네비게이션"
        >
          <button
            onClick={() => router.push('/tags')}
            className="nav-item"
            aria-label="태그 페이지로 이동"
          >
            <span className="nav-label">TAGS</span>
          </button>

          <button
            onClick={openPalette}
            className="nav-item"
            aria-label="검색하기 (Cmd+K)"
          >
            <span className="nav-label">SEARCH</span>
            <kbd className="nav-kbd">⌘K</kbd>
          </button>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

export default Header
