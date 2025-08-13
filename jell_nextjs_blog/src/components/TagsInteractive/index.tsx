'use client'

import React, { useState, useEffect } from 'react'
import PostList from '@/components/PostList'

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
        // 해시 기반 URL을 실제 태그 페이지 URL로 리다이렉트
        window.location.href = `/tags/${encodeURIComponent(hashTag)}`
      } else {
        setTargetTag(hashTag || 'undefined')
      }
    }
  }, [])

  const getFontSize = (totalCount: number) => {
    if (largeCount === 0) return '1rem'
    let fontSize = Math.round(50 / (largeCount / totalCount)).toString()
    if (fontSize.length <= 1) fontSize = `0${fontSize}`
    return `1.${fontSize}rem`
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

  const tagList = tagGroups.map((g) => (
    <li key={g.fieldValue}>
      <span
        className="tag-text"
        style={{
          fontSize: g.fieldValue !== 'undefined' ? getFontSize(g.totalCount) : '1rem',
          opacity: g.fieldValue === targetTag ? '0.9' : '0.5',
          fontWeight: g.fieldValue === targetTag ? 'bold' : 'normal'
        }}
        onClick={() => {
          setTargetTag(g.fieldValue)
          if (typeof window !== 'undefined') {
            // URL 기반 네비게이션으로 변경
            if (g.fieldValue !== 'undefined') {
              window.location.href = `/tags/${encodeURIComponent(g.fieldValue)}`
            } else {
              window.location.hash = `#${g.fieldValue}`
            }
          }
        }}
      >
        {g.fieldValue !== 'undefined' ? (
          <a href={`/tags/${encodeURIComponent(g.fieldValue)}`}>{g.fieldValue}</a>
        ) : (
          <a href={`#${g.fieldValue}`}>{g.fieldValue}</a>
        )}
      </span>
    </li>
  ))

  return (
    <div id="tags">
      <div className="tag-list-wrap">
        <ul>{tagList}</ul>
      </div>
      <PostList posts={getPostList()} />
    </div>
  )
}