import { getAllPosts } from '@/lib/markdown'
import Bio from '@/components/Bio'
import PostList from '@/components/PostList'
import StructuredData from '@/components/StructuredData'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <>
      <StructuredData type="blog" />
      <main className="min-h-screen">
        {/* Desktop Layout: Side-by-side Bio and Content */}
        <div className="hidden lg:block">
          <div className="max-w-[75vw] mx-auto px-content">
            <div className="flex gap-8 min-h-screen">
              {/* Bio Sidebar (280px) */}
              <aside className="w-[280px] flex-shrink-0">
                <div className="sticky top-[calc(var(--header-height)+var(--space-6))]">
                  <Bio />
                </div>
              </aside>
              
              {/* Main Content Area - Flexible */}
              <div className="flex-1 min-w-0">
                <div className="py-content">
                  <PostList posts={posts} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout: Stacked Bio and Content */}
        <div className="block lg:hidden">
          <div className="max-w-container mx-auto px-content">
            {/* Mobile Bio */}
            <div className="py-content">
              <Bio />
            </div>
            
            {/* Mobile Content */}
            <div className="py-content">
              <PostList posts={posts} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}