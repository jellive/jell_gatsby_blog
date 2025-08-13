import { getAllPosts } from '@/lib/markdown'
import Bio from '@/components/Bio'
import PostList from '@/components/PostList'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <main>
      <div className="index-wrap">
        <Bio />
        <div className="index-post-list-wrap">
          <div>
            <PostList posts={posts} />
          </div>
        </div>
      </div>
    </main>
  )
}