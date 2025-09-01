import { getAllPosts } from '@/lib/markdown'
import Bio from '@/components/Bio'
import PostListWithPagination from '@/components/PostListWithPagination'
import StructuredData from '@/components/StructuredData'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <>
      <StructuredData type="blog" />
      <main className="min-h-screen">
        {/* Desktop Layout: Side-by-side Bio and Content */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-[75vw] px-content">
            <div className="flex min-h-screen gap-8">
              {/* Bio Sidebar (280px) */}
              <aside className="w-[280px] flex-shrink-0">
                <div className="sticky top-[calc(var(--header-height)+var(--space-6))]">
                  <Bio />
                </div>
              </aside>

              {/* Main Content Area - Flexible */}
              <div className="min-w-0 flex-1">
                <div className="py-content">
                  <PostListWithPagination posts={posts} postsPerPage={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Stacked Bio and Content */}
        <div className="block lg:hidden">
          <div className="mx-auto max-w-container px-content">
            {/* Mobile Bio */}
            <div className="py-content">
              <Bio />
            </div>

            {/* Mobile Content */}
            <div className="py-content">
              <PostListWithPagination posts={posts} postsPerPage={12} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
