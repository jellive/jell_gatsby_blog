'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { PostData } from '@/lib/markdown'
import PostList from '@/components/PostList'

interface SearchInteractiveProps {
  allPosts: PostData[]
}

export default function SearchInteractive({ allPosts }: SearchInteractiveProps) {
  const [value, setValue] = useState('')
  const [isTitleOnly, setIsTitleOnly] = useState(true)

  const filteredPosts = allPosts.filter((post: PostData) => {
    const { frontMatter, content } = post
    const { title } = frontMatter
    const lowerValue = value.toLowerCase()

    if (!isTitleOnly && content.toLowerCase().indexOf(lowerValue) > -1) {
      return true
    }

    return title.toLowerCase().indexOf(lowerValue) > -1
  })

  return (
    <div id="Search">
      <div className="search-inner-wrap">
        <div className="input-wrap">
          <Fa icon={faSearch} />
          <input
            type="text"
            name="search"
            id="searchInput"
            value={value}
            placeholder="Search"
            autoComplete="off"
            autoFocus={true}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setValue(e.currentTarget.value)
            }}
          />
          <div className="search-toggle">
            <span
              style={{ opacity: isTitleOnly ? 0.8 : 0.15 }}
              onClick={() => {
                setIsTitleOnly(true)
              }}
            >
              in Title
            </span>
            <span
              style={{ opacity: !isTitleOnly ? 0.8 : 0.15 }}
              onClick={() => {
                setIsTitleOnly(false)
              }}
            >
              in Title+Content
            </span>
          </div>
        </div>

        {value !== '' && !filteredPosts.length ? (
          <span className="no-result">No search results</span>
        ) : null}
        
        <PostList posts={value === '' ? allPosts : filteredPosts} />
      </div>
    </div>
  )
}