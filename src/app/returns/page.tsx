import React from 'react'

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Returns, Replacement &amp; Warranty Policy
        </h1>
        <p className="text-xs text-slate-500">Last updated: January 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">7 Days Easy Replacement</h2>
          <p>
            If your product arrives damaged, with functional defects, or differs from what you ordered, you are eligible for an immediate replacement within 7 days of delivery.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">Warranty Claims</h2>
          <p>
            Products covered under our official Stalio Warranty can be serviced or replaced if manufacturing issues occur during the coverage period.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">How to Request a Replacement</h2>
          <p>
            Reach out directly to our WhatsApp support (+880 1700 000 000) or email support@stalio.store with your Order ID and photos of the item.
          </p>
        </div>
      </div>
    </div>
  )
}
