# Modern Tech Blog Design System

## Overview

A comprehensive design system optimized for developer-focused content, modern typography, and technical documentation. This system prioritizes readability, code highlighting, and developer experience.

## Color System

### Primary Palette

- **Primary**: `#3b82f6` (Blue 500) - Links, CTAs, primary actions
- **Primary Hover**: `#2563eb` (Blue 600) - Interactive states
- **Secondary**: `#64748b` (Slate 500) - Secondary text, metadata
- **Accent**: `#06b6d4` (Cyan 500) - Highlights, notifications

### Neutral System

- **Background**: `#ffffff` (Light) / `#0f172a` (Dark)
- **Surface**: `#f8fafc` (Light) / `#1e293b` (Dark)
- **Border**: `#e2e8f0` (Light) / `#334155` (Dark)
- **Text Primary**: `#0f172a` (Light) / `#f8fafc` (Dark)
- **Text Secondary**: `#64748b` (Light/Dark)
- **Text Muted**: `#94a3b8` (Light/Dark)

### Semantic Colors

- **Success**: `#10b981` (Emerald 500)
- **Warning**: `#f59e0b` (Amber 500)
- **Error**: `#ef4444` (Red 500)
- **Info**: `#06b6d4` (Cyan 500)

## Typography

### Font Stack

- **Primary**: `'SF Pro Display', 'Noto Sans KR', system-ui, -apple-system, sans-serif`
- **Mono**: `'SF Mono', 'Monaco', 'Consolas', 'Noto Sans Mono', monospace`
- **Serif**: `'SF Pro Display', 'Noto Serif KR', Georgia, serif`

### Scale System

- **Display**: 48px/52px (3rem/3.25rem) - Hero titles
- **H1**: 36px/40px (2.25rem/2.5rem) - Page titles
- **H2**: 30px/36px (1.875rem/2.25rem) - Section headers
- **H3**: 24px/32px (1.5rem/2rem) - Subsection headers
- **H4**: 20px/28px (1.25rem/1.75rem) - Component headers
- **Body Large**: 18px/28px (1.125rem/1.75rem) - Lead text
- **Body**: 16px/24px (1rem/1.5rem) - Regular text
- **Body Small**: 14px/20px (0.875rem/1.25rem) - Captions
- **Caption**: 12px/16px (0.75rem/1rem) - Labels, metadata

### Font Weights

- **Light**: 300 - Large headings, display text
- **Regular**: 400 - Body text, default
- **Medium**: 500 - Emphasis, buttons
- **Semibold**: 600 - Headings, important text
- **Bold**: 700 - Strong emphasis

## Spacing System

### Base Unit: 4px

- **0**: 0px
- **1**: 4px (0.25rem)
- **2**: 8px (0.5rem)
- **3**: 12px (0.75rem)
- **4**: 16px (1rem)
- **5**: 20px (1.25rem)
- **6**: 24px (1.5rem)
- **8**: 32px (2rem)
- **10**: 40px (2.5rem)
- **12**: 48px (3rem)
- **16**: 64px (4rem)
- **20**: 80px (5rem)
- **24**: 96px (6rem)

### Component Spacing

- **Content Padding**: 24px (1.5rem)
- **Section Margin**: 48px (3rem)
- **Element Gap**: 16px (1rem)
- **Compact Gap**: 8px (0.5rem)

## Layout System

### Breakpoints

- **sm**: 640px - Mobile landscape
- **md**: 768px - Tablet portrait
- **lg**: 1024px - Tablet landscape
- **xl**: 1280px - Desktop
- **2xl**: 1536px - Large desktop

### Grid System

- **Container Max**: 1200px
- **Content Max**: 800px (optimal reading width)
- **Sidebar**: 240px
- **Navigation**: 64px height

### Layout Tokens

- **Header Height**: 64px
- **Footer Height**: auto (min 120px)
- **Sidebar Width**: 240px
- **Content Max Width**: 800px
- **Container Padding**: 24px (lg: 32px)

## Component System

### Buttons

#### Primary Button

- **Background**: Primary color
- **Text**: White
- **Padding**: 12px 24px (3 6)
- **Border Radius**: 8px (2)
- **Font Weight**: Medium (500)
- **Height**: 44px
- **Hover**: Primary hover color, slight shadow

#### Secondary Button

- **Background**: Transparent
- **Border**: 1px solid border color
- **Text**: Primary text color
- **Padding**: 12px 24px
- **Hover**: Background surface color

#### Ghost Button

- **Background**: Transparent
- **Text**: Secondary text color
- **Padding**: 12px 16px
- **Hover**: Background surface color

### Cards

#### Base Card

- **Background**: Surface color
- **Border**: 1px solid border color
- **Border Radius**: 12px (3)
- **Padding**: 24px (6)
- **Shadow**: Subtle (0 1px 3px rgba(0,0,0,0.1))

#### Article Card

- **Hover**: Slight lift (0 4px 12px rgba(0,0,0,0.15))
- **Transition**: All 200ms ease
- **Title**: H3 size, semibold weight
- **Meta**: Caption size, muted color
- **Excerpt**: Body small size, secondary color

