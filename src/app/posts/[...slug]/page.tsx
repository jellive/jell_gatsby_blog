import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import PostContent from '@/components/PostContent'
import StructuredData from '@/components/StructuredData'

interface PostPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({
    slug: post.slug.split('/'),
  }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  // URL decode each slug segment to handle encoded paths like dev%2Fblog
  const decodedSlug = resolvedParams.slug
    .map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch (error) {
        console.warn('Failed to decode URL segment:', segment, error)
        return segment
      }
    })
    .join('/')

  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const postUrl = `${siteConfig.siteUrl}/posts/${resolvedParams.slug.join('/')}`
  const description = post.content.substring(0, 160).replace(/\n/g, ' ').trim()
  const excerpt =
    description.length > 155
      ? description.substring(0, 155) + '...'
      : description

  return {
    title: `${post.frontMatter.title} | ${siteConfig.title}`,
    description: excerpt,
    keywords: post.frontMatter.tags.join(', '),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    openGraph: {
      title: post.frontMatter.title,
      description: excerpt,
      url: postUrl,
      siteName: siteConfig.title,
      locale: 'ko_KR',
      type: 'article',
      publishedTime: post.frontMatter.date,
      modifiedTime: post.frontMatter.date,
      authors: [siteConfig.author],
      tags: post.frontMatter.tags,
      section: post.frontMatter.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontMatter.title,
      description: excerpt,
      creator: '@jellive',
      site: '@jellive',
    },
    alternates: {
      canonical: postUrl,
    },
    category: post.frontMatter.category,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params
  // URL decode each slug segment to handle encoded paths like dev%2Fblog
  const decodedSlug = resolvedParams.slug
    .map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch (error) {
        console.warn('Failed to decode URL segment:', segment, error)
        return segment
      }
    })
    .join('/')

  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    notFound()
  }

  const postUrl = `${siteConfig.siteUrl}/posts/${decodedSlug}`
  const description = post.content.substring(0, 160).replace(/\n/g, ' ').trim()
  const excerpt =
    description.length > 155
      ? description.substring(0, 155) + '...'
      : description

  return (
    <>
      <StructuredData
        type="article"
        includeBaseData={false}
        data={{
          title: post.frontMatter.title,
          description: excerpt,
          url: postUrl,
          datePublished: post.frontMatter.date,
          dateModified: post.frontMatter.date,
          author: siteConfig.author,
          tags: post.frontMatter.tags,
          category: post.frontMatter.category,
        }}
      />
      <PostContent post={post} slug={decodedSlug} />
    </>
  )
}
