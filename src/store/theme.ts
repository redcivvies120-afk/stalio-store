// src/store/theme.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeType = 'clean-white' | 'obsidian-dark' | 'warm-minimal' | 'electric-cyan'

interface ThemeStore {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'clean-white',
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme)
        }
      },
    }),
    {
      name: 'stalio-theme-storage',
    }
  )
)
