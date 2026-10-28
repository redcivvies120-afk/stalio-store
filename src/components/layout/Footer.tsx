import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  PlusCircle,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600 text-xs transition-colors">
      {/* 4 Minimalist Value Propositions */}
      <div className="border-b border-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-neutral-900 font-bold text-xs">Nationwide Fast Dispatch</h4>
                <p className="text-[11px] text-neutral-400">Dhaka &amp; across Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-neutral-900 font-bold text-xs">Verified Quality</h4>
                <p className="text-[11px] text-neutral-400">Authentic goods &amp; gear</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-neutral-900 font-bold text-xs">7-Day Replacement</h4>
                <p className="text-[11px] text-neutral-400">Hassle-free return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-neutral-900 font-bold text-xs">Cash on Delivery</h4>
                <p className="text-[11px] text-neutral-400">Inspect parcel on delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center text-white font-black text-xs">
                S
              </div>
              <span className="text-base font-black tracking-widest text-neutral-950 uppercase">
                STALIO
              </span>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              Stalio is a clean white, minimalist modern e-commerce storefront with customizable themes. Engineered for performance and aesthetic clarity.
            </p>
            <div className="space-y-1 text-xs text-neutral-600 pt-1">
              <p>Banani, Dhaka, Bangladesh</p>
              <p>Email: hello@stalio.store</p>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Catalog</h5>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="hover:text-neutral-950 transition">All Items</Link></li>
              <li><Link href="/?category=desk-aesthetics" className="hover:text-neutral-950 transition">Workspace</Link></li>
              <li><Link href="/?category=keyboards-typing" className="hover:text-neutral-950 transition">Keyboards</Link></li>
              <li><Link href="/?category=audio-sound" className="hover:text-neutral-950 transition">Audio Systems</Link></li>
              <li><Link href="/?category=smart-power-edc" className="hover:text-neutral-950 transition">Power &amp; EDC</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Orders &amp; Help</h5>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/track-order" className="hover:text-neutral-950 transition font-medium">Track Live Order</Link></li>
              <li><Link href="/faq" className="hover:text-neutral-950 transition">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-neutral-950 transition">Contact Support</Link></li>
              <li><Link href="/admin" className="hover:text-neutral-950 transition font-medium">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-neutral-950 uppercase tracking-wider">Policies</h5>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/terms" className="hover:text-neutral-950 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-neutral-950 transition">Privacy Policy</Link></li>
              <li><Link href="/returns" className="hover:text-neutral-950 transition">Replacement Policy</Link></li>
              <li><Link href="/about" className="hover:text-neutral-950 transition">About Stalio</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Stalio. Minimalist Open Commerce. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Payment:</span>
            <span className="px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 font-semibold bg-neutral-50 text-[10px]">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 rounded border border-pink-200 text-pink-700 font-semibold bg-pink-50 text-[10px]">
              bKash
            </span>
            <span className="px-2 py-0.5 rounded border border-orange-200 text-orange-700 font-semibold bg-orange-50 text-[10px]">
              Nagad
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
