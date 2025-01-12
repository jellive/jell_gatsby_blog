import { useQuery } from '@apollo/client'
import { GET_POSTS } from '@/lib/queries'
import Link from 'next/link'
import './postlist.scss'

interface PostListProps {
  posts: Array<{
    node: {
      id: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        date: string
        tags?: string[]
      }
      excerpt?: string
    }
  }>
}

export default function PostList({ posts }: PostListProps) {
  const { loading, error, data } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  if (loading) return <div>Loading posts...</div>
  if (error) {
    console.error('PostList query error:', error)
    return <div>Error loading posts: {error.message}</div>
  }

  const allPosts = posts || data?.allMarkdownRemark?.edges || []

  return (
    <div className="post-list">
      <ul>
        {allPosts.map(({ node }) => {
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
                  {node.frontmatter.tags && node.frontmatter.tags?.length > 0 && (
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
