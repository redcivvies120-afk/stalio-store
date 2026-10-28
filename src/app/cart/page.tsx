'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import {
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Tag,
  Truck,
  Check,
  ShieldCheck,
} from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQty, removeItem, clearCart, subtotal } = useCart()
  const [mounted, setMounted] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [appliedCode, setAppliedCode] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const cartSubtotal = subtotal()

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()

    if (!code) return

    if (code === 'WELCOME10') {
      if (cartSubtotal < 1000) {
        setCouponError('Minimum order amount for WELCOME10 is ৳1,000')
        return
      }
      const disc = Math.min(500, Math.round(cartSubtotal * 0.1))
      setCouponDiscount(disc)
      setAppliedCode('WELCOME10 (10% OFF)')
      setCouponCode('')
    } else if (code === 'STALIO500' || code === 'RISHAN500') {
      if (cartSubtotal < 3000) {
        setCouponError('Minimum order amount for STALIO500 is ৳3,000')
        return
      }
      setCouponDiscount(500)
      setAppliedCode('STALIO500 (৳500 OFF)')
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code. Try "WELCOME10"')
    }
  }

  const shippingFee = cartSubtotal >= 2500 ? 0 : 60
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Explore our collection of mechanical keyboards, monitor screenbars, and desk gear.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-sky-600 transition"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {items.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-sky-600 transition">
                    {item.name}
                  </h3>
                </Link>
                {item.variantName && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                    {item.variantName}
                  </span>
                )}
                <div className="text-sm font-extrabold text-sky-600 pt-1">
                  {formatBDT(item.price)}
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-20 text-right font-black text-slate-900 text-sm">
                  {formatBDT(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Order Summary
            </h2>

            {/* Subtotals */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatBDT(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCode})</span>
                  <span>-{formatBDT(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Delivery (Dhaka)</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatBDT(shippingFee)
                  )}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-sky-600" />
                <span>Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}
              {appliedCode && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" />
                  <span>Promo applied: {appliedCode}</span>
                </p>
              )}
            </form>

            {/* Total */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-900">Estimated Total</span>
              <span className="text-2xl font-black text-sky-600">{formatBDT(finalTotal)}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 transition active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cash on delivery &amp; online payment available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
