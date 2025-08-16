'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faFilter, 
  faHashtag, 
  faFolder, 
  faFileText,
  faList
} from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PostData } from '@/lib/markdown'
import PostList from '@/components/PostList'
import { cn } from '@/lib/utils'

interface SearchInteractiveProps {
  allPosts: PostData[]
}

export default function SearchInteractive({ allPosts }: SearchInteractiveProps) {
  const [value, setValue] = useState('')
  const [isTitleOnly, setIsTitleOnly] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // Calculate search results using useMemo for performance
  const searchResults = useMemo(() => {
    if (!value.trim()) {
      return {
        posts: allPosts,
        tags: [],
        categories: [],
        totalCount: allPosts.length
      }
    }

    const lowerValue = value.toLowerCase()
    
    // Filter posts
    const filteredPosts = allPosts.filter((post: PostData) => {
      const { frontMatter, content } = post
      const { title } = frontMatter

      if (!isTitleOnly && content.toLowerCase().indexOf(lowerValue) > -1) {
        return true
      }

      return title.toLowerCase().indexOf(lowerValue) > -1
    })

    // Get all unique tags and categories from all posts
    const allTags = Array.from(new Set(allPosts.flatMap(post => post.frontMatter.tags)))
    const allCategories = Array.from(new Set(allPosts.map(post => post.frontMatter.category)))

    // Filter tags and categories that match search
    const matchingTags = allTags.filter(tag => 
      tag.toLowerCase().includes(lowerValue)
    ).map(tag => ({
      name: tag,
      count: allPosts.filter(post => post.frontMatter.tags.includes(tag)).length,
      posts: allPosts.filter(post => post.frontMatter.tags.includes(tag))
    }))

    const matchingCategories = allCategories.filter(category => 
      category.toLowerCase().includes(lowerValue)
    ).map(category => ({
      name: category,
      count: allPosts.filter(post => post.frontMatter.category === category).length,
      posts: allPosts.filter(post => post.frontMatter.category === category)
    }))

    return {
      posts: filteredPosts,
      tags: matchingTags,
      categories: matchingCategories,
      totalCount: filteredPosts.length + matchingTags.length + matchingCategories.length
    }
  }, [value, isTitleOnly, allPosts])

  const showingAllPosts = value === ''

  return (
    <div className="search-container w-full max-w-4xl mx-auto px-4 space-y-6">
      {/* Search Controls */}
      <Card className={cn(
        "border-border/50 bg-card/50 backdrop-blur-sm",
        "hover:border-border transition-all duration-300"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Fa icon={faSearch} className="text-primary text-lg" />
            <h2 className="text-lg font-semibold text-foreground">
              Search Posts
            </h2>
            <Badge variant="secondary" className="ml-auto text-xs">
              {searchResults.totalCount} {searchResults.totalCount === 1 ? 'result' : 'results'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Fa icon={faSearch} className="text-muted-foreground text-sm" />
            </div>
            <Input
              type="text"
              name="search"
              id="searchInput"
              value={value}
              placeholder="Search for posts..."
              autoComplete="off"
              autoFocus={true}
              className={cn(
                "pl-10 pr-4 h-12",
                "border-border/50 focus:border-primary",
                "bg-background/50 focus:bg-background",
                "transition-all duration-200"
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value)
              }}
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setValue('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>

          <Separator />

          {/* Search Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fa icon={faFilter} className="text-muted-foreground text-sm" />
              <span className="text-sm font-medium text-muted-foreground">
                Search in:
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Toggle
                pressed={isTitleOnly}
                onPressedChange={setIsTitleOnly}
                variant="outline"
                size="sm"
                className={cn(
                  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                  "hover:bg-secondary/80 transition-all duration-200"
                )}
              >
                Title Only
              </Toggle>
              <Toggle
                pressed={!isTitleOnly}
                onPressedChange={(pressed) => setIsTitleOnly(!pressed)}
                variant="outline"
                size="sm"
                className={cn(
                  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                  "hover:bg-secondary/80 transition-all duration-200"
                )}
              >
                Title + Content
              </Toggle>
            </div>
          </div>

          {/* Search Status */}
          {value && (
            <div className={cn(
              "flex items-center justify-between p-3 rounded-md",
              "bg-secondary/30 border border-border/30"
            )}>
              <div className="flex items-center gap-2">
                <Badge variant={searchResults.totalCount > 0 ? "default" : "destructive"} className="text-xs">
                  {searchResults.totalCount > 0 ? 'Found' : 'No results'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {searchResults.totalCount > 0 
                    ? `${searchResults.totalCount} result${searchResults.totalCount !== 1 ? 's' : ''} found for "${value}"`
                    : `No results found for "${value}"`
                  }
                </span>
              </div>
              
              {searchResults.totalCount === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setValue('')}
                  className="text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results with Tabs */}
      <div className="search-results">
        {showingAllPosts ? (
          <div className="mb-4">
            <Badge variant="outline" className="text-xs">
              Showing all posts
            </Badge>
            <PostList posts={allPosts} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                <Fa icon={faList} className="text-xs" />
                <span>전체</span>
                <Badge variant="secondary" className="text-xs">
                  {searchResults.totalCount}
                </Badge>
              </TabsTrigger>
              
              <TabsTrigger value="posts" className="gap-2">
                <Fa icon={faFileText} className="text-xs" />
                <span>포스트</span>
                <Badge variant="secondary" className="text-xs">
                  {searchResults.posts.length}
                </Badge>
              </TabsTrigger>
              
              <TabsTrigger value="tags" className="gap-2">
                <Fa icon={faHashtag} className="text-xs" />
                <span>태그</span>
                <Badge variant="secondary" className="text-xs">
                  {searchResults.tags.length}
                </Badge>
              </TabsTrigger>
              
              <TabsTrigger value="categories" className="gap-2">
                <Fa icon={faFolder} className="text-xs" />
                <span>카테고리</span>
                <Badge variant="secondary" className="text-xs">
                  {searchResults.categories.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* All Results Tab */}
            <TabsContent value="all" className="mt-6">
              <div className="space-y-6">
                {/* Posts Section */}
                {searchResults.posts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Fa icon={faFileText} className="text-primary text-sm" />
                      <h3 className="text-lg font-semibold text-foreground">
                        포스트 ({searchResults.posts.length})
                      </h3>
                    </div>
                    <PostList posts={searchResults.posts} />
                  </div>
                )}

                {/* Tags Section */}
                {searchResults.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Fa icon={faHashtag} className="text-primary text-sm" />
                      <h3 className="text-lg font-semibold text-foreground">
                        태그 ({searchResults.tags.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {searchResults.tags.map((tag) => (
                        <Link key={tag.name} href={`/tags/${encodeURIComponent(tag.name)}`}>
                          <Card className={cn(
                            "p-4 hover:border-primary transition-all duration-200",
                            "hover:shadow-md cursor-pointer"
                          )}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Fa icon={faHashtag} className="text-green-500 text-sm" />
                                <span className="font-medium text-foreground">#{tag.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {tag.count}
                              </Badge>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories Section */}
                {searchResults.categories.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Fa icon={faFolder} className="text-primary text-sm" />
                      <h3 className="text-lg font-semibold text-foreground">
                        카테고리 ({searchResults.categories.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {searchResults.categories.map((category) => (
                        <Link key={category.name} href={`/?category=${encodeURIComponent(category.name)}`}>
                          <Card className={cn(
                            "p-4 hover:border-primary transition-all duration-200",
                            "hover:shadow-md cursor-pointer"
                          )}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Fa icon={faFolder} className="text-blue-500 text-sm" />
                                <span className="font-medium text-foreground">{category.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {category.count}
                              </Badge>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchResults.totalCount === 0 && (
                  <div className="text-center py-12">
                    <Fa icon={faSearch} className="text-4xl text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-muted-foreground">
                      다른 키워드로 검색해보세요
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Posts Only Tab */}
            <TabsContent value="posts" className="mt-6">
              {searchResults.posts.length > 0 ? (
                <PostList posts={searchResults.posts} />
              ) : (
                <div className="text-center py-12">
                  <Fa icon={faFileText} className="text-4xl text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    포스트 검색 결과가 없습니다
                  </h3>
                  <p className="text-muted-foreground">
                    다른 키워드로 검색해보세요
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tags Only Tab */}
            <TabsContent value="tags" className="mt-6">
              {searchResults.tags.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.tags.map((tag) => (
                    <Link key={tag.name} href={`/tags/${encodeURIComponent(tag.name)}`}>
                      <Card className={cn(
                        "p-6 hover:border-primary transition-all duration-200",
                        "hover:shadow-md cursor-pointer"
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Fa icon={faHashtag} className="text-green-500 text-lg" />
                            <span className="font-semibold text-foreground">#{tag.name}</span>
                          </div>
                          <Badge variant="secondary">
                            {tag.count} posts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          이 태그가 포함된 포스트들을 확인해보세요
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Fa icon={faHashtag} className="text-4xl text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    태그 검색 결과가 없습니다
                  </h3>
                  <p className="text-muted-foreground">
                    다른 키워드로 검색해보세요
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Categories Only Tab */}
            <TabsContent value="categories" className="mt-6">
              {searchResults.categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.categories.map((category) => (
                    <Link key={category.name} href={`/?category=${encodeURIComponent(category.name)}`}>
                      <Card className={cn(
                        "p-6 hover:border-primary transition-all duration-200",
                        "hover:shadow-md cursor-pointer"
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Fa icon={faFolder} className="text-blue-500 text-lg" />
                            <span className="font-semibold text-foreground">{category.name}</span>
                          </div>
                          <Badge variant="secondary">
                            {category.count} posts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          이 카테고리의 모든 포스트들을 확인해보세요
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Fa icon={faFolder} className="text-4xl text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    카테고리 검색 결과가 없습니다
                  </h3>
                  <p className="text-muted-foreground">
                    다른 키워드로 검색해보세요
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}