/**
 * Design Tokens for Medium-Style Blog Design System
 * Centralized design values following Medium's design principles
 */

// Typography Scale (Medium-inspired, Korean-optimized)
export const typography = {
  fontFamilies: {
    // Medium-style system font stack
    system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // Fallback Korean fonts
    serif: 'var(--font-noto-serif-kr)',
    sans: 'var(--font-nanum-gothic)',
    mono: "'Nanum Gothic Coding', Consolas, Monaco, monospace",
    display: 'var(--font-raleway)',
  },
  
  fontSizes: {
    // Medium-inspired font scale
    xs: '0.8125rem',  // 13px - small text
    sm: '0.875rem',   // 14px - body regular
    base: '1rem',     // 16px - body large/h2
    lg: '1.125rem',   // 18px - large body
    xl: '1.25rem',    // 20px - large headings
    '2xl': '1.375rem', // 22px - h1 (Medium style)
    '3xl': '1.5rem',  // 24px
    '4xl': '1.875rem', // 30px
    '5xl': '2.25rem', // 36px
    '6xl': '3rem',    // 48px
  },
  
  fontWeights: {
    light: 300,
    normal: 400,    // Medium body text
    medium: 500,    // Medium buttons
    semibold: 600,  // Medium h2
    bold: 700,      // Medium h1
    black: 900,
  },
  
  lineHeights: {
    // Medium-inspired line heights
    tight: 1.25,     // 20px for 16px text
    normal: 1.43,    // 20px for 14px text (Medium style)
    relaxed: 1.75,   // 28px for 16px text (Medium h1)
    loose: 2,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  }
} as const

// Spacing Scale (Medium-style, 8px base unit)
export const spacing = {
  // Base spacing values
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px - xs (Medium)
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px - sm (Medium)
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px - md (Medium)
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px - lg (Medium)
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px - xl (Medium)
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px - xxl (Medium)
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px

  // Medium-specific spacing shortcuts
  mediumXs: '0.5rem',   // 8px
  mediumSm: '0.75rem',  // 12px
  mediumMd: '1rem',     // 16px
  mediumLg: '1.5rem',   // 24px
  mediumXl: '2rem',     // 32px
  mediumXxl: '3rem',    // 48px
} as const

// Border Radius Scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Circle
} as const

// Shadow System
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// Animation & Transition
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const

// Breakpoints (mobile-first)
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  
  // Legacy breakpoints (for compatibility)
  s: '559px',
  m: '839px',
  l: '1119px',
  toc: '1160px',
} as const

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090,
} as const

// Content Width Scale
export const contentWidth = {
  xs: '20rem',     // 320px
  sm: '24rem',     // 384px
  md: '28rem',     // 448px
  lg: '32rem',     // 512px
  xl: '36rem',     // 576px
  '2xl': '42rem',  // 672px
  '3xl': '48rem',  // 768px
  '4xl': '56rem',  // 896px
  '5xl': '64rem',  // 1024px
  '6xl': '72rem',  // 1152px
  '7xl': '80rem',  // 1280px
  
  // Blog-specific widths
  reading: '65ch',  // Optimal reading width
  article: '45rem', // 720px - main article width
  wide: '60rem',    // 960px - wide layouts
  full: '100%',     // Full width
} as const

// Medium-Style Color System
export const colors = {
  // Primary Medium colors
  primary: {
    background: '#FFFFFF',    // Pure white background
    text: '#242424',          // Dark text (Medium style)
    accent: '#1A8917',        // Medium green accent
  },
  
  // Secondary Medium colors  
  secondary: {
    lightGray: '#F7F4ED',     // Light gray background
    mediumGray: '#6B6B6B',    // Medium gray text
    darkGray: '#292929',      // Dark gray
  },
  
  // Interactive states (Medium style)
  interactive: {
    followButton: '#1A8917',      // Medium green for buttons
    followButtonText: '#FFFFFF',  // White text on green
    linkHover: '#1A8917',         // Green for hover states
    hoverBackground: '#F2F2F2',   // Light gray hover
  },
  
  // Notification colors (Medium style)
  notification: {
    yellow: '#FFC017',        // Medium yellow
    blue: '#4A90E2',          // Medium blue
  },
  
  // Status colors (adjusted for Medium style)
  success: '#1A8917',           // Medium green
  warning: '#FFC017',           // Medium yellow
  error: '#E53E3E',             // Medium red
  info: '#4A90E2',              // Medium blue
  
  // Social media brand colors
  social: {
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    reddit: '#FF4500',
    email: '#6B6B6B',         // Medium gray for email
  },
  
  // Code syntax highlighting (Medium style)
  syntax: {
    comment: '#6B6B6B',       // Medium gray
    keyword: '#1A8917',       // Medium green
    string: '#4A90E2',        // Medium blue
    number: '#1A8917',        // Medium green
    function: '#292929',      // Dark gray
    variable: '#242424',      // Primary text color
  },
  
  // Borders and dividers
  border: {
    light: '#E6E6E6',         // Light border
    medium: '#D1D1D1',        // Medium border
    dark: '#6B6B6B',          // Dark border
  }
} as const

