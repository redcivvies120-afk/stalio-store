'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatBDT } from '@/lib/utils'
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  Phone,
} from 'lucide-react'

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchOrder = async (searchTerm: string) => {
    if (!searchTerm.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchTerm.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        setOrder(null)
        setError('No order found with this Order ID or Phone number.')
      }
    } catch {
      setError('Failed to fetch tracking details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      fetchOrder(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrder(query)
  }

  const statusLevels: Record<string, number> = {
    PENDING: 1,
    CONFIRMED: 2,
    PROCESSING: 3,
    SHIPPED: 4,
    DELIVERED: 5,
    CANCELLED: 0,
  }

  const currentLevel = statusLevels[order?.orderStatus || 'PENDING'] || 1

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Shipment Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Track Your Stalio Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order ID (e.g. <span className="font-mono font-bold text-slate-700">STL-7842-9910</span>) or mobile number to track live status.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-md p-1.5">
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input
            type="text"
            required
            placeholder="Enter Order ID or mobile number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3 py-2 bg-transparent focus:outline-none text-slate-900 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow transition"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Result Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Top Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block">Tracking Order</span>
              <span className="text-lg font-mono font-black text-slate-900">{order.orderNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                {order.orderStatus}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {formatBDT(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Shipment Progress
            </h3>

            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { title: 'Placed', icon: Clock, step: 1 },
                { title: 'Confirmed', icon: CheckCircle2, step: 2 },
                { title: 'Processing', icon: Package, step: 3 },
                { title: 'In Transit', icon: Truck, step: 4 },
                { title: 'Delivered', icon: MapPin, step: 5 },
              ].map((s) => {
                const Icon = s.icon
                const isPassed = currentLevel >= s.step
                const isCurrent = currentLevel === s.step

                return (
                  <div key={s.step} className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition ${
                        isPassed
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                          : 'bg-slate-100 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-sky-100' : ''}`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold ${
                        isPassed ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Recipient Info</span>
              <p className="text-slate-600"><span className="font-semibold">Name:</span> {order.customerName}</p>
              <p className="text-slate-600"><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
              <p className="text-slate-600"><span className="font-semibold">Address:</span> {order.addressLine}, {order.city}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Courier &amp; Logistics</span>
              <p className="text-slate-600">
                <span className="font-semibold">Courier Tracking:</span>{' '}
                <span className="font-mono text-sky-600 font-bold">{order.trackingNumber || 'Assigned on dispatch'}</span>
              </p>
              <p className="text-slate-600">
                <span className="font-semibold">Payment:</span> {order.paymentMethod} ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Package Items</h4>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="text-slate-400 text-[11px] block">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatBDT(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
