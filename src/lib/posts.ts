import fs from 'fs-extra'
import { glob } from 'glob'
import matter from 'gray-matter'
import path from 'path'

export interface Post {
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: {
    date: string
    title: string
    tags: string[]
    featuredImage: string | null
    category: string | null
  }
  rawMarkdownBody: string
}

function normalizeDate(date: string): string {
  try {
    return new Date(date).toISOString()
  } catch (error) {
    console.error('Date normalization error:', date, error)
    return date
  }
}

async function markdownToHtml(markdown: string, postPath: string) {
  const processImagePaths = (content: string) => {
    return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imagePath) => {
      // 디버깅을 위한 로그
      console.log('Processing image path:', {
        original: imagePath.trim(),
        postPath
      })

      // 외부 URL인 경우 그대로 반환
      if (imagePath.trim().startsWith('http')) {
        return match
      }

      // 이미지 경로 정규화
      const normalizedPath = imagePath.trim().replace(/^\.?\/?(images\/)?/, '')
      // 포스트 경로에서 파일명을 제외한 디렉토리 경로만 사용
      const postDir = postPath.split('/').slice(0, -1).join('/')
      const absoluteImagePath = `/posts/${postDir}/images/${normalizedPath}`

      console.log('Converted path:', absoluteImagePath)

      return `![${alt}](${absoluteImagePath})`
    })
  }

  // 마크다운 내용에서 이미지 경로 처리
  const processedContent = processImagePaths(markdown)

  return processedContent
}

// 타입 가드 함수 추가
function isValidPost(post: any): post is Post {
  return (
    post !== null &&
    typeof post.excerpt === 'string' &&
    typeof post.fields?.slug === 'string' &&
    typeof post.frontmatter?.date === 'string' &&
    typeof post.frontmatter?.title === 'string' &&
    Array.isArray(post.frontmatter?.tags) &&
    typeof post.rawMarkdownBody === 'string'
  )
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), '_posts')
  //   console.log('Posts directory:', postsDirectory)

  try {
    const exists = await fs.pathExists(postsDirectory)
    if (!exists) {
      throw new Error('_posts directory not found')
    }
  } catch (error) {
    console.error('Error accessing _posts directory:', error)
    return []
  }

  // glob 패턴 수정 및 옵션 추가
  const postPaths = await glob('**/*.md', {
    cwd: postsDirectory,
    absolute: false,
    ignore: ['node_modules/**', '.next/**'],
    nodir: true,
    dot: false
  })
  //   console.log('Found markdown files:', postPaths)

  if (postPaths.length === 0) {
    console.warn('No markdown files found in _posts directory')
    return []
  }

  const posts = await Promise.all(
    postPaths.map(async (postPath) => {
      const fullPath = path.join(postsDirectory, postPath)

      try {
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data, content, excerpt } = matter(fileContents)

        // 포스트 경로 로깅
        // console.log('Processing post:', {
        //   path: postPath,
        //   title: data.title
        // })

        // postPath를 전달하여 이미지 경로 처리
        const processedContent = await markdownToHtml(content, postPath)

        return {
          excerpt: excerpt || '',
          fields: {
            slug: postPath.replace(/\.md$/, '')
          },
          frontmatter: {
            date: normalizeDate(data.date),
            title: data.title,
            tags: data.tags || [],
            featuredImage: data.featuredImage || null,
            category: data.category || null
          },
          rawMarkdownBody: processedContent // 처리된 마크다운 내용 사용
        }
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error)
        return null
      }
    })
  )

  // 타입 가드 함수 사용
  const validPosts = posts.filter(isValidPost)
  //   console.log('Total valid posts:', validPosts.length)

  return validPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date)
    const dateB = new Date(b.frontmatter.date)
    return dateB.getTime() - dateA.getTime()
  })
}
