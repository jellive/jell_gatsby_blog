import fs from 'fs-extra'
import { glob } from 'glob'
import matter from 'gray-matter'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

export interface Post {
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: {
    date: string
    title: string
    tags: string[]
    featuredImage?: string
    category?: string
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
    return content.replace(/!\[([^\]]*)\]\((?!http)(.*?)\)/g, (match, alt, imagePath) => {
      const slug = postPath.replace(/\.md$/, '')
      const imageName = path.basename(imagePath.replace('images/', ''))
      const absoluteImagePath = `/images/${slug}/${imageName}`

      console.log('Processing image:', {
        original: match,
        alt,
        imagePath,
        absoluteImagePath,
        slug
      })

      return `![${alt}](${absoluteImagePath})`
    })
  }

  return processImagePaths(markdown)
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), '_posts')
  console.log('Posts directory:', postsDirectory)

  try {
    const exists = await fs.pathExists(postsDirectory)
    if (!exists) {
      throw new Error('_posts directory not found')
    }

    // 디렉토리 내용 확인
    const dirContents = await fs.readdir(postsDirectory)
    console.log('Directory contents:', dirContents)
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
  console.log('Found markdown files:', postPaths)

  if (postPaths.length === 0) {
    console.warn('No markdown files found in _posts directory')
    return []
  }

  const posts = await Promise.all(
    postPaths.map(async (postPath) => {
      const fullPath = path.join(postsDirectory, postPath)
      console.log('Processing file:', fullPath)

      try {
        const fileContents = await fs.readFile(fullPath, 'utf8')
        const { data, content, excerpt } = matter(fileContents)

        // featuredImage가 undefined일 경우 null로 설정
        const featuredImage = data.featuredImage || null

        // postPath를 전달하여 이미지 경로 처리
        const htmlContent = await markdownToHtml(content, postPath)
        const htmlExcerpt = excerpt ? await markdownToHtml(excerpt, postPath) : ''

        return {
          excerpt: htmlExcerpt,
          fields: {
            slug: postPath.replace(/\.md$/, '').split('/').join('/')
          },
          frontmatter: {
            date: normalizeDate(data.date),
            title: data.title,
            tags: data.tags || [],
            featuredImage, // null로 설정된 값 사용
            category: data.category || null // category도 같은 방식으로 처리
          },
          rawMarkdownBody: content // HTML로 변환하지 않고 마크다운 그대로 전달
        }
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error)
        return null
      }
    })
  )

  // 에러가 있는 포스트 제거
  const validPosts = posts.filter((post): post is Post => post !== null)
  console.log('Total valid posts:', validPosts.length)

  return validPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date)
    const dateB = new Date(b.frontmatter.date)
    return dateB.getTime() - dateA.getTime()
  })
}
