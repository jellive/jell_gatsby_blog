import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkEmoji from 'remark-emoji'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { glob } from 'glob'
import GithubSlugger from 'github-slugger'

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
  isDraft: boolean
}

const postsDirectory = path.join(process.cwd(), '_posts')
const draftsDirectory = path.join(process.cwd(), '_drafts')

/**
 * Get all markdown files from _posts directory (and _drafts in development)
 */
export async function getAllMarkdownFiles(): Promise<string[]> {
  const postsPattern = path.join(postsDirectory, '**/*.md')
  let files = glob.sync(postsPattern)
  
  // Include drafts in development mode
  if (process.env.NODE_ENV === 'development') {
    const draftsPattern = path.join(draftsDirectory, '**/*.md')
    const draftFiles = glob.sync(draftsPattern)
    files = [...files, ...draftFiles]
  }
  
  return files
}

/**
 * Transform image paths from relative to absolute paths
 */
function transformImagePaths(content: string, filePath: string): string {
  // Determine if this is a draft or post file
  const isDraft = filePath.includes('_drafts')
  const baseDirectory = isDraft ? draftsDirectory : postsDirectory
  
  const relativePath = path.relative(baseDirectory, filePath)
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
  
  // Replace both ```toc``` and [toc] patterns with TOC heading that remarkToc can recognize
  console.log('🔍 Original content preview:', transformedContent.substring(0, 200))
  
  // More flexible [toc] pattern: allows whitespace and case-insensitive
  const beforeTocReplace = transformedContent.includes('[toc]') || transformedContent.includes('[TOC]')
  transformedContent = transformedContent.replace(/```toc\s*```/g, '## Table of Contents')
  transformedContent = transformedContent.replace(/^\s*\[toc\]\s*$/gim, '## Table of Contents')
  
  console.log('🔧 Before [toc] replace:', beforeTocReplace)
  
  // Debug: Check if TOC heading was inserted
  const hasTocHeading = transformedContent.includes('## Table of Contents')
  console.log('🎯 TOC Heading Found in Content:', hasTocHeading)
  
  if (hasTocHeading) {
    console.log('📄 Content after TOC replacement preview:', transformedContent.substring(0, 300))
  }
  
  // Create shared slugger instance for consistent ID generation
  const slugger = new GithubSlugger()

  // Process markdown to HTML with proper remark → rehype pipeline
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkEmoji)
    .use(remarkToc, { 
      tight: true, 
      ordered: false,
      // Remove heading pattern to use default (matches "Table of Contents")
      maxDepth: 3 // Include only h2, h3 headings in TOC (exclude h4, h5, h6)
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      ignoreMissing: true,
      showLineNumbers: false
    })
    .use(rehypeSlug) // Generate IDs for headings first
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap', // Wrap content in anchor
      properties: {
        className: 'heading-anchor'
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(transformedContent)
  let htmlContent = String(processedContent)
  
  console.log('🔍 ID Generation Debug - HTML content preview:', htmlContent.substring(0, 500))
  
  // Debug: Check if remarkToc generated any content
  const tocInHtml = htmlContent.includes('Table of Contents')
  console.log('🎯 remarkToc Generated TOC:', tocInHtml)
  
  // Debug: Look for any UL elements (potential TOC)
  const ulCount = (htmlContent.match(/<ul[^>]*>/g) || []).length
  console.log('📝 UL Elements in HTML:', ulCount)
  
  // Debug: Check ALL heading elements (with and without IDs)
  const allHeadingMatches = htmlContent.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []
  console.log('📝 All Headings Found:', allHeadingMatches.length)
  
  // Debug: Extract heading IDs more precisely
  const headingIDMatches: Array<{
    index: number
    hasId: boolean
    id: string
    text: string
    fullHeading: string
  }> = []
  allHeadingMatches.forEach((heading, index) => {
    const idMatch = heading.match(/id="([^"]*)"/)
    const textMatch = heading.match(/<h[1-6][^>]*>([^<]*)</)?.[1] || 
                     heading.match(/>([^<]+)</)?.[1] ||
                     heading.replace(/<[^>]*>/g, '').trim()
    
    headingIDMatches.push({
      index,
      hasId: !!idMatch,
      id: idMatch?.[1] || 'NO_ID',
      text: textMatch?.trim().substring(0, 40) || 'NO_TEXT',
      fullHeading: heading.substring(0, 100) + '...'
    })
  })
  
  console.log('🆔 Heading ID Analysis:', headingIDMatches)
  
  // Count headings with and without IDs
  const withIds = headingIDMatches.filter(h => h.hasId).length
  const withoutIds = headingIDMatches.filter(h => !h.hasId).length
  console.log(`📊 ID Statistics: ${withIds} with IDs, ${withoutIds} without IDs`)
  
  // Helper function to extract complete nested UL (balanced parsing)
  function extractCompleteUL(html: string, startIndex: number): string | null {
    if (startIndex >= html.length) return null
    
    // Find the opening <ul> tag
    const ulStart = html.indexOf('<ul', startIndex)
    if (ulStart === -1) return null
    
    // Find the end of the opening tag
    const ulTagEnd = html.indexOf('>', ulStart)
    if (ulTagEnd === -1) return null
    
    let depth = 1
    let pos = ulTagEnd + 1
    
    while (pos < html.length && depth > 0) {
      const nextUlStart = html.indexOf('<ul', pos)
      const nextUlEnd = html.indexOf('</ul>', pos)
      
      if (nextUlEnd === -1) break // No more closing tags
      
      if (nextUlStart !== -1 && nextUlStart < nextUlEnd) {
        // Found opening tag before closing tag
        depth++
        pos = nextUlStart + 3
      } else {
        // Found closing tag
        depth--
        pos = nextUlEnd + 5
        
        if (depth === 0) {
          // Found the matching closing tag
          return html.substring(ulStart, pos)
        }
      }
    }
    
    return null // Unbalanced tags
  }

  // Extract TOC from the main HTML content
  // remarkToc inserts TOC where <!-- toc --> was placed
  // Look for TOC by finding ul with anchor links to headings
  let tableOfContents = ''
  
  console.log('🔍 TOC Extraction Debug - HTML length:', htmlContent.length)
  
  // Extract TOC from the generated HTML content
  // remarkToc generates a "Table of Contents" heading followed by a UL
  const tocHeadingMatch = htmlContent.match(/<h2[^>]*>Table of Contents<\/h2>([\s\S]*?)(?=<h[1-6]|$)/i)
  
  console.log('🎯 TOC Heading Match Found:', !!tocHeadingMatch)
  
  if (tocHeadingMatch) {
    // Use balanced parsing to extract complete nested UL
    const completeUL = extractCompleteUL(tocHeadingMatch[1], 0)
    
    console.log('📋 Complete UL Extracted:', !!completeUL, 'Length:', completeUL?.length || 0)
    
    if (completeUL) {
      // Fix URL-encoded TOC links to match plain Korean heading IDs
      // Replace URL-encoded href attributes with decoded Korean text
      tableOfContents = completeUL.replace(/href="#([^"]+)"/g, (match, encodedHref) => {
        try {
          const decodedHref = decodeURIComponent(encodedHref)
          console.log('🔧 TOC Link Fix:', { original: encodedHref, decoded: decodedHref })
          return `href="#${decodedHref}"`
        } catch (error) {
          console.warn('⚠️ Failed to decode TOC href:', encodedHref, error)
          return match // Keep original if decoding fails
        }
      })
      
      // Debug: Extract and log TOC links for comparison (after fix)
      const tocLinkMatches = tableOfContents.match(/<a[^>]*href="#([^"]*)"[^>]*>([^<]*)<\/a>/gi) || []
      console.log('🔗 Fixed TOC Links:', tocLinkMatches.map(match => {
        const hrefMatch = match.match(/href="#([^"]*)"/)
        const textMatch = match.match(/>([^<]*)</)
        return {
          href: hrefMatch?.[1] || 'no-href',
          text: textMatch?.[1]?.trim().substring(0, 30) || 'no-text'
        }
      }))
      
      // Remove both the TOC heading and the complete UL from main content
      const tocHeadingStart = htmlContent.indexOf('<h2')
      const tocHeadingEnd = htmlContent.indexOf('</h2>', tocHeadingStart) + 5
      const tocULStart = htmlContent.indexOf('<ul', tocHeadingEnd)
      const tocULEnd = tocULStart + completeUL.length
      
      if (tocHeadingStart !== -1 && tocULStart !== -1) {
        const fullTocContent = htmlContent.substring(tocHeadingStart, tocULEnd)
        htmlContent = htmlContent.replace(fullTocContent, '')
        console.log('✅ TOC Removed from main content')
      }
      
      // Additional cleanup: Remove any remaining "Table of Contents" heading
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>Table of Contents<\/h[1-6]>/gi, '')
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>목차<\/h[1-6]>/gi, '')
    } else {
      // Remove just the TOC heading if no list follows (no headings to generate TOC from)
      htmlContent = htmlContent.replace(/<h2[^>]*>Table of Contents<\/h2>\s*/i, '')
      // Additional cleanup for any level of TOC heading
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>Table of Contents<\/h[1-6]>/gi, '')
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>목차<\/h[1-6]>/gi, '')
      console.log('⚠️ No UL found, removed TOC heading only')
    }
  } else {
    // Fallback: try to find any UL with heading links (direct TOC without heading)
    const completeUL = extractCompleteUL(htmlContent, 0)
    
    if (completeUL && completeUL.includes('href="#')) {
      // Fix URL-encoded TOC links in fallback case too
      tableOfContents = completeUL.replace(/href="#([^"]+)"/g, (match, encodedHref) => {
        try {
          const decodedHref = decodeURIComponent(encodedHref)
          console.log('🔧 Fallback TOC Link Fix:', { original: encodedHref, decoded: decodedHref })
          return `href="#${decodedHref}"`
        } catch (error) {
          console.warn('⚠️ Failed to decode fallback TOC href:', encodedHref, error)
          return match
        }
      })
      htmlContent = htmlContent.replace(completeUL, '')
      // Remove any remaining TOC headings in fallback case too
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>Table of Contents<\/h[1-6]>/gi, '')
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>목차<\/h[1-6]>/gi, '')
      console.log('🔄 Fallback TOC extraction successful with link fixing')
    } else {
      console.log('❌ No TOC found in fallback')
      // Even if no TOC found, remove any TOC headings
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>Table of Contents<\/h[1-6]>/gi, '')
      htmlContent = htmlContent.replace(/<h[1-6][^>]*>목차<\/h[1-6]>/gi, '')
    }
  }
  
  // Count TOC items for debugging
  const tocItemCount = (tableOfContents.match(/<li[^>]*>/g) || []).length
  console.log('📊 Final TOC Stats:', {
    tocLength: tableOfContents.length,
    tocItemCount,
    hasContent: tableOfContents.length > 0
  })
  
  // Generate excerpt from content (first 160 characters of plain text)
  const plainTextContent = content.replace(/#{1,6}\s+/g, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
  const excerpt = plainTextContent.substring(0, 160).replace(/\n/g, ' ').trim()
  
  // Determine if this is a draft file and generate slug
  const isDraft = filePath.includes('_drafts')
  const baseDirectory = isDraft ? draftsDirectory : postsDirectory
  const relativePath = path.relative(baseDirectory, filePath)
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
    tableOfContents,
    isDraft
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