'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fa } from '@/components/FontAwesome/Fa'
import { faHome, faSearch, faTags } from '@fortawesome/free-solid-svg-icons'

/**
 * Mobile Bottom Navigation Component
 *
 * Provides touch-friendly navigation for mobile devices with proper sizing
 * and spacing.
 *
 * Requirements:
 * - Touch target size: minimum 48x48px (using h-14 = 56px)
 * - Touch element spacing: minimum 8px (using gap-3 = 12px)
 * - Only visible on mobile/tablet (hidden on lg and above)
 * - Fixed positioning at bottom of viewport
 * - Proper ARIA labels for accessibility
 */

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      icon: faHome,
      label: '홈',
      ariaLabel: '홈으로 이동',
    },
    {
      href: '/search',
      icon: faSearch,
      label: '검색',
      ariaLabel: '검색 페이지로 이동',
    },
    {
      href: '/tags',
      icon: faTags,
      label: '태그',
      ariaLabel: '태그 페이지로 이동',
    },
  ]

  return (
    <nav
      className="bg-background/80 fixed bottom-0 left-0 right-0 z-50 border-t border-border backdrop-blur-md lg:hidden"
      role="navigation"
      aria-label="모바일 하단 네비게이션"
    >
      <div className="flex items-center justify-around gap-3 px-4 py-3">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-14 min-h-[48px] w-14 min-w-[48px] flex-col items-center justify-center rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground ' +
                    'hover:bg-accent'
              } touch-manipulation active:scale-95`}
            >
              <Fa icon={item.icon} className="mb-1 text-xl" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Spacing for safe area on iOS devices */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}
