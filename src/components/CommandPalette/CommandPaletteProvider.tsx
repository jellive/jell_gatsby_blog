'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { PostData } from '@/lib/markdown'
import CommandPalette from './index'

interface CommandPaletteContextType {
  isOpen: boolean
  openPalette: () => void
  closePalette: () => void
  togglePalette: () => void
  allPosts: PostData[]
  setAllPosts: (posts: PostData[]) => void
}

const CommandPaletteContext = createContext<
  CommandPaletteContextType | undefined
>(undefined)

// Default values for SSR/static rendering
const defaultContextValue: CommandPaletteContextType = {
  isOpen: false,
  openPalette: () => {},
  closePalette: () => {},
  togglePalette: () => {},
  allPosts: [],
  setAllPosts: () => {},
}

export const useCommandPalette = (): CommandPaletteContextType => {
  const context = useContext(CommandPaletteContext)
  // Return default values during SSR or when provider is not available
  if (context === undefined) {
    return defaultContextValue
  }
  return context
}

interface CommandPaletteProviderProps {
  children: React.ReactNode
}

export function CommandPaletteProvider({
  children,
}: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [allPosts, setAllPosts] = useState<PostData[]>([])

  const openPalette = () => setIsOpen(true)
  const closePalette = () => setIsOpen(false)
  const togglePalette = () => setIsOpen(prev => !prev)

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        togglePalette()
      }

      // ESC to close
      if (event.key === 'Escape' && isOpen) {
        closePalette()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const value: CommandPaletteContextType = {
    isOpen,
    openPalette,
    closePalette,
    togglePalette,
    allPosts,
    setAllPosts,
  }

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {/* Global Command Palette */}
      <CommandPalette
        allPosts={allPosts}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </CommandPaletteContext.Provider>
  )
}
