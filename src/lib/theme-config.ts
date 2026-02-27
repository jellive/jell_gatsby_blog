/**
 * Medium-Style Theme Configuration for Blog Design System
 * Provides comprehensive theme management following Medium's design principles
 */

// Medium-inspired theme color definitions
export const themeColors = {
  light: {
    // Background hierarchy (Medium style)
    background: {
      primary: '#FFFFFF', // Pure white (Medium)
      secondary: '#F7F4ED', // Light gray background (Medium)
      tertiary: '#F2F2F2', // Hover background (Medium)
      elevated: '#FFFFFF', // Cards, modals
      glass: 'rgba(255, 255, 255, 0.95)', // Backdrop blur
    },

    // Text hierarchy (Medium style)
    text: {
      primary: '#242424', // Dark text (Medium)
      secondary: '#6B6B6B', // Medium gray (Medium)
      tertiary: '#8B8B8B', // Light gray text
      muted: '#A0A0A0', // Very light gray
      inverse: '#FFFFFF', // For dark backgrounds
    },

    // Brand colors (Medium style)
    brand: {
      primary: '#1A8917', // Medium green
      secondary: '#4A90E2', // Medium blue
      accent: '#FFC017', // Medium yellow
    },

    // Semantic colors (Medium style)
    semantic: {
      success: '#1A8917', // Medium green
      warning: '#FFC017', // Medium yellow
      error: '#E53E3E', // Medium red
      info: '#4A90E2', // Medium blue
    },

    // Border colors (Medium style)
    border: {
      light: '#E6E6E6', // Light border (Medium)
      medium: '#D1D1D1', // Medium border
      strong: '#6B6B6B', // Dark border
      focus: '#1A8917', // Medium green for focus
    },

    // Interactive states (Medium style)
    interactive: {
      hover: '#F2F2F2', // Light gray hover (Medium)
      active: '#E6E6E6', // Medium gray active
      disabled: '#F2F2F2', // Light gray disabled
      followButton: '#1A8917', // Medium green button
      followButtonText: '#FFFFFF', // White button text
    },

    // Code highlighting (Medium style)
    code: {
      background: '#F7F4ED', // Light gray background
      border: '#E6E6E6', // Light border
      text: '#242424', // Primary text color
      comment: '#6B6B6B', // Medium gray
      keyword: '#1A8917', // Medium green
      string: '#4A90E2', // Medium blue
      number: '#1A8917', // Medium green
      function: '#292929', // Dark gray
    },
  },

  dark: {
    // Background hierarchy (Dark Medium style)
    background: {
      primary: '#0F0F0F', // Very dark background
      secondary: '#1A1A1A', // Dark gray background
      tertiary: '#2A2A2A', // Hover background
      elevated: '#1A1A1A', // Cards, modals
      glass: 'rgba(15, 15, 15, 0.95)', // Backdrop blur
    },

    // Text hierarchy (Dark Medium style)
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#B3B3B3', // Light gray
      tertiary: '#8B8B8B', // Medium gray
      muted: '#6B6B6B', // Dark gray
      inverse: '#0F0F0F', // For light backgrounds
    },

    // Brand colors (Dark Medium style)
    brand: {
      primary: '#1DB954', // Lighter green for dark mode
      secondary: '#5BA7F7', // Lighter blue for dark mode
      accent: '#FFD700', // Lighter yellow for dark mode
    },

    // Semantic colors (Dark Medium style)
    semantic: {
      success: '#1DB954', // Lighter green
      warning: '#FFD700', // Lighter yellow
      error: '#FF6B6B', // Lighter red
      info: '#5BA7F7', // Lighter blue
    },

    // Border colors (Dark Medium style)
    border: {
      light: '#2A2A2A', // Dark border
      medium: '#3A3A3A', // Medium dark border
      strong: '#B3B3B3', // Light border for contrast
      focus: '#1DB954', // Lighter green for focus
    },

    // Interactive states (Dark Medium style)
    interactive: {
      hover: '#2A2A2A', // Dark gray hover
      active: '#3A3A3A', // Medium dark active
      disabled: '#2A2A2A', // Dark gray disabled
      followButton: '#1DB954', // Lighter green button
      followButtonText: '#FFFFFF', // White button text
    },

    // Code highlighting (Dark Medium style)
    code: {
      background: '#1A1A1A', // Dark gray background
      border: '#2A2A2A', // Dark border
      text: '#FFFFFF', // White text
      comment: '#8B8B8B', // Medium gray
      keyword: '#1DB954', // Lighter green
      string: '#5BA7F7', // Lighter blue
      number: '#1DB954', // Lighter green
      function: '#FFFFFF', // White text
    },
  },
} as const

