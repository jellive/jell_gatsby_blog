import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts {
    allMarkdownRemark {
      edges {
        node {
          id
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            tags
            category
          }
        }
      }
      group {
        fieldValue
        totalCount
      }
    }
  }
`

export const GET_POSTS_WITH_CONTENT = gql`
  query GetPostsWithContent {
    allMarkdownRemark {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date
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
      group {
        fieldValue
        totalCount
        edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date
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
