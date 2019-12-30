import * as React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import { Card, CardContent, Chip } from '@material-ui/core';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }

    allMarkdownRemark: {
      edges: {
        node: {
          excerpt: string
          frontmatter: {
            title: string
            date(formatString: "MMMM DD, YYYY"): string
            path: string
            tags: string[]
            category: string
            featuredImage: {
              publicURL: string
              childImageSharp: {
                sizes: any
              }
            }
          }
          fields: {
            slug: string
          }
        }
      }[]
    }
  }
}

export default class extends React.Component<IndexPageProps, {}> {
  constructor(props: IndexPageProps, context: any) {
    super(props, context)
  }
  public render() {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>Be the jell.</h1>
        <h3 style={{ textAlign: "center", color: '#777' }}>이것저것 해보는 블로그입니다.</h3>
        <Card>
          <CardContent>
            {
              this.props.data.allMarkdownRemark.edges.map(edge => (
                <div style={{ padding: 15 }}>
                  <Card key={edge.node.frontmatter.title}>
                    <CardContent>
                      <h3 style={{ marginBottom: 10 }}>
                        <Link to={edge.node.fields.slug}>
                          [{edge.node.frontmatter.category}]{" "}
                          {edge.node.frontmatter.title}{" "}
                          <span style={{ color: '#bbb' }}>
                            {"- "}{edge.node.frontmatter.date}
                          </span>
                        </Link>
                      </h3><br />
                      {
                        edge.node.frontmatter.featuredImage
                        // && <img style={{ margin: 'auto' }} src={edge.node.frontmatter.featuredImage.publicURL} />
                        && <Img sizes={edge.node.frontmatter.featuredImage.childImageSharp.sizes} />
                      }
                      <p
                        style={{ fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif" }}
                        dangerouslySetInnerHTML={{ __html: edge.node.excerpt }}
                      />
                      <p style={{ fontSize: 12 }}>Tag:{" "}
                        {edge.node.frontmatter.tags.map(tag => (
                          <Chip label={tag} style={{ fontSize: 12 }} />
                        ))}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </>
    )
  }
}

export const pageQuery = graphql`
  query GameQuery {
    allMarkdownRemark (
      filter: {frontmatter: {category: {eq: "Game"}}}
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
                  sizes(maxWidth: 630, maxHeight: 360) {
                      srcSet
                      ...GatsbyImageSharpSizes
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
`
