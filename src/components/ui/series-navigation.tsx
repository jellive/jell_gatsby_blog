'use client'

import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faList,
  faChevronLeft,
  faChevronRight,
  faBookOpen,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SeriesPost {
  slug: string
  title: string
  date: string
  isCurrentPost?: boolean
}

interface SeriesNavigationProps {
  seriesTitle: string
  posts: SeriesPost[]
  currentPostSlug: string
  className?: string
  variant?: 'full' | 'compact' | 'minimal'
  showProgress?: boolean
}

/**
 * Series navigation component for blog post series
 * Provides navigation between posts in a series with progress indication
 */
export function SeriesNavigation({
  seriesTitle,
  posts,
  currentPostSlug,
  className,
  variant = 'full',
  showProgress = true,
}: SeriesNavigationProps) {
  const currentIndex = posts.findIndex(post => post.slug === currentPostSlug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  const progress = ((currentIndex + 1) / posts.length) * 100

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-between gap-4', className)}>
        {prevPost ? (
          <Link href={`/posts/${prevPost.slug}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Fa icon={faChevronLeft} className="text-xs" />
              이전
            </Button>
          </Link>
        ) : (
          <div />
        )}

        <Badge variant="secondary" className="text-xs">
          {currentIndex + 1} / {posts.length}
        </Badge>

        {nextPost ? (
          <Link href={`/posts/${nextPost.slug}`}>
            <Button variant="outline" size="sm" className="gap-2">
              다음
              <Fa icon={faChevronRight} className="text-xs" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'border-border/50 bg-card/30 backdrop-blur-sm',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fa icon={faBookOpen} className="text-sm text-primary" />
              <span className="text-sm font-medium">{seriesTitle}</span>
              <Badge variant="secondary" className="text-xs">
                {currentIndex + 1}/{posts.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {prevPost && (
                <Link href={`/posts/${prevPost.slug}`}>
                  <Button variant="ghost" size="sm" title={prevPost.title}>
                    <Fa icon={faChevronLeft} className="text-xs" />
                  </Button>
                </Link>
              )}

              {nextPost && (
                <Link href={`/posts/${nextPost.slug}`}>
                  <Button variant="ghost" size="sm" title={nextPost.title}>
                    <Fa icon={faChevronRight} className="text-xs" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {showProgress && (
            <div className="mt-3">
              <div className="bg-secondary/30 h-1.5 w-full rounded-full">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Full variant
  return (
    <Card
      className={cn(
        'border-border/50 bg-card/30 backdrop-blur-sm',
        'transition-all duration-300 hover:border-border',
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Fa icon={faBookOpen} className="text-lg text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-foreground">
              {seriesTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fa icon={faList} className="text-xs" />
              <span>총 {posts.length}편의 시리즈</span>
              {showProgress && (
                <>
                  <span>·</span>
                  <span>{Math.round(progress)}% 완료</span>
                </>
              )}
            </div>
          </div>
        </div>

        {showProgress && (
          <div className="mt-4">
            <div className="bg-secondary/30 h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Series Posts List */}
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Fa icon={faMapMarkerAlt} className="text-xs text-primary" />
            시리즈 목록
          </h4>

          <div className="max-h-40 space-y-1 overflow-y-auto">
            {posts.map((post, index) => (
              <div
                key={post.slug}
                className={cn(
                  'flex items-center gap-3 rounded-md p-2 transition-all duration-200',
                  post.slug === currentPostSlug
                    ? 'bg-primary/10 border-primary/20 border'
                    : 'hover:bg-secondary/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                    post.slug === currentPostSlug
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground'
                  )}
                >
                  {index + 1}
                </div>

                {post.slug === currentPostSlug ? (
                  <span className="line-clamp-1 text-sm font-medium text-foreground">
                    {post.title}
                  </span>
                ) : (
                  <Link
                    href={`/posts/${post.slug}`}
                    className="line-clamp-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {post.title}
                  </Link>
                )}

                {post.slug === currentPostSlug && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    현재
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          {prevPost ? (
            <Link href={`/posts/${prevPost.slug}`} className="flex-1">
              <Button
                variant="outline"
                className="h-auto w-full justify-start gap-2 p-3"
              >
                <Fa icon={faChevronLeft} className="text-sm" />
                <div className="min-w-0 text-left">
                  <div className="text-xs text-muted-foreground">이전 글</div>
                  <div className="truncate text-sm font-medium">
                    {prevPost.title}
                  </div>
                </div>
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextPost ? (
            <Link href={`/posts/${nextPost.slug}`} className="flex-1">
              <Button
                variant="outline"
                className="h-auto w-full justify-end gap-2 p-3"
              >
                <div className="min-w-0 text-right">
                  <div className="text-xs text-muted-foreground">다음 글</div>
                  <div className="truncate text-sm font-medium">
                    {nextPost.title}
                  </div>
                </div>
                <Fa icon={faChevronRight} className="text-sm" />
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { SeriesNavigation as default }
