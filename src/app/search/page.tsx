import { getAllPosts } from '@/lib/markdown'
import SearchInteractive from '@/components/SearchInteractive'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  // Raw title — layout.tsx's metadata.title.template appends sitename.
  title: 'Search',
  description: '블로그 포스트를 검색해보세요.',
}

export default async function Search() {
  const allPosts = await getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Search</h1>
      <SearchInteractive allPosts={allPosts} />
    </div>
  )
}
