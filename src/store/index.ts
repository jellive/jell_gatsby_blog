import { create } from 'zustand'

interface LayoutState {
  path: string
  size: string
  setPath: (path: string, size?: string) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  path: '/',
  size: '25px',
  setPath: (path: string, size: string = '25px') => set({ path, size })
}))

interface SearchState {
  value: string
  isTitleOnly: boolean
  setValue: (value: string) => void
  setIsTitleOnly: (isTitleOnly: boolean) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  value: '',
  isTitleOnly: true,
  setValue: (value: string) => set({ value }),
  setIsTitleOnly: (isTitleOnly: boolean) => set({ isTitleOnly })
}))
