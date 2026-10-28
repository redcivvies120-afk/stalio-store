import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatBDT } from '@/lib/utils'
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Phone,
} from 'lucide-react'

interface OrderConfirmedProps {
  searchParams: Promise<{
    orderNumber?: string
  }>
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedProps) {
  const { orderNumber } = await searchParams

  let order = null
  if (orderNumber) {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          Order Successfully Placed!
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          We have received your order. Our team will verify your details and dispatch your package shortly.
        </p>
      </div>

      {order ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Order Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block">Order Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {order.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Date</span>
              <span className="font-bold text-slate-900">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Method</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Amount</span>
              <span className="font-extrabold text-sky-600 text-sm">
                {formatBDT(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-800">Recipient:</span>
              <p className="text-slate-600">{order.customerName}</p>
              <p className="text-slate-600">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-slate-500">{order.customerEmail}</p>}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800">Shipping Address:</span>
              <p className="text-slate-600">{order.addressLine}</p>
              <p className="text-slate-600">
                {order.area ? `${order.area}, ` : ''}{order.city}
              </p>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ordered Items
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {item.variantName ? `${item.variantName} • ` : ''}Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Track Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/track-order?q=${order.orderNumber}`}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-md transition"
            >
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Track Live Order Status</span>
            </Link>

            <Link
              href="/products"
              className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs text-center transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Link
            href="/products"
            className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Explore More Products
          </Link>
        </div>
      )}
    </div>
  )
}
