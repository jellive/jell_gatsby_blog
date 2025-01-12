import { useQuery } from '@apollo/client'
import { GET_POSTS } from '@/lib/queries'
import Link from 'next/link'
import Markdown from 'markdown-to-jsx'
import './postlist.scss'

export default function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  if (loading) return <div>Loading posts...</div>
  if (error) {
    console.error('PostList query error:', error)
    return <div>Error loading posts: {error.message}</div>
  }

  const posts = data?.allMarkdownRemark?.edges || []

  return (
    <div className="post-list">
      <ul>
        {posts.map(({ node }: any) => {
          return (
            <li key={node.id} className="post">
              <article>
                <h2 className="title">
                  <Link href={node.fields.slug}>{node.frontmatter.title}</Link>
                </h2>
                <div className="info">
                  <span className="date">
                    {new Date(node.frontmatter.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {node.frontmatter.tags?.length > 0 && (
                    <>
                      <span className="info-dot">·</span>
                      <ul className="tag-list">
                        {node.frontmatter.tags.map((tag: string) => (
                          <li key={`${node.fields.slug}-${tag}`} className="tag">
                            <span>
                              <Link href={`/tags#${tag}`}>{`#${tag}`}</Link>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                {node.excerpt && <div className="excerpt">{node.excerpt}</div>}
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
