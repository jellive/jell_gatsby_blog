import { cn } from '../utils'

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('base-class', 'additional-class')
    expect(result).toBe('base-class additional-class')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active')
    expect(result).toBe('base-class active')
  })

  it('handles falsy conditional classes', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active')
    expect(result).toBe('base-class')
  })

  it('merges conflicting Tailwind classes', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('handles array of classes', () => {
    const result = cn(['base-class', 'another-class'])
    expect(result).toBe('base-class another-class')
  })

  it('handles empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })
})
