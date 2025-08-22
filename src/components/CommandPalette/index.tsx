'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faHashtag,
  faCalendarAlt,
  faFolder,
  faArrowRight,
  faKeyboard,
  faStar,
  faHistory,
} from '@fortawesome/free-solid-svg-icons'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PostData } from '@/lib/markdown'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  allPosts: PostData[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface RecentSearch {
  query: string
  timestamp: number
}

export default function CommandPalette({
  allPosts,
  isOpen,
  onOpenChange,
}: CommandPaletteProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog-recent-searches')
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as RecentSearch[]
          // Filter out searches older than 30 days
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
          const filtered = parsed.filter(item => item.timestamp > thirtyDaysAgo)
          setRecentSearches(filtered.slice(0, 5)) // Keep only last 5
        } catch (error) {
          console.error('Error parsing recent searches:', error)
        }
      }
    }
  }, [])

  // Save search to recent searches
  const saveSearch = (query: string) => {
    if (!query.trim() || query.length < 2) return

    const newSearch: RecentSearch = {
      query: query.trim(),
      timestamp: Date.now(),
    }

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.query !== newSearch.query)
      const updated = [newSearch, ...filtered].slice(0, 5)

      if (typeof window !== 'undefined') {
        localStorage.setItem('blog-recent-searches', JSON.stringify(updated))
      }

      return updated
    })
  }

  // Filter posts based on search
  const filteredPosts =
    searchValue.length >= 2
      ? allPosts
          .filter(post => {
            const searchLower = searchValue.toLowerCase()
            const titleMatch = post.frontMatter.title
              .toLowerCase()
              .includes(searchLower)
            const contentMatch = post.content
              .toLowerCase()
              .includes(searchLower)
            const tagMatch = post.frontMatter.tags.some(tag =>
              tag.toLowerCase().includes(searchLower)
            )
            const categoryMatch = post.frontMatter.category
              .toLowerCase()
              .includes(searchLower)

            return titleMatch || contentMatch || tagMatch || categoryMatch
          })
          .slice(0, 8) // Limit to 8 results for performance
      : []

  // Get popular posts (posts with more content/tags as proxy for popularity)
  const popularPosts = allPosts
    .sort((a, b) => {
      const aScore = a.content.length + a.frontMatter.tags.length * 100
      const bScore = b.content.length + b.frontMatter.tags.length * 100
      return bScore - aScore
    })
    .slice(0, 5)

  // Get unique categories and tags for suggestions
  const allCategories = Array.from(
    new Set(allPosts.map(post => post.frontMatter.category))
  )
  const allTags = Array.from(
    new Set(allPosts.flatMap(post => post.frontMatter.tags))
  )
    .sort((a, b) => {
      // Sort by frequency
      const aCount = allPosts.filter(post =>
        post.frontMatter.tags.includes(a)
      ).length
      const bCount = allPosts.filter(post =>
        post.frontMatter.tags.includes(b)
      ).length
      return bCount - aCount
    })
    .slice(0, 8)

  const handleSelectPost = (post: PostData) => {
    saveSearch(searchValue)
    onOpenChange(false)
    setSearchValue('')
    router.push(`/posts/${post.slug}`)
  }

  const handleSelectTag = (tag: string) => {
    saveSearch(tag)
    onOpenChange(false)
    setSearchValue('')
    router.push(`/tags/${encodeURIComponent(tag)}`)
  }

  const handleSelectCategory = (category: string) => {
    saveSearch(category)
    onOpenChange(false)
    setSearchValue('')
    // Navigate to homepage and apply category filter (if implemented)
    router.push(`/?category=${encodeURIComponent(category)}`)
  }

  const handleRecentSearch = (query: string) => {
    setSearchValue(query)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="포스트, 태그, 카테고리 검색..."
        value={searchValue}
        onValueChange={setSearchValue}
        className="text-base"
      />

      <CommandList className="max-h-[400px]">
        {/* Empty State */}
        {searchValue.length >= 2 && filteredPosts.length === 0 && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-3 py-6">
              <Fa icon={faSearch} className="text-2xl text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  &quot;{searchValue}&quot;에 대한 검색 결과가 없습니다
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  다른 키워드로 검색해보세요
                </p>
              </div>
            </div>
          </CommandEmpty>
        )}

        {/* Search Results - Posts */}
        {searchValue.length >= 2 && filteredPosts.length > 0 && (
          <CommandGroup heading={`검색 결과 (${filteredPosts.length}개)`}>
            {filteredPosts.map(post => (
              <CommandItem
                key={post.slug}
                value={`post-${post.slug}`}
                onSelect={() => handleSelectPost(post)}
                className="flex cursor-pointer items-start gap-3 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {post.frontMatter.title}
                    </span>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {post.frontMatter.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Fa icon={faCalendarAlt} className="text-[10px]" />
                    <span>{formatDate(post.frontMatter.date)}</span>
                    {post.frontMatter.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="truncate">
                          {post.frontMatter.tags.slice(0, 2).join(', ')}
                          {post.frontMatter.tags.length > 2 && '...'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Fa
                  icon={faArrowRight}
                  className="mt-1 text-xs text-muted-foreground"
                />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Recent Searches */}
        {searchValue.length === 0 && recentSearches.length > 0 && (
          <>
            <CommandGroup heading="최근 검색어">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={`recent-${index}`}
                  value={`recent-${search.query}`}
                  onSelect={() => handleRecentSearch(search.query)}
                  className="flex cursor-pointer items-center gap-3 p-3"
                >
                  <Fa
                    icon={faHistory}
                    className="text-sm text-muted-foreground"
                  />
                  <span className="flex-1 text-sm">{search.query}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(search.timestamp).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Popular Posts */}
        {searchValue.length === 0 && (
          <>
            <CommandGroup heading="인기 포스트">
              {popularPosts.map(post => (
                <CommandItem
                  key={`popular-${post.slug}`}
                  value={`popular-${post.slug}`}
                  onSelect={() => handleSelectPost(post)}
                  className="flex cursor-pointer items-start gap-3 p-3"
                >
                  <Fa
                    icon={faStar}
                    className="mt-0.5 text-sm text-yellow-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {post.frontMatter.title}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {post.frontMatter.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(post.frontMatter.date)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Categories */}
        {searchValue.length === 0 && (
          <>
            <CommandGroup heading="카테고리">
              {allCategories.map(category => (
                <CommandItem
                  key={`category-${category}`}
                  value={`category-${category}`}
                  onSelect={() => handleSelectCategory(category)}
                  className="flex cursor-pointer items-center gap-3 p-3"
                >
                  <Fa icon={faFolder} className="text-sm text-blue-500" />
                  <span className="flex-1 text-sm">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {
                      allPosts.filter(
                        post => post.frontMatter.category === category
                      ).length
                    }
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Popular Tags */}
        {searchValue.length === 0 && (
          <CommandGroup heading="인기 태그">
            {allTags.map(tag => (
              <CommandItem
                key={`tag-${tag}`}
                value={`tag-${tag}`}
                onSelect={() => handleSelectTag(tag)}
                className="flex cursor-pointer items-center gap-3 p-3"
              >
                <Fa icon={faHashtag} className="text-sm text-green-500" />
                <span className="flex-1 text-sm">#{tag}</span>
                <Badge variant="secondary" className="text-xs">
                  {
                    allPosts.filter(post => post.frontMatter.tags.includes(tag))
                      .length
                  }
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Footer with keyboard shortcuts */}
        {searchValue.length === 0 && (
          <>
            <CommandSeparator />
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Fa icon={faKeyboard} className="text-[10px]" />
                  <span>팁: 한글/영문으로 검색 가능</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    ESC
                  </kbd>
                  <span>닫기</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
