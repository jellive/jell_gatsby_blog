import * as React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faTags, faSearch } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import MobileDetect from 'mobile-detect'
import Image from 'next/image'
import profileImage from '@/assets/images/profile.jpeg'

import './header.scss'
const config = require('../../../config')

export interface headerPropsType {
  siteTitle: string
  path: string
  setPath: (path: string, size?: string) => void
  size: string
}

const Header = ({ siteTitle, path, setPath, size }: headerPropsType) => {
  const [, setYPos] = useState(0)
  const [isHide, setIsHide] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
      setIsMobile(true)
    }

    const profile: HTMLImageElement | null = document.querySelector('.header-profile-image-wrap>img')

    const prevPath = path
    const currPath = location.pathname

    if (profile) {
      if (currPath === prevPath) {
        setPath(location.pathname, currPath !== '/' ? '25px' : '50px')
      }

      if (prevPath !== '/' && currPath === '/') {
        setPath(location.pathname, '50px')
      }

      if (prevPath === '/' && currPath !== '/') {
        setPath(location.pathname, '25px')
      }

      if (prevPath !== '/' && currPath !== '/') {
        setPath(location.pathname)
      }
    } else {
      setPath(location.pathname)
    }

    const setVisible = () => {
      setYPos((prevYPos) => {
        const currentYPos = window.pageYOffset

        setIsHide(prevYPos < currentYPos)

        return currentYPos
      })
    }
    document.addEventListener('scroll', setVisible)
    return () => document.removeEventListener('scroll', setVisible)
  }, [])

  const tagSpanVisibleToggle = (isVisible: boolean) => {
    const tag: HTMLSpanElement | null = document.querySelector('.tag-wrap>span')

    if (tag && isVisible) tag.style.opacity = '1'
    if (tag && !isVisible) tag.style.opacity = '0'
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <header id="Header" className={`${isHide ? 'hide' : 'show'} ${isMobile ? 'mobile' : ''}`}>
      {/* Google adsense auto */}
      {!isDevelopment && (
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5518615618879832"
          crossOrigin="anonymous"
        ></script>
      )}
      {/* Google adsense auto end*/}

      <div className="header-title">
        <Link href="/">
          <div className="header-profile-image-wrap">
            <Image
              src={profileImage}
              alt="Profile"
              width={path === '/' ? 50 : 25}
              height={path === '/' ? 50 : 25}
              className="rounded-full"
              priority
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

const mapStateToProps = ({ path, size }: { path: string; size: string }) => {
  return { path, size }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPath: (path: string, size: string) => dispatch({ type: `SET_PATH`, path, size })
  }
}

export default Header
