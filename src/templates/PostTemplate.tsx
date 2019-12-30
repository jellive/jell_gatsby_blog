import React from 'react'
import Layout from '../components/layout'
import { ITemplateProps } from '../interface'
import { Disqus, CommentCount } from 'gatsby-plugin-disqus'
import { siteMetadata } from '../../gatsby-config'


type iPostTemplateProps = ITemplateProps<{
    html: string
    title: string
    date: string
    slug: Object
}>

const PostTemplate: React.FC<iPostTemplateProps> = React.memo(props => {
    const { title, date, html } = props.pageContext;
    let disqusConfig = {
      url: `${siteMetadata.siteUrl+location.pathname}`,
      identifier: "jell-1",
      title: title,
    }
    return (
        <Layout>
            <h2>{title}</h2>
            <h4>{date}</h4>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <CommentCount config={disqusConfig} placeholder={'...'} />
            <Disqus config={disqusConfig} />
        </Layout>
    )
})

PostTemplate.displayName = 'PostTemplate'

export default PostTemplate