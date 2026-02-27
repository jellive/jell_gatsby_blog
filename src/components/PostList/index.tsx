'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
      const year = date.getFullYear()

      return `${month} ${year}`
    } catch (_error) {
      // Fallback for invalid dates
      return dateString
    }
  }

  const mapPost = posts.map((post: Post, index: number) => {
    const { slug, frontMatter, excerpt } = post
    const { date, title, tags } = frontMatter

    // Format date - editorial style (Mon YYYY)
    const formattedDate = formatDate(date)

    // Editorial numbering (01, 02, ...)
    const num = String(index + 1).padStart(2, '0')

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

    // Filter out undefined tags
    const validTags = tags.filter(tag => tag && tag !== 'undefined')

    return (
      <article key={slug} className="post-item" data-testid="post-item">
        <Link href={`/posts/${slug}`} className="post-link">
          <div className="post-number">{num}</div>
          <div className="post-body">
            <div className="post-header-row">
              <h2 className="post-title">{title}</h2>
              <time className="post-date" data-testid="post-date">
                {formattedDate}
              </time>
            </div>
            {shouldShowExcerpt && (
              <p className="post-excerpt" data-testid="post-excerpt">
                {cleanExcerpt}
              </p>
            )}
            {validTags.length > 0 && (
              <div className="post-tags" data-testid="post-tags">
                {validTags.map((tag: string) => (
                  <span
                    key={`${slug}-${tag}`}
                    className="post-tag"
                    role="button"
                    tabIndex={0}
                    onClick={e => handleTagClick(e, tag)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTagClick(e as unknown as React.MouseEvent, tag)
                      }
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </article>
    )
  })

  return (
    <div className="w-full" data-testid="post-list">
      <div className="mx-auto max-w-3xl">{mapPost}</div>
    </div>
  )
}

export default PostList
