'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BlogLayoutProps {
  children: React.ReactNode
  variant?: 'default' | 'wide' | 'narrow'
  className?: string
}

/**
 * Blog-specific layout component with consistent spacing and responsive design
 * Provides standardized container widths and spacing for blog content
 */
export function BlogLayout({ 
  children, 
  variant = 'default',
  className 
}: BlogLayoutProps) {
  return (
    <div className={cn(
      // Base layout styles
      "mx-auto px-4 sm:px-6 lg:px-8",
      "transition-all duration-300 ease-in-out",
      
      // Variant-specific widths
      variant === 'narrow' && "max-w-2xl",
      variant === 'default' && "max-w-4xl",
      variant === 'wide' && "max-w-6xl",
      
      // Responsive adjustments
      "w-full",
      
      className
    )}>
      {children}
    </div>
  )
}

interface BlogSectionProps {
  children: React.ReactNode
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}

/**
 * Blog section wrapper with consistent vertical spacing
 */
export function BlogSection({ 
  children, 
  className,
  spacing = 'normal'
}: BlogSectionProps) {
  return (
    <section className={cn(
      // Base spacing
      "w-full",
      
      // Vertical spacing variants
      spacing === 'tight' && "space-y-4",
      spacing === 'normal' && "space-y-6",
      spacing === 'loose' && "space-y-8",
      
      className
    )}>
      {children}
    </section>
  )
}

interface BlogContainerProps {
  children: React.ReactNode
  className?: string
  centered?: boolean
}

/**
 * Blog content container with optimal reading width
 */
export function BlogContainer({ 
  children, 
  className,
  centered = true
}: BlogContainerProps) {
  return (
    <div className={cn(
      // Optimal reading width (approx 65-75 characters per line)
      "max-w-[65ch] leading-relaxed",
      
      // Centering
      centered && "mx-auto",
      
      // Responsive typography
      "text-base sm:text-lg",
      "font-normal text-foreground",
      
      className
    )}>
      {children}
    </div>
  )
}

export { BlogLayout as default }