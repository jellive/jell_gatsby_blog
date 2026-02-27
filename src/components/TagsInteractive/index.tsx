'use client'

import React, { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
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
    let large = 0
    for (const g of tagGroups) {
      if (g.fieldValue !== 'undefined' && g.totalCount > large) {
        large = g.totalCount
      }
    }
    setLargeCount(large)
  }, [tagGroups])

  useEffect(() => {
    if (typeof window !== 'undefined' && location.hash) {
      const hashTag = location.hash.split('#')[1]
      if (hashTag && hashTag !== 'undefined') {
        router.push(`/tags/${encodeURIComponent(hashTag)}`)
      } else {
        setTargetTag(hashTag || 'undefined')
      }
    }
  }, [router])

  const getFontSize = (totalCount: number): string => {
    if (largeCount === 0) return '0.875rem'
    const ratio = totalCount / largeCount
    if (ratio >= 0.8) return '1.125rem'
    if (ratio >= 0.5) return '1rem'
    return '0.8125rem'
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

    if (targetTag === 'undefined' || posts.length === 0) {
      return (
        <div className="mt-2 border-t border-[var(--border)] pt-8">
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            위의 태그를 클릭하면 해당 태그가 포함된 포스트들을 볼 수 있습니다.
          </p>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            태그 크기는 포스트 개수에 따라 달라집니다.
          </p>
        </div>
      )
    }

    return (
      <div
        className="mt-2 border-t border-[var(--border)] pt-8"
        data-testid="tag-post-list"
      >
        <PostList posts={posts} />
      </div>
    )
  }

  const validTags = tagGroups.filter(g => g.fieldValue !== 'undefined')
  const undefinedTag = tagGroups.find(g => g.fieldValue === 'undefined')

  const tagElements = validTags.map(g => {
    const isSelected = g.fieldValue === targetTag

    return (
      <div key={g.fieldValue} data-testid="tag-item">
        <Link
          href={`/tags/${encodeURIComponent(g.fieldValue)}`}
          passHref
          onClick={() => setTargetTag(g.fieldValue)}
          style={{
            fontFamily: 'var(--font-mono-display)',
            fontSize: getFontSize(g.totalCount),
            color: isSelected ? 'var(--primary)' : 'var(--muted-foreground)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
            cursor: 'pointer',
            lineHeight: '1.4',
          }}
          className="hover:text-[var(--foreground)] hover:underline"
          onMouseEnter={e => {
            if (!isSelected) {
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                'var(--foreground)'
            }
          }}
          onMouseLeave={e => {
            if (!isSelected) {
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                'var(--muted-foreground)'
            }
          }}
        >
          #{g.fieldValue}
          <span
            style={{
              fontSize: '0.75em',
              marginLeft: '0.25rem',
              opacity: 0.6,
            }}
          >
            ({g.totalCount})
          </span>
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
      <div>
        <div className="mb-6 flex items-baseline gap-4">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            All Tags
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-mono-display)',
              fontSize: '0.8125rem',
              color: 'var(--muted-foreground)',
            }}
          >
            {validTags.length} tags / {undefinedTag?.totalCount ?? 0} posts
          </span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3" data-testid="tag-list">
          {tagElements.length > 0 ? (
            tagElements
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-mono-display)',
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
                fontStyle: 'italic',
              }}
            >
              No tags available
            </span>
          )}
        </div>
      </div>

      {/* Post Results */}
      <div className="tag-results" data-testid="tag-posts">
        {renderPostListSection()}
      </div>
    </div>
  )
}