// Medium-Style Component Tokens
export const components = {
  // Header (Medium style)
  header: {
    height: '56px',              // Fixed Medium header height
    backgroundColor: '#FFFFFF',  // White background
    borderBottom: '1px solid #E6E6E6',
    position: 'fixed',
    zIndex: 1000,
  },
  
  // Layout (Medium style)
  layout: {
    container: {
      maxWidth: '1192px',        // Medium container width
      margin: '0 auto',
      padding: '0 24px',
    },
    grid: {
      columns: 3,
      gap: '32px',
      sidebar: '280px',          // Medium sidebar width
      main: '728px',             // Medium main content width
      aside: '320px',            // Medium aside width
    },
  },
  
  // Cards (Medium style)
  card: {
    padding: '24px 0',           // Medium article card padding
    borderBottom: '1px solid #E6E6E6',
    borderRadius: '4px',
    image: {
      width: '112px',
      height: '112px',
      borderRadius: '4px',
      objectFit: 'cover',
    },
  },
  
  // Buttons (Medium style)
  button: {
    follow: {
      backgroundColor: '#1A8917',  // Medium green
      color: '#FFFFFF',
      border: '1px solid #1A8917',
      borderRadius: '99px',       // Pill shape
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    outlined: {
      backgroundColor: 'transparent',
      color: '#1A8917',
      border: '1px solid #1A8917',
      borderRadius: '99px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  // Avatar sizes (Medium style)
  avatar: {
    small: { width: '20px', height: '20px', borderRadius: '50%' },
    medium: { width: '32px', height: '32px', borderRadius: '50%' },
    large: { width: '48px', height: '48px', borderRadius: '50%' },
  },
  
  // Tags (Medium style)
  tags: {
    backgroundColor: '#F2F2F2',  // Light gray
    color: '#6B6B6B',           // Medium gray
    padding: '4px 8px',
    borderRadius: '12px',       // Rounded pill
    fontSize: '13px',
    fontWeight: '400',
  },
  
  // Sidebar navigation (Medium style)
  sidebar: {
    navigation: {
      width: '240px',
      backgroundColor: '#FFFFFF',
      padding: '32px 0',
      items: {
        padding: '8px 24px',
        borderRadius: '4px',
        hoverBackground: '#F2F2F2',
      },
    },
  },
} as const

// Reading experience optimizations
export const reading = {
  // Optimal line length for readability
  lineLength: {
    min: '45ch',
    ideal: '65ch',
    max: '75ch',
  },
  
  // Reading-friendly line heights
  lineHeight: {
    body: 1.7,      // For long-form content
    heading: 1.3,   // For headings
    caption: 1.5,   // For captions/meta
  },
  
  // Reading spacing
  paragraphSpacing: spacing[6],  // 24px between paragraphs
  headingSpacing: {
    above: spacing[8],  // 32px above headings
    below: spacing[4],  // 16px below headings
  },
} as const

// Accessibility tokens
export const accessibility = {
  // Minimum touch targets
  touchTarget: {
    min: '44px',
    comfortable: '48px',
  },
  
  // Focus indicators
  focusRing: {
    width: '2px',
    offset: '2px',
    color: colors.info,
  },
  
  // Text contrast ratios (WCAG AA)
  contrast: {
    normal: 4.5,   // For normal text
    large: 3,      // For large text (18px+ or 14px+ bold)
    enhanced: 7,   // For AAA compliance
  }
} as const

// Export all tokens as a single object for easy importing
export const designTokens = {
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  contentWidth,
  colors,
  components,
  reading,
  accessibility,
} as const

export type DesignTokens = typeof designTokens