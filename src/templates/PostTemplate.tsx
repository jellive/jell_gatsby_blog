import React from 'react'
import Layout from '../components/layout'
import { ITemplateProps } from '../interface'


type iPostTemplateProps = ITemplateProps<{
    html: string
    title: string
}>

const PostTemplate: React.FC<iPostTemplateProps> = React.memo(props => {
    const { title, date, html } = props.pageContext;
    return (
        <Layout>
            <h2>{title}</h2>
            <h4>{date}</h4>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </Layout>
    )
})

PostTemplate.displayName = 'PostTemplate'

export default PostTemplate