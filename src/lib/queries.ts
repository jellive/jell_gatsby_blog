import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts {
    allMarkdownRemark {
      edges {
        node {
          id
          excerpt(length: 200)
          fields {
            slug
          }
          frontmatter {
            date
            title
            category
            tags
            featuredImage
          }
          rawMarkdownBody
        }
      }
      group {
        fieldValue
        totalCount
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              title
              date
              tags
            }
          }
        }
      }
    }
  }
`

export const GET_POSTS_WITH_CONTENT = gql`
  query GetPostsWithContent {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          excerpt(format: PLAIN)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            title
            tags
            featuredImage
          }
          rawMarkdownBody
        }
      }
    }
  }
`

export const GET_TAGS = gql`
  query GetTags {
    allMarkdownRemark {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
        edges {
          node {
            excerpt(format: PLAIN)
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMM DD, YYYY")
              title
              tags
              featuredImage
            }
          }
        }
      }
    }
  }
`
