import React from 'react'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective from January 2026</p>
      </div>

      <div className="text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <p>
          Welcome to Stalio. By accessing, buying, or selling on our marketplace, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Orders &amp; Pricing</h2>
          <p>
            All prices listed on Stalio are denominated in Bangladeshi Taka (BDT) and include standard taxes.
          </p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Delivery &amp; Inspection</h2>
          <p>
            Customers are strongly encouraged to inspect package seals and exterior condition upon arrival with the delivery representative before acknowledging receipt.
          </p>
        </div>
      </div>
    </div>
  )
}
