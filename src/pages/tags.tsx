import * as React from 'react'
import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import './styles/tags.scss'
import PostList from '../components/PostList'
import { initializeApollo } from '../lib/apollo'
import { GET_TAGS } from '../lib/queries'

interface TagsPageProps {
  group: any[]
}

export default function Tags({ group }: TagsPageProps) {
  const [largeCount, setLargeCount] = useState(0)
  const [targetTag, setTargetTag] = useState('undefined')

  interface GroupItem {
    fieldValue: string
    totalCount: number
    edges: any[]
  }

  useEffect(() => {
    let large = 0
    for (const g of group) {
      if (g.fieldValue !== 'undefined' && g.totalCount > large) large = g.totalCount
    }
    setLargeCount(large)
  }, [group])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      setTargetTag(window.location.hash.split('#')[1])
    }
  }, [])

  const getPostList = () => {
    if (group.filter((g: GroupItem) => g.fieldValue === targetTag).length) {
      return group.filter((g: GroupItem) => g.fieldValue === targetTag)[0].edges
    }
    if (group.filter((g: GroupItem) => g.fieldValue === 'undefined').length) {
      return group.filter((g: GroupItem) => g.fieldValue === 'undefined')[0].edges
    }
    return []
  }

  const tagList = group
    .sort((a: GroupItem, b: GroupItem) => {
      const x = a.fieldValue.toLocaleLowerCase()
      const y = b.fieldValue.toLocaleLowerCase()
      if (x < y) return -1
      if (y < x) return 1
      return 0
    })
    .map((g: GroupItem) => {
      const getFontSize = () => {
        let fontSize = Math.round(50 / (largeCount / g.totalCount)).toString()
        if (fontSize.length <= 1) fontSize = `0${fontSize}`
        return `1.${fontSize}rem`
      }

      return (
        <li key={g.fieldValue}>
          <span
            className="tag-text"
            style={{
              fontSize: g.fieldValue !== 'undefined' ? getFontSize() : '1rem',
              opacity: g.fieldValue === targetTag ? '0.9' : '0.5',
              fontWeight: g.fieldValue === targetTag ? 'bold' : 'normal'
            }}
            onClick={() => setTargetTag(g.fieldValue)}
          >
            <a href={`#${g.fieldValue}`}>{g.fieldValue}</a>
          </span>
        </li>
      )
    })
    .sort((a: React.ReactElement) => (a.key === 'undefined' ? -1 : 0))

  return (
    <Layout>
      <SEO title="Tags" />
      <div id="tags">
        <div className="tag-list-wrap">
          <ul>{tagList}</ul>
        </div>
        <PostList posts={getPostList()} />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo()

  const data = {
    allMarkdownRemark: {
      group: [
        {
          fieldValue: 'react',
          totalCount: 1,
          edges: [
            /* post 1 */
          ]
        },
        {
          fieldValue: 'nextjs',
          totalCount: 1,
          edges: [
            /* post 1 */
          ]
        },
        {
          fieldValue: 'javascript',
          totalCount: 1,
          edges: [
            /* post 2 */
          ]
        },
        {
          fieldValue: 'typescript',
          totalCount: 1,
          edges: [
            /* post 2 */
          ]
        }
      ]
    }
  }

  return {
    props: {
      group: data.allMarkdownRemark.group,
      initialApolloState: apolloClient.cache.extract()
    }
  }
}
