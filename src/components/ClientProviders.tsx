'use client'

import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CommandPaletteProvider>{children}</CommandPaletteProvider>
}
