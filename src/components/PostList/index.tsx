import React from 'react'
import Link from 'next/link'

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

  const mapPost = posts.map((post: Post) => {
    const { slug, frontMatter, excerpt } = post
    const { date, title, tags } = frontMatter

    // Format date like original Gatsby format (MMM DD, YYYY)
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })

    const mapTag = tags.map((tag: string) => {
      if (tag === 'undefined') return null

      return (
        <li key={`${slug}-${tag}`} className="tag">
          <span>
            <Link href={`/tags#${encodeURIComponent(tag)}`}>{`#${tag}`}</Link>
          </span>
        </li>
      )
    }).filter(Boolean) // Remove null values

    return (
      <li key={slug} className="post">
        <article>
          <h2 className="title">
            <Link href={`/posts/${encodeURIComponent(slug)}`}>{title}</Link>
          </h2>
          <div className="info">
            <span className="date">{formattedDate}</span>
            {tags.length && tags[0] !== 'undefined' ? <span className="info-dot">·</span> : null}
            <ul className="tag-list">{mapTag}</ul>
          </div>
          {excerpt && <span className="excerpt">{excerpt}</span>}
        </article>
      </li>
    )
  })

  return (
    <div className="post-list">
      <ul>{mapPost}</ul>
    </div>
  )
}

export default PostList