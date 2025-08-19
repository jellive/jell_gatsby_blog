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
  // Optimize: Get all posts once and process them
  const { getAllPosts } = await import('@/lib/markdown')
  const allPosts = await getAllPosts()

  // Extract all unique tags
  const tagSet = new Set(allPosts.flatMap(post => post.frontMatter.tags))
  const tags = Array.from(tagSet).sort()

  // Create tag groups efficiently by grouping posts by tag
  const tagGroups = new Map<string, any[]>()

  // Initialize tag groups
  tags.forEach(tag => {
    tagGroups.set(tag, [])
  })

  // Group posts by tags in one pass
  allPosts.forEach(post => {
    post.frontMatter.tags.forEach(tag => {
      if (tagGroups.has(tag)) {
        tagGroups.get(tag)!.push(post)
      }
    })
  })

  // Create final groups array
  const groups: TagGroup[] = tags.map(tag => ({
    fieldValue: tag,
    totalCount: tagGroups.get(tag)?.length || 0,
    posts: tagGroups.get(tag) || [],
  }))

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