// Medium-Style Theme Configuration with CSS Custom Properties
export const themeConfig = {
  light: {
    // Shadcn UI variables (Medium style)
    '--background': themeColors.light.background.primary, // #FFFFFF
    '--foreground': themeColors.light.text.primary, // #242424
    '--card': themeColors.light.background.elevated, // #FFFFFF
    '--card-foreground': themeColors.light.text.primary, // #242424
    '--popover': themeColors.light.background.elevated, // #FFFFFF
    '--popover-foreground': themeColors.light.text.primary, // #242424
    '--primary': themeColors.light.brand.primary, // #1A8917
    '--primary-foreground': themeColors.light.text.inverse, // #FFFFFF
    '--secondary': themeColors.light.background.secondary, // #F7F4ED
    '--secondary-foreground': themeColors.light.text.primary, // #242424
    '--muted': themeColors.light.background.secondary, // #F7F4ED
    '--muted-foreground': themeColors.light.text.secondary, // #6B6B6B
    '--accent': themeColors.light.background.tertiary, // #F2F2F2
    '--accent-foreground': themeColors.light.text.primary, // #242424
    '--destructive': themeColors.light.semantic.error, // #E53E3E
    '--destructive-foreground': themeColors.light.text.inverse, // #FFFFFF
    '--border': themeColors.light.border.light, // #E6E6E6
    '--input': themeColors.light.border.light, // #E6E6E6
    '--ring': themeColors.light.border.focus, // #1A8917
    '--radius': '4px', // Medium border radius

    // Medium-specific semantic colors
    '--success': themeColors.light.semantic.success, // #1A8917
    '--warning': themeColors.light.semantic.warning, // #FFC017
    '--error': themeColors.light.semantic.error, // #E53E3E
    '--info': themeColors.light.semantic.info, // #4A90E2

    // Medium background variations
    '--bg-primary': themeColors.light.background.primary, // #FFFFFF
    '--bg-secondary': themeColors.light.background.secondary, // #F7F4ED
    '--bg-tertiary': themeColors.light.background.tertiary, // #F2F2F2
    '--bg-elevated': themeColors.light.background.elevated, // #FFFFFF
    '--bg-glass': themeColors.light.background.glass, // rgba(255, 255, 255, 0.95)

    // Medium text variations
    '--text-primary': themeColors.light.text.primary, // #242424
    '--text-secondary': themeColors.light.text.secondary, // #6B6B6B
    '--text-tertiary': themeColors.light.text.tertiary, // #8B8B8B
    '--text-muted': themeColors.light.text.muted, // #A0A0A0

    // Medium border variations
    '--border-light': themeColors.light.border.light, // #E6E6E6
    '--border-medium': themeColors.light.border.medium, // #D1D1D1
    '--border-strong': themeColors.light.border.strong, // #6B6B6B
    '--border-focus': themeColors.light.border.focus, // #1A8917

    // Medium interactive states
    '--hover-bg': themeColors.light.interactive.hover, // #F2F2F2
    '--active-bg': themeColors.light.interactive.active, // #E6E6E6
    '--disabled-bg': themeColors.light.interactive.disabled, // #F2F2F2
    '--follow-button': themeColors.light.interactive.followButton, // #1A8917
    '--follow-button-text': themeColors.light.interactive.followButtonText, // #FFFFFF

    // Medium code highlighting
    '--code-bg': themeColors.light.code.background, // #F7F4ED
    '--code-border': themeColors.light.code.border, // #E6E6E6
    '--code-text': themeColors.light.code.text, // #242424
    '--code-comment': themeColors.light.code.comment, // #6B6B6B
    '--code-keyword': themeColors.light.code.keyword, // #1A8917
    '--code-string': themeColors.light.code.string, // #4A90E2
    '--code-number': themeColors.light.code.number, // #1A8917
    '--code-function': themeColors.light.code.function, // #292929
  },

  dark: {
    // Shadcn UI variables (Dark Medium style)
    '--background': themeColors.dark.background.primary, // #0F0F0F
    '--foreground': themeColors.dark.text.primary, // #FFFFFF
    '--card': themeColors.dark.background.elevated, // #1A1A1A
    '--card-foreground': themeColors.dark.text.primary, // #FFFFFF
    '--popover': themeColors.dark.background.elevated, // #1A1A1A
    '--popover-foreground': themeColors.dark.text.primary, // #FFFFFF
    '--primary': themeColors.dark.brand.primary, // #1DB954
    '--primary-foreground': themeColors.dark.text.inverse, // #0F0F0F
    '--secondary': themeColors.dark.background.secondary, // #1A1A1A
    '--secondary-foreground': themeColors.dark.text.primary, // #FFFFFF
    '--muted': themeColors.dark.background.secondary, // #1A1A1A
    '--muted-foreground': themeColors.dark.text.secondary, // #B3B3B3
    '--accent': themeColors.dark.background.tertiary, // #2A2A2A
    '--accent-foreground': themeColors.dark.text.primary, // #FFFFFF
    '--destructive': themeColors.dark.semantic.error, // #FF6B6B
    '--destructive-foreground': themeColors.dark.text.primary, // #FFFFFF
    '--border': themeColors.dark.border.light, // #2A2A2A
    '--input': themeColors.dark.border.light, // #2A2A2A
    '--ring': themeColors.dark.border.focus, // #1DB954
    '--radius': '4px', // Medium border radius

    // Dark Medium-specific semantic colors
    '--success': themeColors.dark.semantic.success, // #1DB954
    '--warning': themeColors.dark.semantic.warning, // #FFD700
    '--error': themeColors.dark.semantic.error, // #FF6B6B
    '--info': themeColors.dark.semantic.info, // #5BA7F7

    // Dark Medium background variations
    '--bg-primary': themeColors.dark.background.primary, // #0F0F0F
    '--bg-secondary': themeColors.dark.background.secondary, // #1A1A1A
    '--bg-tertiary': themeColors.dark.background.tertiary, // #2A2A2A
    '--bg-elevated': themeColors.dark.background.elevated, // #1A1A1A
    '--bg-glass': themeColors.dark.background.glass, // rgba(15, 15, 15, 0.95)

    // Dark Medium text variations
    '--text-primary': themeColors.dark.text.primary, // #FFFFFF
    '--text-secondary': themeColors.dark.text.secondary, // #B3B3B3
    '--text-tertiary': themeColors.dark.text.tertiary, // #8B8B8B
    '--text-muted': themeColors.dark.text.muted, // #6B6B6B

    // Dark Medium border variations
    '--border-light': themeColors.dark.border.light, // #2A2A2A
    '--border-medium': themeColors.dark.border.medium, // #3A3A3A
    '--border-strong': themeColors.dark.border.strong, // #B3B3B3
    '--border-focus': themeColors.dark.border.focus, // #1DB954

    // Dark Medium interactive states
    '--hover-bg': themeColors.dark.interactive.hover, // #2A2A2A
    '--active-bg': themeColors.dark.interactive.active, // #3A3A3A
    '--disabled-bg': themeColors.dark.interactive.disabled, // #2A2A2A
    '--follow-button': themeColors.dark.interactive.followButton, // #1DB954
    '--follow-button-text': themeColors.dark.interactive.followButtonText, // #FFFFFF

    // Dark Medium code highlighting
    '--code-bg': themeColors.dark.code.background, // #1A1A1A
    '--code-border': themeColors.dark.code.border, // #2A2A2A
    '--code-text': themeColors.dark.code.text, // #FFFFFF
    '--code-comment': themeColors.dark.code.comment, // #8B8B8B
    '--code-keyword': themeColors.dark.code.keyword, // #1DB954
    '--code-string': themeColors.dark.code.string, // #5BA7F7
    '--code-number': themeColors.dark.code.number, // #1DB954
    '--code-function': themeColors.dark.code.function, // #FFFFFF
  },
} as const

