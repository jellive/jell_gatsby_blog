import { create } from 'zustand'

interface HeaderStore {
  path: string
  size: string
  setPath: (path: string, size?: string) => void
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  path: '',
  size: '25px',
  setPath: (path, size) => set({ path, size: size || '25px' })
}))
