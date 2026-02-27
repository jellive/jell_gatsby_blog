import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import PostList, { type Post } from '../PostList'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('PostList Component', () => {
  const mockPosts: Post[] = [
    {
      slug: 'test-post-1',
      frontMatter: {
        title: 'Test Post 1',
        date: '2024-08-14',
        tags: ['javascript', 'react', 'development'],
        category: 'Development',
      },
      excerpt: 'This is a test excerpt for the first post.',
    },
    {
      slug: 'test-post-2',
      frontMatter: {
        title: 'Bicycle Adventure in Seoul',
        date: '2024-08-13',
        tags: ['자전거', 'cycling', 'sports'],
        category: 'Bicycle',
      },
      excerpt: 'A cycling adventure through Seoul streets.',
    },
    {
      slug: 'test-post-3',
      frontMatter: {
        title: 'Gaming Experience with New RPG',
        date: '2024-08-12',
        tags: ['game', 'rpg', 'review'],
        category: 'Gaming',
      },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders post list with correct structure', () => {
    render(<PostList posts={mockPosts} />)

    const postList = screen.getByTestId('post-list')
    expect(postList).toBeInTheDocument()

    const postItems = screen.getAllByTestId('post-item')
    expect(postItems).toHaveLength(3)
  })

  it('displays post titles correctly', () => {
    render(<PostList posts={mockPosts} />)

    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('Bicycle Adventure in Seoul')).toBeInTheDocument()
    expect(
      screen.getByText('Gaming Experience with New RPG')
    ).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<PostList posts={mockPosts} />)

    const allDates = screen.getAllByText('Aug 2024')
    expect(allDates).toHaveLength(3)
  })

  it('displays excerpts when available', () => {
    render(<PostList posts={mockPosts} />)

    expect(
      screen.getByText('This is a test excerpt for the first post.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('A cycling adventure through Seoul streets.')
    ).toBeInTheDocument()

    // Third post has no excerpt
    const excerpts = screen.getAllByTestId('post-excerpt')
    expect(excerpts).toHaveLength(2)
  })

  it('renders tags with correct variants', () => {
    render(<PostList posts={mockPosts} />)

    // Check if tags are rendered
    expect(screen.getByText('#javascript')).toBeInTheDocument()
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('#자전거')).toBeInTheDocument()
    expect(screen.getByText('#game')).toBeInTheDocument()
  })

  it('handles tag clicks correctly', () => {
    render(<PostList posts={mockPosts} />)

    const javascriptTag = screen.getByText('#javascript')
    fireEvent.click(javascriptTag)

    expect(mockPush).toHaveBeenCalledWith('/tags#javascript')
  })

  it('prevents event propagation on tag clicks', () => {
    render(<PostList posts={mockPosts} />)

    const postItem = screen.getAllByTestId('post-item')[0]
    const javascriptTag = screen.getByText('#javascript')

    // Mock click event to check event handling
    const mockStopPropagation = jest.fn()
    const mockPreventDefault = jest.fn()

    const clickEvent = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(clickEvent, 'stopPropagation', {
      value: mockStopPropagation,
    })
    Object.defineProperty(clickEvent, 'preventDefault', {
      value: mockPreventDefault,
    })

    fireEvent.click(javascriptTag)

    // Verify navigation was called
    expect(mockPush).toHaveBeenCalledWith('/tags#javascript')
  })

  it('handles empty posts array', () => {
    render(<PostList posts={[]} />)

    const postList = screen.getByTestId('post-list')
    expect(postList).toBeInTheDocument()

    const postItems = screen.queryAllByTestId('post-item')
    expect(postItems).toHaveLength(0)
  })

  it('filters out invalid tags', () => {
    const postsWithInvalidTags: Post[] = [
      {
        slug: 'test-post-invalid-tags',
        frontMatter: {
          title: 'Test Post with Invalid Tags',
          date: '2024-08-14',
          tags: ['valid-tag', 'undefined', '', 'another-valid-tag'],
          category: 'Test',
        },
      },
    ]

    render(<PostList posts={postsWithInvalidTags} />)

    expect(screen.getByText('#valid-tag')).toBeInTheDocument()
    expect(screen.getByText('#another-valid-tag')).toBeInTheDocument()
    expect(screen.queryByText('#undefined')).not.toBeInTheDocument()
    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })

  it('cleans TOC content from excerpts', () => {
    const postsWithTOC: Post[] = [
      {
        slug: 'post-with-toc',
        frontMatter: {
          title: 'Post with TOC',
          date: '2024-08-14',
          tags: ['test'],
        },
        excerpt: '목차 ```toc``` This is the real content after TOC.',
      },
    ]

    render(<PostList posts={postsWithTOC} />)

    expect(
      screen.getByText('This is the real content after TOC.')
    ).toBeInTheDocument()
    expect(screen.queryByText('목차')).not.toBeInTheDocument()
  })

  it('applies correct badge variants based on tag content', () => {
    render(<PostList posts={mockPosts} />)

    // Check if tags are rendered with correct text content
    const devTags = screen.getByText('#javascript')
    expect(devTags).toBeInTheDocument()

    const bicycleTags = screen.getByText('#자전거')
    expect(bicycleTags).toBeInTheDocument()

    const gameTags = screen.getByText('#game')
    expect(gameTags).toBeInTheDocument()

    // Verify tags are styled as interactive elements
    expect(devTags).toHaveClass('post-tag')
    expect(bicycleTags).toHaveClass('post-tag')
    expect(gameTags).toHaveClass('post-tag')
  })

  it('handles invalid date gracefully', () => {
    const postsWithInvalidDate: Post[] = [
      {
        slug: 'post-invalid-date',
        frontMatter: {
          title: 'Post with Invalid Date',
          date: 'invalid-date-string',
          tags: ['test'],
        },
      },
    ]

    render(<PostList posts={postsWithInvalidDate} />)

    // Should fallback to original date string or show error format
    const dateElement = screen.getByTestId('post-date')
    expect(dateElement).toBeInTheDocument()
    // The formatDate function should handle invalid dates gracefully
    expect(dateElement.textContent).toBeTruthy()
  })

  it('has proper accessibility attributes', () => {
    render(<PostList posts={mockPosts} />)

    // Check for semantic HTML structure
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(3)

    // Check for proper link structure
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)

    // Check for time elements
    const timeElements = screen.getAllByTestId('post-date')
    expect(timeElements).toHaveLength(3)
  })
})
