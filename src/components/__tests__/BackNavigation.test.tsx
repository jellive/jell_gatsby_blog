import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import BackNavigation from '../BackNavigation'

// Mock next/navigation
const mockBack = jest.fn()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}))

// Mock window.history
const mockHistoryLength = jest.fn()

describe('BackNavigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock window.history.length
    Object.defineProperty(window, 'history', {
      value: {
        get length() {
          return mockHistoryLength()
        },
      },
      writable: true,
    })
  })

  it('renders navigation structure correctly', () => {
    render(<BackNavigation />)

    const nav = screen.getByRole('navigation', { name: 'Navigation' })
    expect(nav).toBeInTheDocument()

    const backButton = screen.getByTestId('back-navigation')
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveTextContent('Back')

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(breadcrumb).toBeInTheDocument()
  })

  it('displays home link correctly', () => {
    render(<BackNavigation />)

    const homeLink = screen.getByRole('link', { name: /Home/ })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('handles back button click with history', () => {
    mockHistoryLength.mockReturnValue(2) // Has history
    render(<BackNavigation />)

    const backButton = screen.getByTestId('back-navigation')
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles back button click without history', () => {
    mockHistoryLength.mockReturnValue(1) // No history
    render(<BackNavigation />)

    const backButton = screen.getByTestId('back-navigation')
    fireEvent.click(backButton)

    expect(mockPush).toHaveBeenCalledWith('/')
    expect(mockBack).not.toHaveBeenCalled()
  })

  it('displays category when provided', () => {
    render(<BackNavigation category="dev" />)

    const categoryLink = screen.getByRole('link', { name: /💻 Development/ })
    expect(categoryLink).toBeInTheDocument()
    expect(categoryLink).toHaveAttribute('href', '/tags/dev')

    // Check for breadcrumb separator
    const separators = screen.getAllByText('›')
    expect(separators).toHaveLength(1)
  })

  it('displays title when provided', () => {
    render(<BackNavigation title="Test Post Title" />)

    const titleElement = screen.getByText('Test Post Title')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement.parentElement).toHaveAttribute('aria-current', 'page')

    // Check for breadcrumb separator
    const separators = screen.getAllByText('›')
    expect(separators).toHaveLength(1)
  })

  it('displays full breadcrumb with category and title', () => {
    render(<BackNavigation category="bicycle" title="My Cycling Adventure" />)

    // Check home link
    const homeLink = screen.getByRole('link', { name: /Home/ })
    expect(homeLink).toBeInTheDocument()

    // Check category link
    const categoryLink = screen.getByRole('link', { name: /🚲 Bicycle/ })
    expect(categoryLink).toBeInTheDocument()

    // Check title
    const titleElement = screen.getByText('My Cycling Adventure')
    expect(titleElement).toBeInTheDocument()

    // Check for two breadcrumb separators
    const separators = screen.getAllByText('›')
    expect(separators).toHaveLength(2)
  })

  it('maps category names correctly', () => {
    const categories = [
      { key: 'bicycle', expected: '🚲 Bicycle' },
      { key: 'chat', expected: '💬 Chat' },
      { key: 'dev', expected: '💻 Development' },
      { key: 'game', expected: '🎮 Game' },
      { key: 'notice', expected: '📢 Notice' },
    ]

    categories.forEach(({ key, expected }) => {
      const { unmount } = render(<BackNavigation category={key} />)

      const categoryLink = screen.getByRole('link', {
        name: new RegExp(expected),
      })
      expect(categoryLink).toBeInTheDocument()

      unmount()
    })
  })

  it('handles unknown category with fallback', () => {
    render(<BackNavigation category="unknown" />)

    const categoryLink = screen.getByRole('link', { name: /📁 unknown/ })
    expect(categoryLink).toBeInTheDocument()
    expect(categoryLink).toHaveAttribute('href', '/tags/unknown')
  })

  it('handles category case insensitivity', () => {
    render(<BackNavigation category="DEV" />)

    const categoryLink = screen.getByRole('link', { name: /💻 Development/ })
    expect(categoryLink).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<BackNavigation category="dev" title="Test Title" />)

    // Check main navigation
    const mainNav = screen.getByRole('navigation', { name: 'Navigation' })
    expect(mainNav).toBeInTheDocument()

    // Check breadcrumb navigation
    const breadcrumbNav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(breadcrumbNav).toBeInTheDocument()

    // Check back button accessibility
    const backButton = screen.getByTestId('back-navigation')
    expect(backButton).toHaveAttribute('aria-label', '뒤로 가기')
    expect(backButton).toHaveAttribute('title', '뒤로 가기')

    // Check current page indicator
    const currentPageElement = screen.getByText('Test Title').parentElement
    expect(currentPageElement).toHaveAttribute('aria-current', 'page')
  })

  it('handles empty props gracefully', () => {
    render(<BackNavigation />)

    // Should still render navigation structure
    const nav = screen.getByRole('navigation', { name: 'Navigation' })
    expect(nav).toBeInTheDocument()

    // Should only show home link, no separators
    const homeLink = screen.getByRole('link', { name: /Home/ })
    expect(homeLink).toBeInTheDocument()

    const separators = screen.queryAllByText('›')
    expect(separators).toHaveLength(0)
  })

  it('encodes category URLs correctly', () => {
    const categoryWithSpecialChars = 'category with spaces & symbols'
    render(<BackNavigation category={categoryWithSpecialChars} />)

    const categoryLink = screen.getByRole('link', {
      name: new RegExp(`📁 ${categoryWithSpecialChars}`),
    })
    expect(categoryLink).toHaveAttribute(
      'href',
      `/tags/${encodeURIComponent(categoryWithSpecialChars)}`
    )
  })

  it('applies correct CSS classes for responsive design', () => {
    render(<BackNavigation category="dev" title="Test Title" />)

    const nav = screen.getByRole('navigation', { name: 'Navigation' })
    expect(nav).toHaveClass('back-navigation', 'sticky', 'top-0', 'z-40')

    const container = nav.querySelector('.back-nav-container')
    expect(container).toHaveClass('max-md:flex-col', 'max-md:items-start')
  })
})
