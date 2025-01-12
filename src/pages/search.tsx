import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import React from 'react'
import { GetStaticProps } from 'next'

import Layout from '../components/Layout'
import PostList from '../components/PostList'
import SEO from '../components/seo'
import { useSearchStore } from '../store'
import './styles/search.scss'
import { initializeApollo } from '../lib/apollo'
import { GET_POSTS_WITH_CONTENT } from '../lib/queries'

interface SearchProps {
  posts: any[]
}

export default function Search({ posts }: SearchProps) {
  const { value, isTitleOnly, setValue, setIsTitleOnly } = useSearchStore()

  const filteredPosts = posts.filter((post: any) => {
    const { node } = post
    const { frontmatter, rawMarkdownBody } = node
    const { title } = frontmatter
    const lowerValue = value.toLocaleLowerCase()

    if (!isTitleOnly && rawMarkdownBody.toLocaleLowerCase().indexOf(lowerValue) > -1) {
      return true
    }

    return title.toLocaleLowerCase().indexOf(lowerValue) > -1
  })

  return (
    <Layout>
      <SEO title="Search" />
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
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="search-toggle">
              <span style={{ opacity: isTitleOnly ? 0.8 : 0.15 }} onClick={() => setIsTitleOnly(true)}>
                in Title
              </span>
              <span style={{ opacity: !isTitleOnly ? 0.8 : 0.15 }} onClick={() => setIsTitleOnly(false)}>
                in Title+Content
              </span>
            </div>
          </div>

          {value !== '' && !filteredPosts.length ? <span className="no-result">No search results</span> : null}
          <PostList posts={value === '' ? posts : filteredPosts} />
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo()

  const data = {
    allMarkdownRemark: {
      edges: [
        {
          node: {
            excerpt: 'This is a sample excerpt...',
            fields: {
              slug: '/sample-post-1'
            },
            frontmatter: {
              date: 'Mar 15, 2024',
              title: 'Sample Post 1',
              tags: ['react', 'nextjs']
            },
            rawMarkdownBody: 'This is the full content of sample post 1...'
          }
        },
        {
          node: {
            excerpt: 'Another sample excerpt...',
            fields: {
              slug: '/sample-post-2'
            },
            frontmatter: {
              date: 'Mar 10, 2024',
              title: 'Sample Post 2',
              tags: ['javascript', 'typescript']
            },
            rawMarkdownBody: 'This is the full content of sample post 2...'
          }
        }
      ]
    }
  }

  return {
    props: {
      posts: data.allMarkdownRemark.edges,
      initialApolloState: apolloClient.cache.extract()
    }
  }
}
