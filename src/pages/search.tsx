import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { getAllPosts } from '../lib/posts'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Post } from '../lib/posts'
import '@/styles/search.scss'

interface SearchPageProps {
  posts: Post[]
}

export default function SearchPage({ posts }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])

  useEffect(() => {
    const results = posts.filter((post) => {
      const searchContent = `
        ${post.frontmatter.title} 
        ${post.frontmatter.tags?.join(' ')} 
        ${post.excerpt}
      `.toLowerCase()

      return searchContent.includes(searchTerm.toLowerCase())
    })

    setSearchResults(results)
  }, [searchTerm, posts])

  return (
    <Layout>
      <div className="search-wrap">
        <h1>Search</h1>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="search-results">
          {searchTerm && (
            <h2>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </h2>
          )}
          <ul>
            {searchResults.map((post) => (
              <li key={post.fields.slug}>
                <Link href={`/${post.fields.slug}`}>
                  <h3>{post.frontmatter.title}</h3>
                </Link>
                {post.excerpt && <p>{post.excerpt}</p>}
                {post.frontmatter.tags && (
                  <div className="tags">
                    {post.frontmatter.tags.map((tag) => (
                      <Link key={tag} href={`/tags#${tag}`}>
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts()
  return {
    props: {
      posts
    }
  }
}