// Theme utility functions
export const themeUtils = {
  /**
   * Apply theme to document root
   */
  applyTheme: (theme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const config = themeConfig[theme]

    // Apply CSS custom properties
    Object.entries(config).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    // Update class for compatibility
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  },

  /**
   * Get system preference
   */
  getSystemTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  },

  /**
   * Create media query listener for system theme changes
   */
  watchSystemTheme: (callback: (theme: 'light' | 'dark') => void) => {
    if (typeof window === 'undefined') return () => {}

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  },

  /**
   * Get color value from theme
   */
  getColor: (theme: 'light' | 'dark', colorPath: string): string => {
    const themeData = themeColors[theme]
    const path = colorPath.split('.')

    let value: Record<string, unknown> = themeData as Record<string, unknown>
    for (const key of path) {
      value = value?.[key] as Record<string, unknown>
    }

    return typeof value === 'string' ? value : ''
  },
} as const

// Presets for common theme configurations
export const themePresets = {
  // High contrast theme for accessibility
  highContrast: {
    light: {
      ...themeConfig.light,
      '--background': 'hsl(0 0% 100%)',
      '--foreground': 'hsl(0 0% 0%)',
      '--border': 'hsl(0 0% 0%)',
    },
    dark: {
      ...themeConfig.dark,
      '--background': 'hsl(0 0% 0%)',
      '--foreground': 'hsl(0 0% 100%)',
      '--border': 'hsl(0 0% 100%)',
    },
  },

  // Sepia theme for reading comfort
  sepia: {
    light: {
      ...themeConfig.light,
      '--background': 'hsl(39 77% 93%)',
      '--foreground': 'hsl(25 25% 15%)',
      '--card': 'hsl(39 77% 96%)',
    },
  },
} as const

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeColors = typeof themeColors
export type ThemeConfig = typeof themeConfig
