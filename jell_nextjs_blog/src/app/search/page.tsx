import { getAllPosts } from '@/lib/markdown'
import SearchInteractive from '@/components/SearchInteractive'

export default async function SearchPage() {
  const allPosts = await getAllPosts()

  return <SearchInteractive allPosts={allPosts} />
}