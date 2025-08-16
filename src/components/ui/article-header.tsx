'use client'

import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { 
  faCalendarAlt, 
  faTag, 
  faClock, 
  faEye,
  faUser,
  faFolder
} from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface ArticleHeaderProps {
  title: string
  date: string
  category?: string
  tags?: string[]
  author?: string
  readingTime?: number
  viewCount?: number
  className?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

/**
 * Standardized article header component with metadata
 * Provides consistent typography and layout for blog post headers
 */
export function ArticleHeader({
  title,
  date,
  category,
  tags = [],
  author,
  readingTime,
  viewCount,
  className,
  variant = 'default'
}: ArticleHeaderProps) {
  // Format date to Korean locale
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (variant === 'minimal') {
    return (
      <header className={cn("space-y-4", className)}>
        <h1 className={cn(
          "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground",
          "leading-tight tracking-tight",
          "break-keep" // Korean text wrapping
        )}>
          {title}
        </h1>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Fa icon={faCalendarAlt} className="text-xs" />
          <time dateTime={date}>{formattedDate}</time>
        </div>
      </header>
    )
  }

  return (
    <Card className={cn(
      "border-border/50 bg-card/50 backdrop-blur-sm",
      "hover:border-border transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-4">
        {/* Article Title */}
        <h1 className={cn(
          "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground",
          "leading-tight tracking-tight mb-4",
          "break-keep" // Korean text wrapping
        )}>
          {title}
        </h1>
        
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Fa icon={faCalendarAlt} className="text-xs text-primary/70" />
            <time dateTime={date}>{formattedDate}</time>
          </div>
          
          {/* Category */}
          {category && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Fa icon={faFolder} className="text-xs text-blue-500/70" />
                <Link 
                  href={`/?category=${encodeURIComponent(category)}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {category}
                </Link>
              </div>
            </>
          )}
          
          {/* Author */}
          {author && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Fa icon={faUser} className="text-xs text-green-500/70" />
                <span>{author}</span>
              </div>
            </>
          )}
          
          {/* Reading Time */}
          {readingTime && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Fa icon={faClock} className="text-xs text-orange-500/70" />
                <span>{readingTime}분 읽기</span>
              </div>
            </>
          )}
          
          {/* View Count */}
          {viewCount && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Fa icon={faEye} className="text-xs text-purple-500/70" />
                <span>{viewCount.toLocaleString()} 조회</span>
              </div>
            </>
          )}
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-4">
            <Fa icon={faTag} className="text-xs text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "hover:bg-primary hover:text-primary-foreground",
                      "transition-colors duration-200 text-xs cursor-pointer",
                      "border-border/50 hover:border-primary/50"
                    )}
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  )
}

interface ArticleMetaProps {
  date: string
  category?: string
  tags?: string[]
  readingTime?: number
  className?: string
}

/**
 * Compact article metadata component for use in lists
 */
export function ArticleMeta({
  date,
  category,
  tags = [],
  readingTime,
  className
}: ArticleMetaProps) {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs text-muted-foreground",
      "flex-wrap",
      className
    )}>
      <div className="flex items-center gap-1">
        <Fa icon={faCalendarAlt} className="text-[10px]" />
        <time dateTime={date}>{formattedDate}</time>
      </div>
      
      {category && (
        <>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Fa icon={faFolder} className="text-[10px]" />
            <span>{category}</span>
          </div>
        </>
      )}
      
      {readingTime && (
        <>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Fa icon={faClock} className="text-[10px]" />
            <span>{readingTime}분</span>
          </div>
        </>
      )}
      
      {tags.length > 0 && (
        <>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Fa icon={faTag} className="text-[10px]" />
            <span>{tags.slice(0, 2).join(', ')}{tags.length > 2 ? '...' : ''}</span>
          </div>
        </>
      )}
    </div>
  )
}

export { ArticleHeader as default }