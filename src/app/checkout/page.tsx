'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { formatBDT } from '@/lib/utils'
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('Dhaka')
  const [area, setArea] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'nationwide'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD' | 'CARD'>('COD')
  const [notes, setNotes] = useState('')

  // Promo Code
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const cartSubtotal = subtotal()

  // Shipping calculation
  let shippingFee = 60
  if (city === 'Dhaka') {
    if (shippingMethod === 'express') {
      shippingFee = 150
    } else {
      shippingFee = cartSubtotal >= 2500 ? 0 : 60
    }
  } else {
    shippingFee = 120
  }

  const totalAmount = Math.max(0, cartSubtotal - discount + shippingFee)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponMsg('')
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    if (code === 'WELCOME10') {
      if (cartSubtotal < 1000) {
        setCouponMsg('Minimum order amount for WELCOME10 is ৳1,000')
        return
      }
      const disc = Math.min(500, Math.round(cartSubtotal * 0.1))
      setDiscount(disc)
      setCouponMsg('✅ 10% discount applied!')
    } else if (code === 'STALIO500' || code === 'RISHAN500') {
      if (cartSubtotal < 3000) {
        setCouponMsg('Minimum order amount is ৳3,000')
        return
      }
      setDiscount(500)
      setCouponMsg('✅ ৳500 discount applied!')
    } else {
      setCouponMsg('❌ Invalid coupon code')
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim()) {
      setError('Please fill in your name, active phone number, and delivery address.')
      return
    }

    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          area: area.trim(),
          postalCode: postalCode.trim(),
          paymentMethod,
          shippingMethodName: shippingMethod,
          shippingFee,
          discount,
          notes: notes.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            variantName: i.variantName,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to place order. Please try again.')
        setLoading(false)
        return
      }

      // Success! Clear cart and redirect
      clearCart()
      router.push(`/order-confirmed?orderNumber=${data.order.orderNumber}`)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Your cart is empty</h1>
        <p className="text-xs text-slate-500">Please add items to cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout &amp; Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your order below. Pay via Cash on Delivery or Mobile Payment.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Form: Customer & Shipping (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900">Customer Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahir Labib"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number (Active Mobile) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address (For Invoice)
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="text-base font-bold text-slate-900">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Detailed Address (House, Road, Area, Landmark) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 42, Road 11, Block D, Banani"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City / Division <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      if (e.target.value !== 'Dhaka') {
                        setShippingMethod('nationwide')
                      } else {
                        setShippingMethod('standard')
                      }
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="Dhaka">Dhaka City</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Other">Other City / District</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Area / Thana / Upazila
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Banani / Dhanmondi"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver after 3 PM or call before arrival"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>

            {/* 3. Shipping Options */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h2 className="text-base font-bold text-slate-900">Shipping Method</h2>
              </div>

              <div className="space-y-2.5">
                {city === 'Dhaka' ? (
                  <>
                    <label
                      onClick={() => setShippingMethod('standard')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        shippingMethod === 'standard'
                          ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-sky-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Inside Dhaka (Standard)</div>
                          <div className="text-[11px] text-slate-500">Delivery in 24 - 48 Hours</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {cartSubtotal >= 2500 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          '৳60'
                        )}
                      </span>
                    </label>

                    <label
                      onClick={() => setShippingMethod('express')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        shippingMethod === 'express'
                          ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-amber-500" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Express Same-Day Dhaka</div>
                          <div className="text-[11px] text-slate-500">Guaranteed delivery within 6 hours</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">৳150</span>
                    </label>
                  </>
                ) : (
                  <label
                    onClick={() => setShippingMethod('nationwide')}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-sky-600 bg-sky-50/40 ring-1 ring-sky-600 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-sky-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Nationwide Courier (Outside Dhaka)</div>
                        <div className="text-[11px] text-slate-500">Delivery via Steadfast/Sundarban in 2-4 Days</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">৳120</span>
                  </label>
                )}
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <h2 className="text-base font-bold text-slate-900">Payment Option</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === 'COD'
                      ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                    <div className="text-[10px] text-slate-500">Pay when you receive package</div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === 'BKASH'
                      ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-pink-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">bKash Mobile Payment</div>
                    <div className="text-[10px] text-slate-500">Fast digital transfer</div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('NAGAD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === 'NAGAD'
                      ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Nagad Mobile Wallet</div>
                    <div className="text-[10px] text-slate-500">Direct mobile pay</div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === 'CARD'
                      ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Debit / Credit Card</div>
                    <div className="text-[10px] text-slate-500">Visa / Mastercard / Amex</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                Order Review ({items.length} items)
              </h3>

              {/* Items Thumbnail List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {item.variantName ? `${item.variantName} • ` : ''}Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {formatBDT(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo input */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && <p className="text-[11px] font-semibold">{couponMsg}</p>}
              </div>

              {/* Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatBDT(cartSubtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatBDT(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : formatBDT(shippingFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-sky-600">{formatBDT(totalAmount)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 transition active:scale-[0.99] disabled:opacity-50"
              >
                <span>{loading ? 'Processing Order...' : 'Confirm Order (Place Order)'}</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>

              <div className="space-y-1 text-center text-[11px] text-slate-400 pt-1">
                <p>🔒 100% Risk Free • Check parcel before payment</p>
                <p>Customer Support: +880 1700 000 000</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
