import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from 'gatsby-image'
import {Link} from 'gatsby-theme-material-ui'

import Layout from "../components/layout"
import SEO from "../components/seo"

import { Typography } from '@material-ui/core'

// import { LatestPostListQuery } from '../graphql'
import { Query } from "../graphql-types"

const IndexPage: React.FC = () => {
  const data = useStaticQuery<Query>(graphql`
  query LatestPostListQuery {
    allMarkdownRemark (
      sort: {fields: [frontmatter___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            # Assumes you're using title in your frontmatter.
            title
            date(formatString: "MMMM DD, YYYY")
            tags
            category
            featuredImage {
              publicURL
              childImageSharp{
                  fluid(maxWidth: 630, maxHeight: 360) {
                      srcSet
                      ...GatsbyImageSharpFluid
                  }
              }
            }
          }
          excerpt(pruneLength: 250)
          fields {
            slug
          }
        }
      }
    }
    site {
      siteMetadata {
        title
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
              {/* <Link to={node.frontmatter.title}>{node.frontmatter.title}</Link> */}
              <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
            </h2>
            <h3>{node.frontmatter.date}</h3>
            {
              node.frontmatter.featuredImage && node.frontmatter.featuredImage.src
              // && <img style={{ margin: 'auto' }} src={edge.node.frontmatter.featuredImage.publicURL} />
              && <Img sizes={node.frontmatter.featuredImage.childImageSharp.sizes} />
            }
            <Typography>{node.excerpt}</Typography>
            <hr />
          </li>
        ))}
      </ul>
    </Layout>
  )
}



export default IndexPage
