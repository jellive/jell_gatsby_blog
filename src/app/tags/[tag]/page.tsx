import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag } from '@/lib/markdown'
import PostList from '@/components/PostList'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const decodedTag = decodeURIComponent(resolvedParams.tag)
  const posts = await getPostsByTag(decodedTag)
  
  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `${decodedTag} 태그 | ${siteConfig.title}`,
    description: `${decodedTag} 태그가 포함된 블로그 포스트 ${posts.length}개를 확인해보세요.`,
    keywords: [decodedTag, 'blog', 'tag', 'posts'].join(', '),
    openGraph: {
      title: `${decodedTag} 태그 | ${siteConfig.title}`,
      description: `${decodedTag} 태그가 포함된 블로그 포스트 ${posts.length}개`,
      url: `${siteConfig.siteUrl}/tags/${resolvedParams.tag}`,
      siteName: siteConfig.title,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${decodedTag} 태그 | ${siteConfig.title}`,
      description: `${decodedTag} 태그가 포함된 블로그 포스트 ${posts.length}개`,
      creator: '@jellive',
      site: '@jellive',
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/tags/${resolvedParams.tag}`,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params
  const decodedTag = decodeURIComponent(resolvedParams.tag)
  const posts = await getPostsByTag(decodedTag)
  
  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="tag-page">
      <div className="tag-header">
        <h1 className="tag-title">
          <span className="tag-symbol">#</span>
          {decodedTag}
        </h1>
        <p className="tag-description">
          {posts.length}개의 포스트
        </p>
      </div>
      
      <PostList posts={posts} />
    </div>
  )
}