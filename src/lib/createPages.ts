import { CreatePagesArgs } from "gatsby"
import path from 'path'
import { Query } from '../graphql-types'

const pages = [
    { id: 1, content: 'Gatsby 로 블로그 만들기' },
    { id: 2, content: '거기에 타입스크립트 적용 해 보기' },
    { id: 3, content: '확실히 어렵네요' }
]

export const createPages = async ({ actions, graphql }: CreatePagesArgs) => {
    console.log('I will create a page!')
    console.log('Typescript!')
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
            }
          }
        }
      }
    `)

    if (errors) throw errors

    data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.frontmatter.title,
            context: {
                html: node.html,
                title: node.frontmatter.title
            },
            component: path.resolve(__dirname, '../templates/PostTemplate.tsx')
        })
    })

    // pages.forEach(page => {
    //     createPage({
    //         path: page.id.toString(),
    //         context: page,
    //         component: path.resolve(__dirname, '../templates/PostTemplate.tsx')
    //     })
    // })
}