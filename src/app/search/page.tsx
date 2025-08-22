import { getAllPosts } from '@/lib/markdown'
import SearchInteractive from '@/components/SearchInteractive'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search | Jell의 세상 사는 이야기',
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
