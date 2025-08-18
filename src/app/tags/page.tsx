import { getAllTags, getPostsByTag } from '@/lib/markdown'
import TagsInteractive from '@/components/TagsInteractive'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags | Jell의 세상 사는 이야기',
  description: '블로그의 모든 태그를 확인해보세요.',
}

interface TagGroup {
  fieldValue: string
  totalCount: number
  posts: any[]
}

export default async function TagsPage() {
  const tags = await getAllTags()

  // Create tag groups with post counts and posts
  const groups: TagGroup[] = await Promise.all(
    tags.map(async tag => {
      const posts = await getPostsByTag(tag)
      return {
        fieldValue: tag,
        totalCount: posts.length,
        posts: posts,
      }
    })
  )

  // Add undefined tag group if needed (for posts without tags)
  groups.unshift({
    fieldValue: 'undefined',
    totalCount: 0,
    posts: [],
  })

  // Sort tags alphabetically
  groups.sort((a, b) => {
    const x = a.fieldValue.toLowerCase()
    const y = b.fieldValue.toLowerCase()
    if (x < y) return -1
    if (y < x) return 1
    return 0
  })

  // Move undefined to the beginning
  groups.sort(a => {
    if (a.fieldValue === 'undefined') return -1
    return 0
  })

  return <TagsInteractive tagGroups={groups} />
}
