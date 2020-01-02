import React from 'react'
import Layout from '../components/layout'
import { ITemplateProps } from '../interface'
import { Disqus, CommentCount } from 'gatsby-plugin-disqus'
import { siteMetadata } from '../../gatsby-config'
import { Card, CardContent, Chip, Typography } from '@material-ui/core';
import './PostTemplates.css'


type iPostTemplateProps = ITemplateProps<{
    html: string
    frontmatter: Object
    slug: Object
}>

const PostTemplate: React.FC<iPostTemplateProps> = React.memo(props => {
    const { frontmatter, html } = props.pageContext;
    let disqusConfig = {
    //   url: `${siteMetadata.siteUrl+location.pathname}`,
      id: "disqus_thread",
      identifier: frontmatter.title,
      title: frontmatter.title,
      shortname: 'jell-1'
    }
    return (
        <Layout>
            <Card>
            <CardContent>
                <h2>{frontmatter.title}</h2>
                <h4>{frontmatter.date}</h4>
                <hr />
                <Typography>
                <div dangerouslySetInnerHTML={{ __html: html }} />
                </Typography>
                {/* <CommentCount config={disqusConfig} placeholder={'...'} /> */}
                <Disqus config={disqusConfig} />
            </CardContent>
            </Card>
        </Layout>
    )
})

PostTemplate.displayName = 'PostTemplate'

export default PostTemplate