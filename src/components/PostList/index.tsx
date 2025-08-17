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
  const getBadgeVariant = (tag: string): "default" | "secondary" | "outline" => {
    const lowerTag = tag.toLowerCase()
    
    // Development related tags
    if (lowerTag.includes('개발') || lowerTag.includes('development') || 
        lowerTag.includes('javascript') || lowerTag.includes('typescript') ||
        lowerTag.includes('js') || lowerTag.includes('react') || lowerTag.includes('nextjs')) {
      return "default" // Uses primary color
    }
    
    // Bicycle/Sports related tags  
    if (lowerTag.includes('자전거') || lowerTag.includes('bicycle') || 
        lowerTag.includes('운동') || lowerTag.includes('cycling')) {
      return "secondary" // Uses secondary color
    }
    
    // Game related tags
    if (lowerTag.includes('게임') || lowerTag.includes('game') || lowerTag.includes('gaming')) {
      return "outline" // Uses outline style
    }
    
    return "secondary" // Default fallback
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
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
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

    // Filter out undefined tags and create Badge components
    const validTags = tags.filter(tag => tag && tag !== 'undefined')
    const tagBadges = validTags.map((tag: string) => (
      <Badge
        key={`${slug}-${tag}`}
        variant={getBadgeVariant(tag)}
        className={cn(
          "text-xs transition-all duration-200",
          "hover:scale-105 cursor-pointer"
        )}
        onClick={(e) => handleTagClick(e, tag)}
      >
        #{tag}
      </Badge>
    ))

    return (
      <article 
        key={slug} 
        className={cn(
          "group cursor-pointer",
          "p-content border border-border rounded-xl",
          "hover:bg-accent/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        )}
        data-testid="post-item"
      >
        <Link 
          href={`/posts/${slug}`}
          className="block no-underline text-inherit hover:text-inherit"
        >
          <div className="flex gap-6 items-start">
            {/* Content Section */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h2 className={cn(
                "text-lg font-semibold leading-h3 mb-2",
                "text-foreground group-hover:text-primary group-hover:underline",
                "line-clamp-2 transition-all duration-200"
              )}>
                {title}
              </h2>
              
              {/* Subtitle/Excerpt */}
              {excerpt && (
                <p className={cn(
                  "text-sm text-secondary leading-small mb-4",
                  "line-clamp-2"
                )}>
                  {excerpt}
                </p>
              )}
              
              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <time data-testid="post-date">{formattedDate}</time>
                {validTags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex flex-wrap gap-2" data-testid="post-tags">
                      {tagBadges}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Featured Image Placeholder - 112x112px */}
            <div className={cn(
              "flex-shrink-0 w-article-image h-article-image",
              "bg-accent/20 rounded-lg border border-border",
              "hidden md:flex items-center justify-center"
            )}>
              {/* Future: Featured image would go here */}
              <div className="text-muted-foreground/40">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  })

  return (
    <div className="w-full max-w-4xl" data-testid="post-list">
      <div className="grid gap-6">
        {mapPost}
      </div>
    </div>
  )
}

export default PostList