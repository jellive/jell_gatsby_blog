import type { Meta, StoryObj } from '@storybook/react'
import PostList, { type Post } from '@/components/PostList'

const meta: Meta<typeof PostList> = {
  title: 'Components/PostList',
  component: PostList,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PostList>

const samplePosts: Post[] = [
  {
    slug: 'nextjs-15-app-router',
    frontMatter: {
      title: 'Next.js 15 App Router 완벽 가이드',
      date: '2024-03-15',
      tags: ['nextjs', 'react', 'typescript'],
      category: 'Next.js',
    },
    excerpt: 'Next.js 15의 App Router를 깊이 파헤쳐봅니다.',
  },
  {
    slug: 'tailwind-css-v4',
    frontMatter: {
      title: 'Tailwind CSS v4 마이그레이션 전략',
      date: '2024-02-28',
      tags: ['tailwindcss', 'css', 'design-system'],
      category: 'CSS',
    },
    excerpt: 'Tailwind CSS v4의 새로운 엔진과 마이그레이션 방법을 알아봅니다.',
  },
  {
    slug: 'typescript-5-5-features',
    frontMatter: {
      title: 'TypeScript 5.5 새로운 기능 총정리',
      date: '2024-02-10',
      tags: ['typescript', 'javascript'],
      category: 'TypeScript',
    },
    excerpt:
      'TypeScript 5.5의 inferred type predicates, control flow 개선 등을 살펴봅니다.',
  },
  {
    slug: 'react-19-concurrent',
    frontMatter: {
      title: 'React 19 Concurrent Features 심층 분석',
      date: '2024-01-20',
      tags: ['react', 'concurrent', 'performance'],
      category: 'React',
    },
  },
]

export const Default: Story = {
  args: {
    posts: samplePosts,
  },
}

export const Empty: Story = {
  args: {
    posts: [],
  },
}

export const SinglePost: Story = {
  args: {
    posts: [samplePosts[0]!],
  },
}

export const ManyPosts: Story = {
  args: {
    posts: Array.from({ length: 12 }, (_, i) => ({
      slug: `post-${i}`,
      frontMatter: {
        title: `Post ${i + 1}: A detailed exploration of modern web development concepts`,
        date: new Date(Date.now() - i * 7 * 86400000)
          .toISOString()
          .split('T')[0] as string,
        tags: ['react', 'typescript', 'nextjs'].slice(0, (i % 3) + 1),
        category: ['React', 'TypeScript', 'Next.js'][i % 3] as string,
      },
      excerpt:
        i % 2 === 0
          ? `This is a sample excerpt for post ${i + 1}. It describes the key topics covered.`
          : undefined,
    })),
  },
}
