import { GetStaticPaths, GetStaticProps } from 'next'
import { getAllPosts } from '../lib/posts'
import Layout from '../components/Layout'
import AdSense from 'react-adsense'
import { DiscussionEmbed } from 'disqus-react'
import config from '../../config'
import '@/styles/markdown.scss'
import Markdown from 'markdown-to-jsx'
import Toc from '@/components/Toc'
import { useState, useEffect } from 'react'

interface PostPageProps {
  post: {
    frontmatter: {
      title: string
      date: string
      tags?: string[]
    }
    fields: {
      slug: string
    }
    rawMarkdownBody: string
  }
}

export default function PostPage({ post }: PostPageProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; title: string; level: number }>>([])

  useEffect(() => {
    // 마크다운 내용에서 헤딩 추출
    const extractHeadings = () => {
      const content = document.querySelector('.markdown-content')
      if (!content) return []

      const headingElements = Array.from(content.querySelectorAll('h1, h2, h3'))

      // 헤딩에 ID 추가
      const headings = headingElements.map((heading) => {
        const title = heading.textContent || ''
        const id = heading.id || title.toLowerCase().replace(/\s+/g, '-')
        heading.id = id
        return {
          id,
          title,
          level: parseInt(heading.tagName[1])
        }
      })

      setHeadings(headings)
    }

    extractHeadings()
  }, [post.rawMarkdownBody])

  if (!post) return null

  const disqusConfig = {
    shortname: config.disqusShortname,
    config: {
      url: `${config.siteUrl}/${post.fields.slug}`,
      identifier: post.fields.slug,
      title: post.frontmatter.title
    }
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <Layout>
      <article className="post-content">
        <h1>{post.frontmatter.title}</h1>
        <div className="post-meta">
          <span>{post.frontmatter.date}</span>
          {post.frontmatter.tags && (
            <div className="tags">
              {post.frontmatter.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="markdown-content">
          <Markdown
            options={{
              overrides: {
                h1: {
                  component: ({ children, ...props }) => (
                    <h1 {...props} id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
                      {children}
                    </h1>
                  )
                },
                h2: {
                  component: ({ children, ...props }) => (
                    <h2 {...props} id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
                      {children}
                    </h2>
                  )
                },
                h3: {
                  component: ({ children, ...props }) => (
                    <h3 {...props} id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
                      {children}
                    </h3>
                  )
                },
                img: {
                  component: ({ alt, src }) => {
                    console.log('Image source:', src)

                    // 외부 URL인 경우 일반 img 태그 사용
                    if (src.startsWith('http')) {
                      return <img alt={alt} src={src} style={{ maxWidth: '100%' }} className="markdown-image" />
                    }

                    console.log('src', src)
                    // 이미지 경로 처리
                    const postDir = post.fields.slug.split('/').slice(0, -1).join('/')
                    const imageName = src.split('/').pop()
                    const imagePath = `/posts/${postDir}/images/${imageName}`

                    console.log('Final image path:', imagePath)

                    return (
                      <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
                        <img
                          alt={alt || ''}
                          src={imagePath}
                          style={{ maxWidth: '100%', height: 'auto' }}
                          className="markdown-image"
                        />
                      </div>
                    )
                  }
                }
              }
            }}
          >
            {post.rawMarkdownBody}
          </Markdown>
        </div>

        {headings.length > 0 && (
          <div className="toc-container">
            <Toc headings={headings} />
          </div>
        )}

        {config.googleAdsenseClient && config.googleAdsenseSlot && (
          <div className="adsense-container" style={{ minHeight: '100px' }}>
            {!isDevelopment ? (
              <AdSense.Google
                client={config.googleAdsenseClient}
                slot={config.googleAdsenseSlot}
                style={{ display: 'block' }}
                format="auto"
                responsive="true"
              />
            ) : (
              <div
                style={{
                  background: '#f0f0f0',
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#666'
                }}
              >
                AdSense (Development Mode)
              </div>
            )}
          </div>
        )}
        {config.disqusShortname && (
          <div className="comments">
            <DiscussionEmbed {...disqusConfig} />
          </div>
        )}
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts()

  const paths = posts.map((post) => ({
    params: {
      slug: post.fields.slug.split('/').filter(Boolean)
    }
  }))

  console.log('Generated paths:', paths.length)

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const posts = await getAllPosts()
    const slug = (params?.slug as string[]).join('/')
    const post = posts.find((p) => p.fields.slug.includes(slug))

    if (!post) {
      console.log('Post not found:', slug)
      return { notFound: true }
    }

    console.log('Found post:', post.frontmatter.title)

    return {
      props: {
        post
      }
    }
  } catch (error) {
    console.error('getStaticProps error:', error)
    return { notFound: true }
  }
}