### Code Blocks

#### Inline Code

- **Background**: Surface color with slight tint
- **Text**: Mono font, primary color
- **Padding**: 2px 6px
- **Border Radius**: 4px (1)
- **Font Size**: 0.875em relative to parent

#### Code Block

- **Background**: Dark surface (#1e293b)
- **Text**: Light text (#f8fafc)
- **Padding**: 24px (6)
- **Border Radius**: 12px (3)
- **Font**: Mono stack
- **Line Height**: 1.5
- **Overflow**: Auto scroll

### Navigation

#### Header Navigation

- **Height**: 64px
- **Background**: Surface with blur backdrop
- **Border**: Bottom border
- **Sticky**: Top positioned
- **Items**: Medium weight, primary color
- **Active State**: Accent color

#### Breadcrumbs

- **Font Size**: Body small
- **Color**: Muted text
- **Separator**: "/" or "›"
- **Hover**: Primary color

### Form Elements

#### Input Fields

- **Height**: 44px
- **Padding**: 12px 16px
- **Border**: 1px solid border color
- **Border Radius**: 8px
- **Font Size**: Body
- **Focus**: Primary color border, subtle shadow

#### Labels

- **Font Size**: Body small
- **Font Weight**: Medium
- **Color**: Primary text
- **Margin Bottom**: 8px

## Interaction Design

### Hover States

- **Buttons**: Color change, subtle shadow
- **Cards**: Lift effect, border color change
- **Links**: Color change, underline
- **Duration**: 200ms ease

### Focus States

- **Ring**: 2px solid primary color
- **Offset**: 2px
- **Border Radius**: Matches component

### Loading States

- **Skeleton**: Animated gradient
- **Spinner**: Primary color, 24px size
- **Progress**: Primary color bar

## Accessibility

### Contrast Requirements

- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **Non-text**: 3:1 minimum

### Focus Management

- **Visible Focus**: Always present
- **Logical Order**: Tab sequence follows visual flow
- **Skip Links**: Available for main content

### Screen Reader Support

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Descriptive and complete
- **Alt Text**: Meaningful for images

## Code Highlighting

### Syntax Themes

#### Light Theme

- **Background**: `#f8fafc`
- **Text**: `#334155`
- **Keywords**: `#0f172a` (Bold)
- **Strings**: `#059669`
- **Comments**: `#64748b`
- **Numbers**: `#dc2626`
- **Functions**: `#3b82f6`

#### Dark Theme

- **Background**: `#1e293b`
- **Text**: `#e2e8f0`
- **Keywords**: `#f8fafc` (Bold)
- **Strings**: `#34d399`
- **Comments**: `#64748b`
- **Numbers**: `#f87171`
- **Functions**: `#60a5fa`

## Implementation Guidelines

### CSS Custom Properties Structure

```css
:root {
  /* Colors */
  --color-primary: 59 130 246;
  --color-primary-hover: 37 99 235;
  --color-secondary: 100 116 139;

  /* Typography */
  --font-sans:
    'SF Pro Display', 'Noto Sans KR', system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', 'Monaco', 'Consolas', 'Noto Sans Mono', monospace;

  /* Spacing */
  --spacing-unit: 4px;
  --content-padding: 24px;
  --section-margin: 48px;

  /* Layout */
  --header-height: 64px;
  --sidebar-width: 240px;
  --content-max-width: 800px;
}
```

### Tailwind Configuration Extensions

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(59 130 246)',
          hover: 'rgb(37 99 235)',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Noto Sans KR',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'Noto Sans Mono', 'monospace'],
      },
      spacing: {
        content: '24px',
        section: '48px',
      },
    },
  },
}
```

### Component Architecture

- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Composition**: Prefer composition over inheritance
- **Props Interface**: TypeScript strict typing
- **Accessibility**: Built-in ARIA support

## Performance Considerations

### Bundle Optimization

- **Tree Shaking**: Component-level imports
- **CSS Purging**: Remove unused styles
- **Image Optimization**: WebP format, responsive sizing
- **Font Loading**: Preload critical fonts

### Runtime Performance

- **CSS Variables**: Hardware-accelerated theme switching
- **Intersection Observer**: Lazy loading implementation
- **Virtual Scrolling**: For large lists
- **Debounced Interactions**: Smooth user experience

## Testing Strategy

### Visual Regression

- **Component Screenshots**: Automated testing
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: All breakpoint verification

### Accessibility Testing

- **Screen Reader**: NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Tab order verification
- **Color Contrast**: Automated and manual testing

## Migration Guidelines

### From Existing System

1. **Audit Current**: Document existing patterns
2. **Map Components**: Create compatibility layer
3. **Gradual Migration**: Page-by-page conversion
4. **Testing**: Verify functionality at each step
5. **Documentation**: Update style guide

### Breaking Changes

- **Color Tokens**: All hex values to RGB for CSS variables
- **Spacing Scale**: 4px base unit system
- **Typography**: New font stack and scale
- **Component API**: Updated prop interfaces

This design system provides a solid foundation for modern, accessible, and performant web applications with a focus on developer experience and technical content presentation.
