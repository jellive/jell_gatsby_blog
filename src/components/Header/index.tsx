'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faTags, faSearch } from '@fortawesome/free-solid-svg-icons'
import { siteConfig } from '@/lib/config'

export interface HeaderProps {
  siteTitle: string
}

const Header: React.FC<HeaderProps> = ({ siteTitle }) => {
  const [yPos, setYPos] = useState(0)
  const [isHide, setIsHide] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [profileSize, setProfileSize] = useState('25px')
  const pathname = usePathname()

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
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent))
    }
    
    checkMobile()

    // Handle profile image sizing based on route
    const updateProfileSize = () => {
      setProfileSize(pathname === '/' ? '50px' : '25px')
    }
    
    updateProfileSize()

    // Scroll listener for header hide/show
    const handleScroll = () => {
      setYPos((prevYPos) => {
        const currentYPos = window.pageYOffset
        setIsHide(prevYPos < currentYPos)
        return currentYPos
      })
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
    <header id="Header" className={`${isHide ? 'hide' : 'show'} ${isMobile ? 'mobile' : ''}`}>
      <div className="header-title">
        <Link href="/">
          <div className="header-profile-image-wrap">
            <img
              src="https://avatars.githubusercontent.com/u/7909227?v=4"
              alt="title profile picture"
              width={profileSize}
              height={profileSize}
            />
          </div>
        </Link>

        <Link href="/">
          <h1 className="header-title-text">{siteTitle}</h1>
        </Link>
      </div>

      <nav id="nav">
        <ul>
          <li>
            <div className="tag-wrap">
              <span>TAG</span>
              <Link href="/tags">
                <Fa
                  icon={faTags}
                  onMouseEnter={() => {
                    tagSpanVisibleToggle(true)
                  }}
                  onMouseLeave={() => {
                    tagSpanVisibleToggle(false)
                  }}
                />
              </Link>
            </div>
          </li>

          <li>
            <div className="search-wrap">
              <Link href="/search" className="search">
                <Fa icon={faSearch} />
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header