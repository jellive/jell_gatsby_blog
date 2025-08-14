'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faHome } from '@fortawesome/free-solid-svg-icons'

interface BackNavigationProps {
  category?: string
  title?: string
}

export default function BackNavigation({ category, title }: BackNavigationProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const getCategoryDisplayName = (cat?: string) => {
    if (!cat) return null
    
    const categoryNames: Record<string, string> = {
      'bicycle': '🚲 Bicycle',
      'chat': '💬 Chat',
      'dev': '💻 Development',
      'game': '🎮 Game',
      'notice': '📢 Notice'
    }
    
    return categoryNames[cat.toLowerCase()] || `📁 ${cat}`
  }

  return (
    <nav className="back-navigation" role="navigation" aria-label="Breadcrumb">
      <div className="back-nav-container">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="back-button"
          aria-label="뒤로 가기"
          title="뒤로 가기"
        >
          <Fa icon={faAngleLeft} />
          <span>Back</span>
        </button>
        
        {/* Breadcrumb */}
        <div className="breadcrumb" role="navigation" aria-label="Breadcrumb">
          <Link href="/" className="breadcrumb-item home">
            <Fa icon={faHome} />
            <span>Home</span>
          </Link>
          
          {category && (
            <>
              <span className="breadcrumb-separator">›</span>
              <Link 
                href={`/tags/${encodeURIComponent(category)}`}
                className="breadcrumb-item category"
              >
                <span>{getCategoryDisplayName(category)}</span>
              </Link>
            </>
          )}
          
          {title && (
            <>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item current" aria-current="page">
                <span className="post-title">{title}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}