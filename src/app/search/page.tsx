import { getAllPosts } from '@/lib/markdown'
import SearchPage from '@/components/SearchPage'

export default async function Search() {
  const allPosts = await getAllPosts()

  return <SearchPage allPosts={allPosts} />
}