import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '24px', // Modern Tech content padding
      screens: {
        sm: '640px',
        md: '768px', // Modern Tech tablet portrait
        lg: '1024px', // Modern Tech tablet landscape
        xl: '1280px', // Modern Tech desktop
        '2xl': '1200px', // Modern Tech max container width
      },
    },
    screens: {
      mobile: '768px', // Modern Tech tablet portrait
      tablet: '1024px', // Modern Tech tablet landscape
      desktop: '1280px', // Modern Tech desktop
      sm: '640px', // Mobile landscape
      md: '768px', // Tablet portrait
      lg: '1024px', // Tablet landscape
      xl: '1280px', // Desktop
      '2xl': '1536px', // Large desktop
    },
    extend: {
      // Modern Tech color system
      colors: {
        // Shadcn UI color variables
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },

      // Modern Tech border radius
      borderRadius: {
        lg: '8px', // Modern Tech large radius (default)
        md: '6px', // Modern Tech medium radius
        sm: '4px', // Modern Tech small radius
        xl: '12px', // Modern Tech extra large radius
        pill: '999px', // Modern Tech pill buttons
        tag: '6px', // Modern Tech tags
      },

      // Modern Tech font system with Pretendard
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Cascadia Code',
          'SF Mono',
          'Monaco',
          'Consolas',
          'Noto Sans Mono',
          'monospace',
        ],
        serif: [
          'Noto Serif KR',
          'Apple SD Gothic Neo',
          'Charter',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
        // Legacy aliases for backward compatibility
        system: [
          'Pretendard Variable',
          'Pretendard',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        'nanum-gothic': [
          'Pretendard Variable',
          'Pretendard',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        'noto-serif-kr': [
          'Noto Serif KR',
          'Apple SD Gothic Neo',
          'Charter',
          'Georgia',
          'serif',
        ],
        raleway: [
          'Pretendard Variable',
          'Pretendard',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },

      // Modern Tech font sizes
      fontSize: {
        xs: ['12px', { lineHeight: '16px', fontWeight: '400' }], // Caption
        sm: ['14px', { lineHeight: '20px', fontWeight: '400' }], // Small
        base: ['16px', { lineHeight: '24px', fontWeight: '400' }], // Body
        lg: ['18px', { lineHeight: '28px', fontWeight: '400' }], // Body large
        xl: ['20px', { lineHeight: '28px', fontWeight: '500' }], // H4
        '2xl': ['24px', { lineHeight: '32px', fontWeight: '600' }], // H3
        '3xl': ['30px', { lineHeight: '36px', fontWeight: '600' }], // H2
        '4xl': ['36px', { lineHeight: '40px', fontWeight: '600' }], // H1
        '5xl': ['48px', { lineHeight: '52px', fontWeight: '300' }], // Display
        '6xl': ['60px', { lineHeight: '64px', fontWeight: '300' }], // Hero
      },

      // Modern Tech line heights
      lineHeight: {
        caption: '16px', // Caption line height
        small: '20px', // Small line height
        body: '24px', // Body line height
        'body-lg': '28px', // Body large line height
        h4: '28px', // H4 line height
        h3: '32px', // H3 line height
        h2: '36px', // H2 line height
        h1: '40px', // H1 line height
        display: '52px', // Display line height
        tight: '1.25', // Tailwind default
        normal: '1.5', // Tailwind default
        relaxed: '1.75', // Tailwind default
        loose: '2', // Tailwind default
      },

      // Modern Tech font weights
      fontWeight: {
        light: '300', // Light - Large headings
        regular: '400', // Regular - Body text
        medium: '500', // Medium - Buttons, emphasis
        semibold: '600', // Semibold - Headings
        bold: '700', // Bold - Strong emphasis
      },

      // Modern Tech spacing scale (4px base unit)
      spacing: {
        1: '4px', // Base unit
        2: '8px', // 2 units
        3: '12px', // 3 units
        4: '16px', // 4 units
        5: '20px', // 5 units
        6: '24px', // 6 units (content padding)
        8: '32px', // 8 units
        10: '40px', // 10 units
        12: '48px', // 12 units (section margin)
        16: '64px', // 16 units
        20: '80px', // 20 units
        24: '96px', // 24 units
        // Legacy aliases
        xs: '8px', // Legacy xs spacing
        sm: '12px', // Legacy sm spacing
        md: '16px', // Legacy md spacing
        lg: '24px', // Legacy lg spacing
        xl: '32px', // Legacy xl spacing
        xxl: '48px', // Legacy xxl spacing
        // Component specific spacing
        content: '24px', // Content padding
        section: '48px', // Section margin
        'element-gap': '16px', // Element gap
        'compact-gap': '8px', // Compact gap
      },

      // Modern Tech layout widths
      maxWidth: {
        container: '1200px', // Modern Tech container max width
        content: '800px', // Modern Tech content max width (optimal reading)
        sidebar: '240px', // Modern Tech sidebar width
        navigation: '240px', // Modern Tech navigation width
        // Legacy aliases
        main: '800px', // Legacy main content width
        aside: '240px', // Legacy aside width
      },

      // Modern Tech component sizes
      width: {
        'article-image': '120px', // Article image width
        'avatar-small': '24px', // Small avatar
        'avatar-medium': '32px', // Medium avatar
        'avatar-large': '48px', // Large avatar
        button: '44px', // Button width
        input: '44px', // Input width
      },

      height: {
        'article-image': '120px', // Article image height
        'avatar-small': '24px', // Small avatar
        'avatar-medium': '32px', // Medium avatar
        'avatar-large': '48px', // Large avatar
        header: '64px', // Header height (Modern Tech)
        button: '44px', // Button height
        input: '44px', // Input height
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 10s linear infinite',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },

      // Modern Tech grid system
      gridTemplateColumns: {
        'modern-3': '240px 800px 240px', // Modern Tech 3-column layout (sidebar + main + aside)
        'modern-2': '240px 1fr', // Modern Tech 2-column layout (sidebar + main)
        'modern-main': '1fr 240px', // Main + aside layout
        'modern-full': '1fr', // Single column (mobile)
        'modern-container': 'minmax(0, 1200px)', // Container layout
        // Legacy aliases
        'medium-3': '240px 800px 240px',
        'medium-2': '240px 1fr',
        'medium-main': '1fr 240px',
        'medium-full': '1fr',
      },

      // Modern Tech gaps (4px base unit)
      gap: {
        1: '4px', // Base unit gap
        2: '8px', // 2 units gap
        3: '12px', // 3 units gap
        4: '16px', // 4 units gap
        6: '24px', // 6 units gap
        8: '32px', // 8 units gap
        12: '48px', // 12 units gap
        // Legacy aliases
        xs: '8px', // Legacy xs gap
        sm: '12px', // Legacy sm gap
        md: '16px', // Legacy md gap
        lg: '24px', // Legacy lg gap
        xl: '32px', // Legacy xl gap
        xxl: '48px', // Legacy xxl gap
        content: '24px', // Content gap
        element: '16px', // Element gap
        compact: '8px', // Compact gap
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
