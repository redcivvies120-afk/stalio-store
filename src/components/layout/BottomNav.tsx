'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { Home, Grid, ShoppingBag, Heart, Truck } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount, toggleCart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? itemCount() : 0
  const wishCount = mounted ? wishlistItems.length : 0

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
            pathname === '/' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/products"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
            pathname.startsWith('/products') ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Shop</span>
        </Link>

        {/* Center Cart Trigger */}
        <button
          onClick={toggleCart}
          className="relative -top-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30 active:scale-95 transition"
        >
          <ShoppingBag className="w-5 h-5 text-sky-400" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {count}
            </span>
          )}
        </button>

        <Link
          href="/products?filter=wishlist"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition relative ${
            pathname.includes('wishlist') ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </Link>

        <Link
          href="/track-order"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
            pathname === '/track-order' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Track</span>
        </Link>
      </div>
    </div>
  )
}
