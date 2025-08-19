'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faTags, faHashtag, faInfo } from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import PostList from '@/components/PostList'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TagGroup {
  fieldValue: string
  totalCount: number
  posts: any[]
}

interface TagsInteractiveProps {
  tagGroups: TagGroup[]
}

export default function TagsInteractive({ tagGroups }: TagsInteractiveProps) {
  const [largeCount, setLargeCount] = useState(0)
  const [targetTag, setTargetTag] = useState('undefined')
  const router = useRouter()

  useEffect(() => {
    // Calculate largest count for font sizing
    let large = 0
    for (const g of tagGroups) {
      if (g.fieldValue !== 'undefined' && g.totalCount > large) {
        large = g.totalCount
      }
    }
    setLargeCount(large)
  }, [tagGroups])

  // Handle hash navigation and redirect to proper URL
  useEffect(() => {
    if (typeof window !== 'undefined' && location.hash) {
      const hashTag = location.hash.split('#')[1]
      if (hashTag && hashTag !== 'undefined') {
        // Use Next.js router for safer navigation
        router.push(`/tags/${encodeURIComponent(hashTag)}`)
      } else {
        setTargetTag(hashTag || 'undefined')
      }
    }
  }, [router])

  const getBadgeVariant = (totalCount: number) => {
    if (largeCount === 0) return 'outline'
    const ratio = totalCount / largeCount
    if (ratio >= 0.8) return 'default' // Largest tags
    if (ratio >= 0.5) return 'secondary' // Medium tags
    return 'outline' // Smallest tags
  }

  const getBadgeSize = (totalCount: number) => {
    if (largeCount === 0) return 'default'
    const ratio = totalCount / largeCount
    if (ratio >= 0.8) return 'lg' // Largest tags
    if (ratio >= 0.5) return 'default' // Medium tags
    return 'sm' // Smallest tags
  }

  const getPostList = () => {
    const targetGroup = tagGroups.find(g => g.fieldValue === targetTag)
    if (targetGroup) {
      return targetGroup.posts
    }
    const undefinedGroup = tagGroups.find(g => g.fieldValue === 'undefined')
    if (undefinedGroup) {
      return undefinedGroup.posts
    }
    return []
  }

  const renderPostListSection = () => {
    const posts = getPostList()

    // If no tag is selected or "undefined" tag is selected, show helpful message
    if (targetTag === 'undefined' || posts.length === 0) {
      return (
        <Card
          className={cn(
            'border-border/50 bg-card/50 backdrop-blur-sm',
            'transition-all duration-300 hover:border-border'
          )}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Fa icon={faInfo} className="text-lg text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                태그로 포스트 찾기
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              위의 태그를 클릭하면 해당 태그가 포함된 포스트들을 볼 수 있습니다.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              태그 크기는 포스트 개수에 따라 달라집니다.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div data-testid="tag-post-list">
        <PostList posts={posts} />
      </div>
    )
  }

  const validTags = tagGroups.filter(g => g.fieldValue !== 'undefined')
  const undefinedTag = tagGroups.find(g => g.fieldValue === 'undefined')

  const tagElements = validTags.map(g => {
    const variant = getBadgeVariant(g.totalCount)
    const isSelected = g.fieldValue === targetTag

    return (
      <div key={g.fieldValue} data-testid="tag-item">
        <Link href={`/tags/${encodeURIComponent(g.fieldValue)}`} passHref>
          <Badge
            variant={isSelected ? 'default' : variant}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:scale-105',
              'border-border/50 hover:border-border',
              'px-3 py-2 text-sm font-medium',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'hover:bg-secondary/80',
              // Size-based styling
              getBadgeSize(g.totalCount) === 'lg' && 'px-4 py-2.5 text-base',
              getBadgeSize(g.totalCount) === 'sm' && 'px-2 py-1.5 text-xs'
            )}
            onClick={e => {
              // For client-side state management
              setTargetTag(g.fieldValue)
            }}
          >
            <Fa icon={faHashtag} className="mr-1 text-xs opacity-70" />
            {g.fieldValue}
            <span
              className={cn(
                'ml-1.5 text-xs opacity-70',
                isSelected && 'opacity-90'
              )}
            >
              {g.totalCount}
            </span>
          </Badge>
        </Link>
      </div>
    )
  })

  return (
    <div
      id="tags"
      className="tags-container mx-auto w-full max-w-6xl space-y-6 px-4"
    >
      {/* Tags Cloud */}
      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm',
          'transition-all duration-300 hover:border-border'
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Fa icon={faTags} className="text-lg text-primary" />
            <h1 className="text-xl font-bold text-foreground">All Tags</h1>
            <Badge variant="secondary" className="ml-auto text-xs">
              {validTags.length} tags
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tags Grid */}
          <div
            className={cn(
              'flex flex-wrap gap-2 rounded-md p-4',
              'bg-secondary/20 border-border/30 border'
            )}
            data-testid="tag-list"
          >
            {tagElements.length > 0 ? (
              tagElements
            ) : (
              <div className="text-sm italic text-muted-foreground">
                No tags available
              </div>
            )}
          </div>

          {/* Tag Stats */}
          <div
            className={cn(
              'flex items-center justify-between rounded-md p-3 text-xs',
              'bg-secondary/30 border-border/30 border text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-4">
              <span>Total posts: {undefinedTag?.totalCount || 0}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>
                Tagged posts:{' '}
                {validTags.reduce((sum, tag) => sum + tag.totalCount, 0)}
              </span>
            </div>
            <div className="text-xs opacity-70">Click tags to filter posts</div>
          </div>
        </CardContent>
      </Card>

      {/* Post Results */}
      <div className="tag-results" data-testid="tag-posts">
        {renderPostListSection()}
      </div>
    </div>
  )
}
