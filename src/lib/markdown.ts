import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkEmoji from 'remark-emoji'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { glob } from 'glob'

export interface PostFrontMatter {
  category: string
  date: string
  title: string
  tags: string[]
}

export interface PostData {
  slug: string
  frontMatter: PostFrontMatter
  content: string
  htmlContent: string
  excerpt: string
  path: string
  tableOfContents: string
}

const postsDirectory = path.join(process.cwd(), '_posts')

/**
 * Get all markdown files from _posts directory
 */
export async function getAllMarkdownFiles(): Promise<string[]> {
  const pattern = path.join(postsDirectory, '**/*.md')
  const files = glob.sync(pattern)
  return files
}

/**
 * Transform image paths from relative to absolute paths
 */
function transformImagePaths(content: string, filePath: string): string {
  const relativePath = path.relative(postsDirectory, filePath)
  const pathParts = relativePath.split(path.sep)
  
  // Extract category and date parts: bicycle/2018/08/24/filename.md
  if (pathParts.length >= 4) {
    const category = pathParts[0]
    const year = pathParts[1] 
    const month = pathParts[2]
    const day = pathParts[3]
    
    // Replace image references with absolute paths
    return content.replace(
      /!\[([^\]]*)\]\(images\/([^)]+)\)/g, 
      `![$1](/images/${category}/${year}/${month}/${day}/$2)`
    )
  }
  
  return content
}

/**
 * Parse markdown file and extract frontmatter and content
 */
export async function parseMarkdownFile(filePath: string): Promise<PostData> {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data: frontMatter, content } = matter(fileContent)
  
  // Transform image paths before processing
  let transformedContent = transformImagePaths(content, filePath)
  
  // Replace ```toc``` code blocks with TOC heading that remarkToc can recognize
  transformedContent = transformedContent.replace(/```toc\s*```/g, '## Table of Contents')
  
  // Process markdown to HTML with proper remark → rehype pipeline
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkEmoji)
    .use(remarkToc, { 
      tight: true, 
      ordered: false,
      heading: 'toc|table[ -]of[ -]contents?', // Custom heading pattern
      maxDepth: 3 // Limit TOC depth
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      ignoreMissing: true,
      showLineNumbers: false
    })
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap'
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(transformedContent)
  let htmlContent = String(processedContent)
  
  // Extract TOC from the main HTML content
  // remarkToc inserts TOC where <!-- toc --> was placed
  // Look for TOC by finding ul with anchor links to headings
  let tableOfContents = ''
  
  // Extract TOC from the generated HTML content
  // remarkToc generates a "Table of Contents" heading followed by a UL
  const tocHeadingMatch = htmlContent.match(/<h2[^>]*>Table of Contents<\/h2>([\s\S]*?)(?=<h[1-6]|$)/i)
  
  if (tocHeadingMatch) {
    // Look for the UL that follows the Table of Contents heading
    const tocContentMatch = tocHeadingMatch[1].match(/<ul[^>]*>[\s\S]*?<\/ul>/)
    
    if (tocContentMatch) {
      tableOfContents = tocContentMatch[0]
      // Remove both the TOC heading and the UL from main content
      const fullTocPattern = /<h2[^>]*>Table of Contents<\/h2>\s*<ul[^>]*>[\s\S]*?<\/ul>/i
      htmlContent = htmlContent.replace(fullTocPattern, '')
    } else {
      // Remove just the TOC heading if no list follows (no headings to generate TOC from)
      htmlContent = htmlContent.replace(/<h2[^>]*>Table of Contents<\/h2>\s*/i, '')
    }
  } else {
    // Fallback: try to find any UL with heading links (direct TOC without heading)
    const tocPattern = /<ul[^>]*>[\s\S]*?<li[^>]*><a[^>]*href="#[^"]*"[^>]*>[\s\S]*?<\/ul>/
    const tocMatch = htmlContent.match(tocPattern)
    
    if (tocMatch) {
      tableOfContents = tocMatch[0]
      htmlContent = htmlContent.replace(tocMatch[0], '')
    }
  }
  
  // Generate excerpt from content (first 160 characters of plain text)
  const plainTextContent = content.replace(/#{1,6}\s+/g, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
  const excerpt = plainTextContent.substring(0, 160).replace(/\n/g, ' ').trim()
  
  // Generate slug from file path
  const relativePath = path.relative(postsDirectory, filePath)
  const slug = relativePath.replace(/\.md$/, '').replace(/\//g, '-')
  
  // Ensure frontMatter has all required properties with defaults
  const safeFrontMatter: PostFrontMatter = {
    category: frontMatter?.category || 'Uncategorized',
    date: frontMatter?.date || new Date().toISOString().split('T')[0],
    title: frontMatter?.title || path.basename(filePath, '.md'),
    tags: Array.isArray(frontMatter?.tags) ? frontMatter.tags.filter(Boolean) : []
  }
  
  return {
    slug,
    frontMatter: safeFrontMatter,
    content,
    htmlContent,
    excerpt,
    path: relativePath,
    tableOfContents
  }
}

/**
 * Get all posts with their metadata
 */
export async function getAllPosts(): Promise<PostData[]> {
  const files = await getAllMarkdownFiles()
  const posts = await Promise.all(
    files.map(async (filePath) => {
      return await parseMarkdownFile(filePath)
    })
  )
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontMatter.date)
    const dateB = new Date(b.frontMatter.date)
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const files = await getAllMarkdownFiles()
  
  for (const filePath of files) {
    const post = await parseMarkdownFile(filePath)
    if (post.slug === slug) {
      return post
    }
  }
  
  return null
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categorySet = new Set(posts.map(post => post.frontMatter.category))
  const categories = Array.from(categorySet)
  return categories.sort()
}

/**
 * Get all unique tags and categories (hybrid system)
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  
  // Get all tags
  const tagSet = new Set(posts.flatMap(post => post.frontMatter.tags))
  
  // Get all categories  
  const categorySet = new Set(posts.map(post => post.frontMatter.category))
  
  // Combine tags and categories
  const combinedSet = new Set<string>()
  tagSet.forEach(tag => combinedSet.add(tag))
  categorySet.forEach(category => combinedSet.add(category))
  
  const allTags = Array.from(combinedSet)
  return allTags.sort()
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<PostData[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.frontMatter.category === category)
}

/**
 * Get posts by tag or category (hybrid system)
 */
export async function getPostsByTag(tag: string): Promise<PostData[]> {
  const posts = await getAllPosts()
  return posts.filter(post => {
    // Check if it's a tag
    const hasTag = Array.isArray(post.frontMatter.tags) && post.frontMatter.tags.includes(tag)
    // Check if it's a category
    const hasCategory = post.frontMatter.category === tag
    // Return posts that match either tag or category
    return hasTag || hasCategory
  })
}