'use client'

import React, { useEffect } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faKeyboard,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SearchInteractive from '@/components/SearchInteractive'
import { useCommandPalette } from '@/components/CommandPalette/CommandPaletteProvider'
import type { PostData } from '@/lib/markdown'
import { cn } from '@/lib/utils'

interface SearchPageProps {
  allPosts: PostData[]
}

export default function SearchPage({ allPosts }: SearchPageProps) {
  const { openPalette, setAllPosts } = useCommandPalette()

  // Provide posts data to CommandPalette
  useEffect(() => {
    setAllPosts(allPosts)
  }, [allPosts, setAllPosts])

  return (
    <div className="search-page-container mx-auto w-full max-w-4xl space-y-6 px-4">
      {/* Enhanced Search Introduction */}
      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm',
          'transition-all duration-300 hover:border-border'
        )}
      >
        <CardHeader className="pb-4">
          <div className="mb-4 flex items-center gap-2">
            <Fa icon={faSearch} className="text-xl text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Search Posts</h1>
            <Badge variant="secondary" className="ml-auto text-xs">
              {allPosts.length} posts available
            </Badge>
          </div>

          <div className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              포스트, 태그, 카테고리를 검색해보세요. 더 빠른 검색을 위해{' '}
              <strong>Command Palette</strong>를 사용해보세요!
            </p>

            {/* Command Palette CTA */}
            <div
              className={cn(
                'flex items-center justify-between rounded-lg p-4',
                'from-primary/10 to-secondary/10 bg-gradient-to-r',
                'border-primary/20 border'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-md p-2">
                  <Fa icon={faKeyboard} className="text-sm text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    빠른 검색 사용하기
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    키보드 단축키로 더 빠르게 검색할 수 있습니다
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    ⌘K
                  </kbd>
                  <span>또는</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    Ctrl+K
                  </kbd>
                </div>
                <Button
                  onClick={openPalette}
                  size="sm"
                  className="gap-2 text-xs"
                >
                  <Fa icon={faArrowUp} className="text-[10px]" />
                  Command Palette 열기
                </Button>
              </div>
            </div>

            {/* Search Tips */}
            <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground md:grid-cols-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/60 h-1.5 w-1.5 rounded-full"></div>
                <span>제목과 내용에서 검색 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/60 h-1.5 w-1.5 rounded-full"></div>
                <span>태그와 카테고리로 필터링</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/60 h-1.5 w-1.5 rounded-full"></div>
                <span>한글과 영문 동시 지원</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/60 h-1.5 w-1.5 rounded-full"></div>
                <span>실시간 검색 결과 표시</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Traditional Search Interface */}
      <SearchInteractive allPosts={allPosts} />
    </div>
  )
}
