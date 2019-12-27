import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

// import { LatestPostListQuery } from '../graphql'
import { Query } from "../graphql-types"

const IndexPage: React.FC = () => {
  const data = useStaticQuery<Query>(graphql`
  query LatestPostListQuery {
      allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
          edges {
              node {
                  excerpt(truncate: true, pruneLength: 200)
                  frontmatter {
                      title
                      path
                      date(formatString: "YYYY-MM-DD HH:mm:ss")
                  }
                  id
              }
          }
      }
  }
  `)

  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Home" />
      {/* <h1>리뉴얼!</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link> */}
      {/* <div>
        {edges.map(edge => {
          <p>{JSON.stringify(edge.node.frontmatter)}</p>
        })}
      </div>
        <p>{JSON.stringify(data)}</p> */}


      <h1>최근 작성한 게시글 목록</h1>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <h2>
              <Link to={node.frontmatter.title}>{node.frontmatter.title}</Link>
            </h2>
            <h3>{node.frontmatter.date}</h3>
            <p>{node.excerpt}</p>
            <hr />
          </li>
        ))}
      </ul>
    </Layout>
  )
}



export default IndexPage
