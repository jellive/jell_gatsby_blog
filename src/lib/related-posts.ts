/**
 * Related Posts Recommendation System
 *
 * Recommends related posts based on:
 * - Shared tags (primary factor)
 * - Same category (secondary factor)
 * - Content similarity (optional, future enhancement)
 */

import type { PostData } from './markdown'

export interface RelatedPost {
  slug: string
  title: string
  category: string
  date: string
  tags: string[]
  score: number // Relevance score (higher is more related)
}

/**
 * Calculate tag similarity score between two posts
 */
function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  if (!tags1.length || !tags2.length) return 0

  const set1 = new Set(tags1.map(t => t.toLowerCase()))
  const set2 = new Set(tags2.map(t => t.toLowerCase()))

  // Jaccard similarity: intersection / union
  const intersection = new Set(Array.from(set1).filter(x => set2.has(x)))
  const union = new Set([...Array.from(set1), ...Array.from(set2)])

  return intersection.size / union.size
}

/**
 * Calculate category similarity score
 */
function calculateCategorySimilarity(cat1: string, cat2: string): number {
  return cat1.toLowerCase() === cat2.toLowerCase() ? 1 : 0
}

/**
 * Calculate overall relevance score
 */
function calculateRelevanceScore(
  currentPost: PostData,
  candidatePost: PostData
): number {
  const tagScore = calculateTagSimilarity(
    currentPost.frontMatter.tags,
    candidatePost.frontMatter.tags
  )
  const categoryScore = calculateCategorySimilarity(
    currentPost.frontMatter.category,
    candidatePost.frontMatter.category
  )

  // Weighted scoring: tags are 70%, category is 30%
  return tagScore * 0.7 + categoryScore * 0.3
}

/**
 * Get related posts for a given post
 *
 * @param currentPost - The current post being viewed
 * @param allPosts - All available posts
 * @param limit - Maximum number of related posts to return (default: 5)
 * @param minScore - Minimum relevance score threshold (default: 0.2)
 * @returns Array of related posts sorted by relevance
 */
export function getRelatedPosts(
  currentPost: PostData,
  allPosts: PostData[],
  limit = 5,
  minScore = 0.2
): RelatedPost[] {
  const relatedPosts: RelatedPost[] = []

  for (const post of allPosts) {
    // Skip the current post itself
    if (post.slug === currentPost.slug) continue

    // Skip drafts in production
    if (post.isDraft && process.env.NODE_ENV === 'production') continue

    // Calculate relevance score
    const score = calculateRelevanceScore(currentPost, post)

    // Only include posts above minimum score threshold
    if (score >= minScore) {
      relatedPosts.push({
        slug: post.slug,
        title: post.frontMatter.title,
        category: post.frontMatter.category,
        date: post.frontMatter.date,
        tags: post.frontMatter.tags,
        score,
      })
    }
  }

  // Sort by relevance score (highest first) and limit results
  return relatedPosts.sort((a, b) => b.score - a.score).slice(0, limit)
}

/**
 * Get posts from the same category
 *
 * @param currentPost - The current post being viewed
 * @param allPosts - All available posts
 * @param limit - Maximum number of posts to return (default: 5)
 * @returns Array of posts from the same category
 */
export function getCategoryPosts(
  currentPost: PostData,
  allPosts: PostData[],
  limit = 5
): RelatedPost[] {
  const categoryPosts: RelatedPost[] = []

  for (const post of allPosts) {
    // Skip the current post itself
    if (post.slug === currentPost.slug) continue

    // Skip drafts in production
    if (post.isDraft && process.env.NODE_ENV === 'production') continue

    // Only include posts from the same category
    if (
      post.frontMatter.category.toLowerCase() ===
      currentPost.frontMatter.category.toLowerCase()
    ) {
      categoryPosts.push({
        slug: post.slug,
        title: post.frontMatter.title,
        category: post.frontMatter.category,
        date: post.frontMatter.date,
        tags: post.frontMatter.tags,
        score: 1.0, // Same category posts have perfect category score
      })
    }
  }

  // Sort by date (newest first) and limit results
  return categoryPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

/**
 * Get posts with shared tags
 *
 * @param currentPost - The current post being viewed
 * @param allPosts - All available posts
 * @param limit - Maximum number of posts to return (default: 5)
 * @returns Array of posts with shared tags
 */
export function getTagPosts(
  currentPost: PostData,
  allPosts: PostData[],
  limit = 5
): RelatedPost[] {
  const tagPosts: RelatedPost[] = []
  const currentTags = new Set(
    currentPost.frontMatter.tags.map(t => t.toLowerCase())
  )

  for (const post of allPosts) {
    // Skip the current post itself
    if (post.slug === currentPost.slug) continue

    // Skip drafts in production
    if (post.isDraft && process.env.NODE_ENV === 'production') continue

    // Check for shared tags
    const sharedTags = post.frontMatter.tags.filter(tag =>
      currentTags.has(tag.toLowerCase())
    )

    if (sharedTags.length > 0) {
      const score = calculateTagSimilarity(
        currentPost.frontMatter.tags,
        post.frontMatter.tags
      )

      tagPosts.push({
        slug: post.slug,
        title: post.frontMatter.title,
        category: post.frontMatter.category,
        date: post.frontMatter.date,
        tags: post.frontMatter.tags,
        score,
      })
    }
  }

  // Sort by tag similarity score (highest first) and limit results
  return tagPosts.sort((a, b) => b.score - a.score).slice(0, limit)
}
