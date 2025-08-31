'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    // Remove existing theme classes
    root.classList.remove('light', 'dark')

    if (newTheme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      root.classList.add(systemPrefersDark ? 'dark' : 'light')
    } else {
      // Use explicit theme
      root.classList.add(newTheme)
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)

    // Get saved theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      setTheme('system')
      applyTheme('system')
    }
  }, [])

  // Handle theme change
  const handleThemeChange = () => {
    let newTheme: Theme

    if (theme === 'light') {
      newTheme = 'dark'
    } else if (theme === 'dark') {
      newTheme = 'system'
    } else {
      newTheme = 'light'
    }

    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(
          'relative h-11 w-11 cursor-not-allowed opacity-50',
          'border-border/50 rounded-md border',
          'min-h-[44px] min-w-[44px]',
          className
        )}
      />
    )
  }

  // Determine current effective theme for icon display
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme
  }

  const effectiveTheme = getEffectiveTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      className={cn(
        'group relative h-11 w-11',
        'border-border/30 rounded-md border',
        'hover:border-border/60 hover:scale-105',
        'active:scale-95',
        'transition-all duration-200',
        'hover:bg-accent/10 bg-transparent',
        // Ensure minimum touch target size of 44x44px on all devices
        'min-h-[44px] min-w-[44px]',
        className
      )}
      aria-label={`현재 테마: ${theme === 'system' ? '시스템' : theme === 'light' ? '라이트' : '다크'}, 클릭하여 변경`}
      title={`테마 변경 (현재: ${theme === 'system' ? '시스템 설정' : theme === 'light' ? '라이트 모드' : '다크 모드'})`}
      data-testid="theme-toggle"
    >
      {/* Icon container */}
      <div className="relative flex h-full w-full items-center justify-center">
        <Fa
          icon={effectiveTheme === 'dark' ? faMoon : faSun}
          className={cn(
            'text-base transition-all duration-200',
            'group-hover:scale-110',
            // Light mode sun styling
            effectiveTheme === 'light' && [
              'text-yellow-500 dark:text-yellow-400',
              'group-hover:text-yellow-600 dark:group-hover:text-yellow-300',
              'group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]',
            ],
            // Dark mode moon styling
            effectiveTheme === 'dark' && [
              'text-blue-500 dark:text-blue-400',
              'group-hover:text-blue-600 dark:group-hover:text-blue-300',
              'group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]',
            ]
          )}
          aria-hidden="true"
        />
      </div>

      {/* System indicator */}
      {theme === 'system' && (
        <div className="absolute right-0.5 top-0.5">
          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full bg-green-500',
              'opacity-80'
            )}
          />
        </div>
      )}
    </Button>
  )
}

export default ThemeToggle
