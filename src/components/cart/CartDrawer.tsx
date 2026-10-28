'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react'

export function CartDrawer() {
  const router = useRouter()
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, itemCount } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const freeShippingThreshold = 2500
  const currentSubtotal = subtotal()
  const progressPercent = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100))
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-neutral-900" />
              <h2 className="text-sm font-bold text-neutral-900">
                Shopping Bag ({itemCount()})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-neutral-800">
                <Truck className="w-3.5 h-3.5 text-neutral-600" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatBDT(remainingForFreeShipping)} for FREE Delivery`
                  : 'Free Delivery unlocked'}
              </span>
              <span className="text-neutral-500 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Explore our curated collection of desk gear and accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart()
                    router.push('/products')
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 items-center">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {item.variantName}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-sky-600">
                        {formatBDT(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatBDT(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatBDT(currentSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {remainingForFreeShipping === 0 ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-base font-extrabold text-sky-600">
                  {formatBDT(currentSubtotal)}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCart()
                    router.push('/checkout')
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 transition active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>

                <button
                  onClick={() => {
                    closeCart()
                    router.push('/cart')
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition"
                >
                  View Full Cart
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                🔒 Safe &amp; Secure Checkout | Cash on Delivery Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
