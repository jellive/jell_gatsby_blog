import * as React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faTags, faSearch } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import profileImage from '@/assets/images/profile.jpeg'
import { useRouter } from 'next/router'
import { useHeaderStore } from '@/store'
import './header.scss'

const config = require('../../../config')

const Header = () => {
  const router = useRouter()
  const [isHide] = useState(false)
  const { size, setPath } = useHeaderStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/') {
        setPath(url, '50px')
      } else {
        setPath(url, '25px')
      }
    }

    // 초기 경로 설정
    handleRouteChange(router.pathname)

    // 경로 변경 감지
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router, setPath])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header id="Header" className={isHide ? 'hide' : 'show'}>
      <div className="header-title">
        <Link href="/">
          <div className="header-profile-image-wrap">
            <Image
              src={profileImage}
              alt="Profile"
              width={parseInt(size)}
              height={parseInt(size)}
              className="profile-image"
              priority
              {...(mounted ? { style: { color: 'transparent' } } : {})}
            />
          </div>
        </Link>
        <Link href="/">
          <h1 className="header-title-text">{config.title}</h1>
        </Link>
      </div>

      <nav id="nav">
        <ul>
          <li>
            <div className="tag-wrap">
              <span>TAG</span>
              <Link href="/tags">
                <Fa icon={faTags} />
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
