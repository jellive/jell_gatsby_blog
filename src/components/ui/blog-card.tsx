'use client'

import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { 
  faCalendarAlt, 
  faTag, 
  faClock, 
  faArrowRight,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArticleMeta } from './article-header'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  title: string
  excerpt?: string
  date: string
  category?: string
  tags?: string[]
  slug: string
  readingTime?: number
  featuredImage?: string
  className?: string
  variant?: 'default' | 'compact' | 'featured' | 'minimal'
  isExternal?: boolean
  showTags?: boolean
  showMeta?: boolean
  showExcerpt?: boolean
}

/**
 * Unified blog card component for consistent post presentation
 * Supports multiple variants for different use cases
 */
export function BlogCard({
  title,
  excerpt,
  date,
  category,
  tags = [],
  slug,
  readingTime,
  featuredImage,
  className,
  variant = 'default',
  isExternal = false,
  showTags = true,
  showMeta = true,
  showExcerpt = true
}: BlogCardProps) {
  const CardWrapper = isExternal ? 'a' : Link
  const cardProps = isExternal 
    ? { href: slug, target: '_blank', rel: 'noopener noreferrer' }
    : { href: `/posts/${slug}` }

  if (variant === 'minimal') {
    return (
      <CardWrapper {...cardProps} className="block group">
        <Card className={cn(
          "border-border/50 bg-card/30 backdrop-blur-sm",
          "hover:border-border hover:bg-card/50",
          "transition-all duration-200 cursor-pointer",
          "group-hover:shadow-md group-hover:scale-[1.02]",
          className
        )}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className={cn(
                "font-semibold text-lg text-foreground leading-tight",
                "group-hover:text-primary transition-colors duration-200",
                "line-clamp-2 break-keep"
              )}>
                {title}
              </h3>
              
              {showMeta && (
                <ArticleMeta
                  date={date}
                  category={category}
                  readingTime={readingTime}
                  className="text-xs"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </CardWrapper>
    )
  }

  if (variant === 'compact') {
    return (
      <CardWrapper {...cardProps} className="block group">
        <Card className={cn(
          "border-border/50 bg-card/30 backdrop-blur-sm",
          "hover:border-border hover:bg-card/50",
          "transition-all duration-200 cursor-pointer",
          "group-hover:shadow-md group-hover:scale-[1.01]",
          className
        )}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {featuredImage && (
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary/30 shrink-0">
                    <img 
                      src={featuredImage} 
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold text-base text-foreground leading-tight mb-2",
                    "group-hover:text-primary transition-colors duration-200",
                    "line-clamp-2 break-keep"
                  )}>
                    {title}
                  </h3>
                  
                  {showMeta && (
                    <ArticleMeta
                      date={date}
                      category={category}
                      readingTime={readingTime}
                      tags={showTags ? tags.slice(0, 2) : []}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
              
              {showExcerpt && excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {excerpt}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </CardWrapper>
    )
  }

  if (variant === 'featured') {
    return (
      <CardWrapper {...cardProps} className="block group">
        <Card className={cn(
          "border-border/50 bg-card/30 backdrop-blur-sm",
          "hover:border-border hover:bg-card/50",
          "transition-all duration-300 cursor-pointer",
          "group-hover:shadow-lg group-hover:scale-[1.02]",
          "overflow-hidden",
          className
        )}>
          {featuredImage && (
            <div className="aspect-video w-full overflow-hidden bg-secondary/30">
              <img 
                src={featuredImage} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="space-y-4">
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
              
              <h3 className={cn(
                "font-bold text-xl text-foreground leading-tight",
                "group-hover:text-primary transition-colors duration-200",
                "line-clamp-2 break-keep"
              )}>
                {title}
              </h3>
              
              {showExcerpt && excerpt && (
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {excerpt}
                </p>
              )}
              
              {showMeta && (
                <ArticleMeta
                  date={date}
                  readingTime={readingTime}
                  tags={showTags ? tags.slice(0, 3) : []}
                />
              )}
            </div>
          </CardContent>
          
          <CardFooter className="px-6 pb-6 pt-0">
            <Button variant="ghost" className="w-full justify-between group/btn">
              <span>자세히 보기</span>
              <Fa 
                icon={isExternal ? faExternalLinkAlt : faArrowRight} 
                className="text-xs transition-transform duration-200 group-hover/btn:translate-x-1" 
              />
            </Button>
          </CardFooter>
        </Card>
      </CardWrapper>
    )
  }

  // Default variant
  return (
    <CardWrapper {...cardProps} className="block group">
      <Card className={cn(
        "border-border/50 bg-card/30 backdrop-blur-sm",
        "hover:border-border hover:bg-card/50",
        "transition-all duration-200 cursor-pointer",
        "group-hover:shadow-md group-hover:scale-[1.01]",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="space-y-3">
            {category && (
              <Badge variant="outline" className="text-xs w-fit">
                {category}
              </Badge>
            )}
            
            <h3 className={cn(
              "font-semibold text-lg text-foreground leading-tight",
              "group-hover:text-primary transition-colors duration-200",
              "line-clamp-2 break-keep"
            )}>
              {title}
            </h3>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {showExcerpt && excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          )}
          
          {showMeta && (
            <div className="flex items-center justify-between">
              <ArticleMeta
                date={date}
                readingTime={readingTime}
                className="text-xs"
              />
              
              {isExternal && (
                <Fa icon={faExternalLinkAlt} className="text-xs text-muted-foreground" />
              )}
            </div>
          )}
          
          {showTags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-[10px] py-0 px-2"
                >
                  #{tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] py-0 px-2">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  )
}

interface BlogCardGridProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'masonry' | 'uniform'
}

/**
 * Grid layout for blog cards with responsive columns
 */
export function BlogCardGrid({ 
  children, 
  className,
  variant = 'default'
}: BlogCardGridProps) {
  return (
    <div className={cn(
      // Base grid styles
      "grid gap-6",
      
      // Responsive columns based on variant
      variant === 'uniform' && [
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "auto-rows-fr" // Equal height rows
      ],
      
      variant === 'masonry' && [
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "auto-rows-min" // Auto-sized rows for masonry effect
      ],
      
      variant === 'default' && [
        "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
        "auto-rows-auto"
      ],
      
      className
    )}>
      {children}
    </div>
  )
}

export { BlogCard as default }