'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatBDT } from '@/lib/utils'
import {
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  Package,
  Truck,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
  Plus,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const isAuth = localStorage.getItem('stalio_admin_auth') || localStorage.getItem('rishan_admin_auth')
    if (!isAuth) {
      router.push('/admin')
      return
    }
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('rishan_admin_auth')
    router.push('/admin')
  }

  if (!mounted) return null

  // KPI calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0)
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length
  const completedOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Stalio Admin &amp; Seller Portal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>

          <button
            onClick={loadOrders}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Total Store Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatBDT(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Live order total</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Total Orders Placed</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {orders.length}
          </div>
          <span className="text-[11px] text-sky-600 font-semibold">All channels</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Pending Processing</span>
          <div className="text-xl sm:text-2xl font-black text-amber-500">
            {pendingOrders}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Action required</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Fulfilled &amp; Delivered</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            {completedOrders}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Completed orders</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">View real-time orders, customer contact and update delivery status.</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {orders.length} Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer &amp; Phone</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Items</th>
                <th className="py-3.5 px-6">Total (BDT)</th>
                <th className="py-3.5 px-6">Status (Live Update)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{o.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{o.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{o.city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{o.addressLine}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-semibold">{o.items?.length || 1} items</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {o.items?.[0]?.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatBDT(o.totalAmount)}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        via {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={o.orderStatus}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold focus:outline-none transition ${
                          o.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : o.orderStatus === 'SHIPPED'
                            ? 'bg-sky-50 text-sky-700 border-sky-300'
                            : o.orderStatus === 'PROCESSING'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped (In Transit)</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
