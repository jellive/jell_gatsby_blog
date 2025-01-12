import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { getAllPosts } from '../lib/posts'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Post } from '../lib/posts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '@/styles/search.scss'

interface SearchPageProps {
  posts: Post[]
}

export default function SearchPage({ posts }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [searchInContent, setSearchInContent] = useState(false)

  useEffect(() => {
    const results = posts.filter((post) => {
      const searchContent = searchInContent
        ? `${post.frontmatter.title} ${post.frontmatter.tags?.join(' ')} ${post.excerpt}`
        : post.frontmatter.title
      return searchContent.toLowerCase().includes(searchTerm.toLowerCase())
    })

    setSearchResults(results)
  }, [searchTerm, searchInContent, posts])

  return (
    <Layout>
      <div className="search-wrap">
        <div className="input-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            name="search"
            id="searchInput"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <div className="search-toggle" onClick={() => setSearchInContent(!searchInContent)}>
            <span style={{ opacity: searchInContent ? 0.15 : 0.8 }}>in Title</span>
            <span style={{ opacity: searchInContent ? 0.8 : 0.15 }}>in Title+Content</span>
          </div>
        </div>

        <div className="search-results">
          {searchResults.map((post) => (
            <div key={post.fields.slug} className="post-item">
              <Link href={`/${post.fields.slug}`}>
                <h2>{post.frontmatter.title}</h2>
              </Link>
              {post.excerpt && <p>{post.excerpt}</p>}
            </div>
          ))}
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
