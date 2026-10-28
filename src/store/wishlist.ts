// src/store/wishlist.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number | null
}

interface WishlistStore {
  items: WishlistItem[]
  toggleItem: (item: WishlistItem) => void
  hasItem: (productId: string) => boolean
  removeItem: (productId: string) => void
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const items = get().items
        const exists = items.some((i) => i.productId === item.productId)
        if (exists) {
          set({ items: items.filter((i) => i.productId !== item.productId) })
        } else {
          set({ items: [...items, item] })
        }
      },
      hasItem: (productId) => get().items.some((i) => i.productId === productId),
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'stalio-wishlist-storage',
    }
  )
)
