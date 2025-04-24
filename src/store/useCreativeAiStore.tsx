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
      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set(() => ({ outlines: [...outlines] }))
      },
      addOutline: (outline: OutlineCard) => {
        set((state) => ({ outlines: [outline, ...state.outlines] }))
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