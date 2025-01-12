import { useState } from 'react'
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // 태그의 사용 빈도에 따라 폰트 크기 계산
  const getTagSize = (count: number) => {
    const baseSize = 1
    const maxSize = 1.5
    const scale = 0.1
    return Math.min(baseSize + count * scale, maxSize)
  }

  const sortedTags = Object.entries(tags).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Layout>
      <div className="tags-wrap">
        <ul>
          {sortedTags.map(([tag, posts]) => (
            <li key={tag}>
              <span
                className="tag-text"
                style={{
                  fontSize: `${getTagSize(posts.length)}rem`,
                  opacity: selectedTag === tag ? 0.9 : 0.5,
                  fontWeight: selectedTag === tag ? 'bold' : 'normal'
                }}
              >
                <a href={`#${tag}`} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}>
                  {tag}
                </a>
              </span>
            </li>
          ))}
        </ul>

        {selectedTag && (
          <div className="selected-tag-posts">
            <h2>{selectedTag}</h2>
            <ul>
              {tags[selectedTag].map((post) => (
                <li key={post.fields.slug}>
                  <Link href={`/${post.fields.slug}`}>{post.frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
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
