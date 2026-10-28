import React from 'react'
import Link from 'next/link'
import { Sparkles, ShieldCheck, Heart, Users, Truck } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision &amp; Craft</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About Stalio
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Stalio is a clean white, minimalist modern e-commerce platform with customizable themes. Built for aesthetic clarity, seamless shopping, and effortless commerce.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Authentic &amp; Certified</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every screenbar, custom keyboard switch, and GaN charger is rigorously tested and checked before reaching your setup.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Express Delivery in BD</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fast, reliable dispatch across all 64 districts in Bangladesh with safe Cash on Delivery.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Creator-First Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our Dhaka-based support team is always available via WhatsApp and phone to assist you before and after purchase.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl font-black">Ready to transform your workspace?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Explore our collection and upgrade your everyday desk experience.
        </p>
        <Link
          href="/products"
          className="inline-block px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  )
}
