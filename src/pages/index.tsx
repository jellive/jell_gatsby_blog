import * as React from 'react'
import { GetStaticProps } from 'next'
import { initializeApollo } from '../lib/apollo'
import { GET_POSTS } from '@/lib/queries'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Bio from '../components/Bio'
import '@/styles/pages/index.scss'
import PostList from '../components/PostList'

interface IndexPageProps {
  posts: Array<{
    node: {
      id: string
      excerpt: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        date: string
        tags: string[]
        category: string
      }
    }
  }>
}

export default function IndexPage({ posts }: IndexPageProps) {
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

  try {
    const { data } = await apolloClient.query({
      query: GET_POSTS
    })

    console.log('GraphQL Response:', JSON.stringify(data, null, 2))

    if (!data?.allMarkdownRemark?.edges) {
      console.error('No posts found in GraphQL response')
      return {
        props: {
          posts: [],
          initialApolloState: apolloClient.cache.extract()
        }
      }
    }

    const posts = data.allMarkdownRemark.edges.map((edge: any) => ({
      node: {
        id: edge.node.id,
        excerpt: edge.node.excerpt || '',
        fields: {
          slug: edge.node.fields.slug
        },
        frontmatter: {
          title: edge.node.frontmatter.title,
          date: edge.node.frontmatter.date,
          tags: edge.node.frontmatter.tags || [],
          category: edge.node.frontmatter.category
        }
      }
    }))

    console.log('Processed posts:', JSON.stringify(posts, null, 2))

    return {
      props: {
        posts,
        initialApolloState: apolloClient.cache.extract()
      },
      revalidate: 1
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      props: {
        posts: [],
        initialApolloState: apolloClient.cache.extract()
      }
    }
  }
}
