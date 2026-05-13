import { create } from 'zustand'

interface UIState {
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
  isReviewModalOpen: boolean
  setReviewModalOpen: (open: boolean) => void
  selectedGameId: number | null
  setSelectedGameId: (id: number | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  isReviewModalOpen: false,
  setReviewModalOpen: (open) => set({ isReviewModalOpen: open }),
  selectedGameId: null,
  setSelectedGameId: (id) => set({ selectedGameId: id }),
}))
