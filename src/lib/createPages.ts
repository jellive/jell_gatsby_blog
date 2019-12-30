import { CreatePagesArgs } from "gatsby"
import path from 'path'
import { Query } from '../graphql-types'

// const pages = [
//     { id: 1, content: 'Gatsby 로 블로그 만들기' },
//     { id: 2, content: '거기에 타입스크립트 적용 해 보기' },
//     { id: 3, content: '확실히 어렵네요' }
// ]

export async function createPages ({ actions, graphql }: CreatePagesArgs) {
  const { createPage } = actions
  const { data, errors } = await graphql<Query>(`
    {
      allMarkdownRemark {
        edges {
          node {
            html
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)
    if (errors) throw errors

    data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/PostTemplate.tsx'),
          context: {
              ...node,
              // Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,
          },
      })
    })
}