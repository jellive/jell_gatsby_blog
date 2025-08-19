'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faHome } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BackNavigationProps {
  category?: string
  title?: string
}

export default function BackNavigation({
  category,
  title,
}: BackNavigationProps) {
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
      bicycle: '🚲 Bicycle',
      chat: '💬 Chat',
      dev: '💻 Development',
      game: '🎮 Game',
      notice: '📢 Notice',
    }

    return categoryNames[cat.toLowerCase()] || `📁 ${cat}`
  }

  return (
    <nav
      className={cn(
        'back-navigation sticky top-0 z-40',
        'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur',
        'border-border/40 border-b',
        'px-4 py-3 max-md:px-3 max-md:py-2'
      )}
      role="navigation"
      aria-label="Navigation"
    >
      <div
        className={cn(
          'back-nav-container mx-auto max-w-4xl',
          'flex items-center justify-between gap-4',
          'max-md:flex-col max-md:items-start max-md:gap-2'
        )}
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className={cn(
            'back-button gap-2 text-muted-foreground hover:text-foreground',
            'hover:bg-accent/50 transition-all duration-200',
            'max-md:self-start'
          )}
          aria-label="뒤로 가기"
          title="뒤로 가기"
          data-testid="back-navigation"
        >
          <Fa icon={faAngleLeft} className="text-sm" />
          <span className="font-medium">Back</span>
        </Button>

        {/* Breadcrumb */}
        <div
          className={cn(
            'breadcrumb flex items-center gap-2 text-sm',
            'max-md:w-full max-md:overflow-hidden'
          )}
          role="navigation"
          aria-label="Breadcrumb"
        >
          <Button
            variant="link"
            size="sm"
            asChild
            className={cn(
              'breadcrumb-item home h-auto gap-1.5 px-0',
              'text-muted-foreground hover:text-primary'
            )}
          >
            <Link href="/">
              <Fa icon={faHome} className="text-sm" />
              <span className="font-medium">Home</span>
            </Link>
          </Button>

          {category && (
            <>
              <span className="breadcrumb-separator text-muted-foreground/60 font-medium">
                ›
              </span>
              <Button
                variant="link"
                size="sm"
                asChild
                className={cn(
                  'breadcrumb-item category h-auto px-0',
                  'text-muted-foreground hover:text-primary',
                  'max-md:max-w-[120px] max-md:truncate'
                )}
              >
                <Link href={`/tags/${encodeURIComponent(category)}`}>
                  <span className="font-medium">
                    {getCategoryDisplayName(category)}
                  </span>
                </Link>
              </Button>
            </>
          )}

          {title && (
            <>
              <span className="breadcrumb-separator text-muted-foreground/60 font-medium">
                ›
              </span>
              <span
                className={cn(
                  'breadcrumb-item current font-medium text-foreground',
                  'max-md:max-w-[150px] max-md:truncate'
                )}
                aria-current="page"
              >
                <span className="post-title">{title}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
