import * as React from 'react'
import { GetStaticProps } from 'next'
import { initializeApollo } from '../lib/apollo'
// import { GET_POSTS } from '../lib/queries'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Bio from '../components/Bio'
import './styles/index.scss'
import PostList from '../components/PostList'

interface IndexPageProps {
  posts: any[]
  initialApolloState: any
}

export default function IndexPage({
  posts
}: // initialApolloState
IndexPageProps) {
  return (
    <Layout>
      <SEO title="Home" />
      <div className="index-wrap">
        <Bio />
        <div className="index-post-list-wrap">
          <PostList posts={posts} />
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
            }
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
            }
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
