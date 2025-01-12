import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'
import { getAllPosts } from '@/lib/posts'

const typeDefs = gql`
  type PostFields {
    slug: String!
  }

  type PostFrontmatter {
    date: String!
    title: String!
    tags: [String!]!
    featuredImage: String
    category: String
  }

  type Post {
    id: String!
    excerpt(length: Int): String!
    fields: PostFields!
    frontmatter: PostFrontmatter!
    rawMarkdownBody: String!
  }

  type GroupEdge {
    node: Post!
  }

  type Group {
    fieldValue: String!
    totalCount: Int!
    edges: [GroupEdge!]!
  }

  type MarkdownRemark {
    edges: [GroupEdge!]!
    group: [Group!]!
  }

  type Query {
    allMarkdownRemark: MarkdownRemark!
  }
`

const resolvers = {
  Query: {
    allMarkdownRemark: async () => {
      try {
        const posts = await getAllPosts()
        console.log('Posts loaded:', posts.length)

        const edges = posts.map((post) => ({
          node: {
            id: post.fields.slug,
            excerpt:
              post.rawMarkdownBody
                .replace(/!\[.*?\]\(.*?\)/g, '')
                .replace(/<[^>]*>/g, '')
                .replace(/[#*`_~]/g, '')
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 300) + '...',
            fields: post.fields,
            frontmatter: {
              ...post.frontmatter,
              date: new Date(post.frontmatter.date).toISOString()
            },
            rawMarkdownBody: post.rawMarkdownBody
          }
        }))

        const tagGroups = posts.reduce((acc, post) => {
          post.frontmatter.tags.forEach((tag) => {
            if (!acc[tag]) {
              acc[tag] = {
                fieldValue: tag,
                totalCount: 0,
                edges: []
              }
            }
            acc[tag].totalCount++
            acc[tag].edges.push({
              node: {
                id: post.fields.slug,
                excerpt: post.rawMarkdownBody.slice(0, 200),
                fields: post.fields,
                frontmatter: {
                  ...post.frontmatter,
                  date: new Date(post.frontmatter.date).toISOString()
                },
                rawMarkdownBody: post.rawMarkdownBody
              }
            })
          })
          return acc
        }, {} as Record<string, any>)

        const result = {
          edges,
          group: Object.values(tagGroups)
        }

        console.log('GraphQL response:', {
          edgesCount: edges.length,
          groupCount: Object.keys(tagGroups).length,
          samplePost: edges[0]?.node.frontmatter
        })

        return result
      } catch (error) {
        console.error('GraphQL resolver error:', error)
        throw error
      }
    }
  },
  Post: {
    excerpt: (parent: any, args: { length?: number }) => {
      if (!args.length) return parent.excerpt
      return parent.excerpt.slice(0, args.length)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

export default startServerAndCreateNextHandler(server)
