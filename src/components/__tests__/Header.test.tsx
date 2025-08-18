import { render, screen } from '@testing-library/react'
import Header from '../Header'
import { CommandPaletteProvider } from '../CommandPalette/CommandPaletteProvider'
import { siteConfig } from '@/lib/config'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Create wrapper component with providers
const HeaderWrapper = () => (
  <CommandPaletteProvider>
    <Header siteTitle={siteConfig.title} />
  </CommandPaletteProvider>
)

describe('Header Component', () => {
  it('renders the header structure', () => {
    render(<HeaderWrapper />)

    // Check for header element
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('renders navigation elements', () => {
    render(<HeaderWrapper />)

    // Check for profile image
    const profileImage = screen.getByRole('img', {
      name: /title profile picture/i,
    })
    expect(profileImage).toBeInTheDocument()

    // Check for theme toggle
    const themeToggle = screen.getByRole('button', { name: /현재 테마/i })
    expect(themeToggle).toBeInTheDocument()

    // Check for tag button
    const tagButton = screen.getByRole('button', {
      name: /태그 페이지로 이동/i,
    })
    expect(tagButton).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<HeaderWrapper />)

    const banner = screen.getByRole('banner')
    expect(banner).toBeInTheDocument()

    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()
  })
})
