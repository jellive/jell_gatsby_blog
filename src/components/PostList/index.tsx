'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

    const formattedDate = formatDate(date)

    // Filter out TOC-related content from excerpt
    const cleanExcerpt = excerpt
      ?.replace(/목차\s*/g, '')
      .replace(/Table of contents\s*/gi, '')
      .replace(/Table Of Contents\s*/gi, '')
      .replace(/```toc[\s\S]*?```/g, '')
      .replace(/^\s*$\n/gm, '')
      .trim()

    const shouldShowExcerpt = cleanExcerpt && cleanExcerpt.length > 10

    // Filter out undefined tags
    const validTags = tags.filter(tag => tag && tag !== 'undefined')

    return (
      <article
        key={slug}
        className={cn(
          'group cursor-pointer',
          'border-border/40 rounded-xl border bg-card',
          'p-5 sm:p-6',
          'transition-shadow duration-200',
          'shadow-none hover:shadow-sm'
        )}
        data-testid="post-item"
      >
        <Link
          href={`/posts/${slug}`}
          className="block text-inherit no-underline hover:text-inherit"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Content Section */}
            <div className="min-w-0 flex-1">
              {/* Title - larger, tighter tracking */}
              <h2
                className={cn(
                  'mb-3 font-heading text-xl font-bold leading-tight tracking-tight',
                  'md:text-2xl',
                  'text-foreground transition-colors duration-200',
                  'group-hover:text-primary',
                  'line-clamp-2'
                )}
              >
                {title}
              </h2>

              {/* Subtitle/Excerpt */}
              {shouldShowExcerpt && (
                <p
                  className={cn(
                    'mb-4 text-sm leading-relaxed text-muted-foreground',
                    'line-clamp-2'
                  )}
                  data-testid="post-excerpt"
                >
                  {cleanExcerpt}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <time data-testid="post-date">{formattedDate}</time>
                {validTags.length > 0 && (
                  <div
                    className="flex flex-wrap gap-x-2"
                    data-testid="post-tags"
                  >
                    {validTags.map((tag: string) => (
                      <span
                        key={`${slug}-${tag}`}
                        className="text-muted-foreground/70 cursor-pointer transition-colors duration-200 hover:text-primary"
                        onClick={e => handleTagClick(e, tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hover arrow indicator */}
            <span className="text-muted-foreground/0 mt-1 hidden flex-shrink-0 transition-all duration-200 group-hover:text-muted-foreground sm:block">
              &rarr;
            </span>
          </div>
        </Link>
      </article>
    )
  })

  return (
    <div className="w-full" data-testid="post-list">
      <div className="mx-auto max-w-4xl">
        <div className="grid animate-slide-up gap-4 sm:gap-5 md:gap-6">
          {mapPost}
        </div>
      </div>
    </div>
  )
}

export default PostList
