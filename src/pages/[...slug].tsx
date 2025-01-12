import { GetStaticPaths, GetStaticProps } from 'next'
import { getAllPosts } from '../lib/posts'
import Layout from '../components/Layout'
import AdSense from 'react-adsense'
import { DiscussionEmbed } from 'disqus-react'
import config from '../../config'
import '@/styles/markdown.scss'
import Markdown from 'markdown-to-jsx'

interface PostPageProps {
  post: {
    frontmatter: {
      title: string
    }
    fields: {
      slug: string
    }
    rawMarkdownBody: string
  }
}

export default function PostPage({ post }: PostPageProps) {
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
        <div className="markdown-content">
          <Markdown
            options={{
              overrides: {
                img: {
                  component: ({ alt, src }) => {
                    const imageSrc = src.includes('images/')
                      ? `/images/dev/js/tip/2024/08/06/yarn을 npm으로 전역설치 했을 때 업데이트 하는 방법/${src.replace(
                          'images/',
                          ''
                        )}`
                      : src
                    return <img alt={alt} src={imageSrc} style={{ maxWidth: '100%' }} className="markdown-image" />
                  }
                }
              }
            }}
          >
            {post.rawMarkdownBody}
          </Markdown>
        </div>
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
