import React from 'react'
import Layout from '../components/layout'
import { ITemplateProps } from '../interface'


type iPostTemplateProps = ITemplateProps<{
    html: string
    title: string
}>

const PostTemplate: React.FC<iPostTemplateProps> = React.memo(props => {
    return (
        <Layout>
            <code>
                <pre>{JSON.stringify(props, null, 4)}</pre>
            </code>
        </Layout>
    )
})

PostTemplate.displayName = 'PostTemplate'

export default PostTemplate