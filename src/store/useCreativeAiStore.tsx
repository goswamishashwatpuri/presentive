import { OutlineCard } from '@/lib/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CreativeAiStore {
  outlines: OutlineCard[]
  addOutline: (outline: OutlineCard) => void
  addMultipleOutlines: (outlines: OutlineCard[]) => void
  currentAiPrompt: string
  setCurrentAiPrompt: (prompt: string) => void
  resetOutlines: () => void
}

const useCreativeAiStore = create<CreativeAiStore>()(
  persist(
    (set) => ({
      currentAiPrompt: "",
      setCurrentAiPrompt: (prompt: string) => {
        set({ currentAiPrompt: prompt })
      },
      outlines: [],
      addOutline: (outline: OutlineCard) => {
        set((state) => ({ outlines: [...state.outlines, outline] }))
      },
      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set((state) => ({ outlines: [...state.outlines, ...outlines] }))
      },
      resetOutlines: () => {
        set({ outlines: [] })
      },
    }),
    {
      name: 'creative-ai'
    },
  )
)
export default useCreativeAiStore;