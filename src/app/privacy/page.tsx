import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Effective from January 2026</p>
      </div>

      <div className="text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <p>
          At Stalio, we value your privacy and are committed to safeguarding personal information collected when you use our marketplace.
        </p>
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Information Collected</h2>
          <p>
            We collect basic contact details (Name, Phone Number, Shipping Address, Email) exclusively for fulfilling order deliveries, generating courier waybills, and sending tracking notices.
          </p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Data Security</h2>
          <p>
            Your information is stored securely. We do not sell, rent, or lease your personal information to third parties.
          </p>
        </div>
      </div>
    </div>
  )
}
