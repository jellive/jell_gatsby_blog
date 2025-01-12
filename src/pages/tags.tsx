import { GetStaticProps } from 'next'
import { getAllPosts } from '../lib/posts'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Post } from '../lib/posts'
import '@/styles/tags.scss'

interface TagsPageProps {
  tags: {
    [key: string]: Post[]
  }
}

export default function TagsPage({ tags }: TagsPageProps) {
  return (
    <Layout>
      <div className="tags-wrap">
        <h1>Tags</h1>
        {Object.entries(tags).map(([tag, posts]) => (
          <div key={tag} className="tag-group">
            <h2>
              {tag} ({posts.length})
            </h2>
            <ul>
              {posts.map((post) => (
                <li key={post.fields.slug}>
                  <Link href={`/${post.fields.slug}`}>{post.frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts()
  const tags: { [key: string]: Post[] } = {}

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => {
      if (!tags[tag]) {
        tags[tag] = []
      }
      tags[tag].push(post)
    })
  })

  // 태그별로 정렬
  const sortedTags = Object.fromEntries(Object.entries(tags).sort(([a], [b]) => a.localeCompare(b)))

  return {
    props: {
      tags: sortedTags
    }
  }
}
