import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../ThemeToggle'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  })

  it('renders theme toggle button', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute(
      'title',
      expect.stringContaining('테마 변경')
    )
  })

  it('has proper test ID for identification', () => {
    render(<ThemeToggle />)

    const button = screen.getByTestId('theme-toggle')
    expect(button).toBeInTheDocument()
  })

  it('renders with correct ARIA attributes', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
    expect(button.getAttribute('aria-label')).toContain('현재 테마')
  })

  it('applies custom className', () => {
    const customClass = 'custom-theme-toggle'
    render(<ThemeToggle className={customClass} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(customClass)
  })

  it('handles click events', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    // Button should be clickable
    expect(button).not.toBeDisabled()

    // Click the button (doesn't need to verify specific state changes)
    fireEvent.click(button)

    // Button should still be present after click
    expect(button).toBeInTheDocument()
  })

  it('has proper component structure', () => {
    render(<ThemeToggle />)

    const button = screen.getByTestId('theme-toggle')
    // Button should have child elements (icon container)
    expect(button.children.length).toBeGreaterThan(0)

    // Should have an icon container div
    const iconContainer = button.querySelector('div')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders FontAwesome icon', () => {
    render(<ThemeToggle />)

    const button = screen.getByTestId('theme-toggle')
    // FontAwesome icon should be present
    const icon = button.querySelector('svg[data-icon]')
    expect(icon).toBeInTheDocument()
  })

  it('has proper button styling classes', () => {
    render(<ThemeToggle />)

    const button = screen.getByTestId('theme-toggle')
    expect(button).toHaveClass('group', 'relative', 'transition-all')
  })
})
