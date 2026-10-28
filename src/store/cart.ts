// src/store/cart.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number | null
  quantity: number
  variantName?: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number; openDrawer?: boolean }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming) => {
        const items = get().items
        const itemKey = incoming.id || `${incoming.productId}-${incoming.variantName || 'default'}`
        const existing = items.find((i) => i.id === itemKey)

        if (existing) {
          const newQty = Math.min(existing.quantity + (incoming.quantity || 1), incoming.stock || 99)
          set({
            items: items.map((i) => (i.id === itemKey ? { ...i, quantity: newQty } : i)),
            isOpen: incoming.openDrawer !== false,
          })
        } else {
          set({
            items: [
              ...items,
              {
                ...incoming,
                id: itemKey,
                quantity: incoming.quantity || 1,
              },
            ],
            isOpen: incoming.openDrawer !== false,
          })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: Math.min(qty, i.stock || 99) } : i)),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'stalio-cart-storage',
    }
  )
)
