import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag } from '@/lib/markdown'
import PostListWithPagination from '@/components/PostListWithPagination'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map(tag => ({ tag }))
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
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
    <main className="min-h-screen">
      <div className="mx-auto max-w-container px-content py-content">
        {/* 태그 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            <span className="text-primary">#</span>
            {decodedTag}
          </h1>
          <p className="text-lg text-muted-foreground">
            {posts.length}개의 포스트
          </p>
        </div>

        {/* 포스트 리스트 */}
        <PostListWithPagination posts={posts} postsPerPage={10} />
      </div>
    </main>
  )
}
