'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface Post {
  slug: string
  frontMatter: {
    title: string
    date: string
    tags: string[]
    category?: string
  }
  excerpt?: string
}

export interface PostListProps {
  posts: Post[]
}

const PostList = (props: PostListProps) => {
  const { posts } = props
  const router = useRouter()

  // Helper function to get category-specific badge variant
  const getBadgeVariant = (
    tag: string
  ): 'default' | 'secondary' | 'outline' => {
    const lowerTag = tag.toLowerCase()

    // Development related tags
    if (
      lowerTag.includes('개발') ||
      lowerTag.includes('development') ||
      lowerTag.includes('javascript') ||
      lowerTag.includes('typescript') ||
      lowerTag.includes('js') ||
      lowerTag.includes('react') ||
      lowerTag.includes('nextjs')
    ) {
      return 'default' // Uses primary color
    }

    // Bicycle/Sports related tags
    if (
      lowerTag.includes('자전거') ||
      lowerTag.includes('bicycle') ||
      lowerTag.includes('운동') ||
      lowerTag.includes('cycling')
    ) {
      return 'secondary' // Uses secondary color
    }

    // Game related tags
    if (
      lowerTag.includes('게임') ||
      lowerTag.includes('game') ||
      lowerTag.includes('gaming')
    ) {
      return 'outline' // Uses outline style
    }

    return 'secondary' // Default fallback
  }

  // Handler for tag clicks - prevents event propagation and navigates to tag page
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/tags#${encodeURIComponent(tag)}`)
  }

  // Safe date formatting that works consistently on server and client
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      const month = months[date.getMonth()]
      const day = date.getDate().toString().padStart(2, '0')
      const year = date.getFullYear()

      return `${month} ${day}, ${year}`
    } catch (error) {
      // Fallback for invalid dates
      return dateString
    }
  }

  const mapPost = posts.map((post: Post) => {
    const { slug, frontMatter, excerpt } = post
    const { date, title, tags } = frontMatter

    // Format date like original Gatsby format (MMM DD, YYYY) - safe for SSR
    const formattedDate = formatDate(date)

    // Filter out TOC-related content from excerpt
    const cleanExcerpt = excerpt
      ?.replace(/목차\s*/g, '') // Remove Korean TOC
      .replace(/Table of contents\s*/gi, '') // Remove English TOC
      .replace(/Table Of Contents\s*/gi, '') // Remove capitalized TOC
      .replace(/```toc[\s\S]*?```/g, '') // Remove TOC code blocks
      .replace(/^\s*$\n/gm, '') // Remove empty lines
      .trim()

    // Only show excerpt if it has meaningful content after filtering
    const shouldShowExcerpt = cleanExcerpt && cleanExcerpt.length > 10

    // Filter out undefined tags and create Badge components
    const validTags = tags.filter(tag => tag && tag !== 'undefined')
    const tagBadges = validTags.map((tag: string) => (
      <Badge
        key={`${slug}-${tag}`}
        variant={getBadgeVariant(tag)}
        className={cn(
          'text-xs transition-all duration-200',
          // 터치 친화적: 최소 터치 영역 확보와 적절한 패딩
          'min-h-[32px] cursor-pointer px-2 py-1 hover:scale-105',
          // 모바일에서 더 큰 터치 영역
          'md:min-h-[28px] md:px-1.5 md:py-0.5'
        )}
        onClick={e => handleTagClick(e, tag)}
      >
        #{tag}
      </Badge>
    ))

    return (
      <article
        key={slug}
        className={cn(
          'group cursor-pointer overflow-hidden',
          // 모바일 최적화: 더 작은 패딩과 반경
          'rounded-lg border border-border p-3 sm:p-4',
          // 태블릿 이상에서 더 큰 패딩과 반경
          'md:rounded-xl md:p-content',
          'hover:bg-accent/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
        )}
        data-testid="post-item"
      >
        <Link
          href={`/posts/${slug}`}
          className="block text-inherit no-underline hover:text-inherit"
        >
          <div className="flex items-start gap-2 sm:gap-3 md:gap-6">
            {/* Content Section */}
            <div className="min-w-0 flex-1">
              {/* Title */}
              <h2
                className={cn(
                  // 모바일 최적화: 작은 폰트 크기와 적절한 줄 간격
                  'mb-2 text-base font-semibold leading-relaxed',
                  // 태블릿 이상에서 더 큰 폰트 사용
                  'md:text-lg md:leading-h3',
                  'text-foreground group-hover:text-primary group-hover:underline',
                  // 모바일에서 3줄까지 허용, 태블릿 이상에서 2줄
                  'line-clamp-3 transition-all duration-200 md:line-clamp-2'
                )}
              >
                {title}
              </h2>

              {/* Subtitle/Excerpt */}
              {shouldShowExcerpt && (
                <p
                  className={cn(
                    // 모바일에서 더 작은 여백
                    'mb-3 text-sm leading-small text-secondary',
                    // 태블릿 이상에서 더 큰 여백
                    'md:mb-4',
                    'line-clamp-2'
                  )}
                  data-testid="post-excerpt"
                >
                  {cleanExcerpt}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:gap-2 md:gap-3">
                <time data-testid="post-date">{formattedDate}</time>
                {validTags.length > 0 && (
                  <>
                    <span>·</span>
                    <div
                      className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-2"
                      data-testid="post-tags"
                    >
                      {tagBadges}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Featured Image Placeholder - 모바일에서 더 작은 크기 */}
            <div
              className={cn(
                // 모바일에서는 64px, 태블릿에서는 80px, 데스크탑에서는 120px
                'h-16 w-16 flex-shrink-0 sm:h-20 sm:w-20',
                'md:h-article-image md:w-article-image',
                'bg-accent/20 rounded-md border border-border',
                'flex items-center justify-center',
                // 모바일에서도 표시하되 더 작은 크기로
                'md:rounded-lg'
              )}
            >
              {/* Future: Featured image would go here */}
              <div className="text-muted-foreground/40">
                <svg
                  className="h-6 w-6 md:h-8 md:w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="10,9 9,9 8,9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  })

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8" data-testid="post-list">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-3 sm:gap-4 md:gap-6">{mapPost}</div>
      </div>
    </div>
  )
}

export default PostList
