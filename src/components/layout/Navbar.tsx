'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { formatBDT } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Truck,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
} from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const { itemCount, subtotal, toggleCart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const count = mounted ? itemCount() : 0
  const cartSubtotal = mounted ? subtotal() : 0
  const wishCount = mounted ? wishlistItems.length : 0

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Minimalist Micro Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] py-1.5 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Free nationwide delivery on orders over ৳2,500</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-neutral-400">
            <Link href="/track-order" className="hover:text-white transition flex items-center gap-1">
              <Truck className="w-3 h-3 text-neutral-400" />
              <span>Track Order</span>
            </Link>
            <Link href="/admin" className="hover:text-white transition flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Clean White Navbar */}
      <div className={`transition-all duration-200 stalio-nav ${isScrolled ? 'shadow-sm py-2.5' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo: Clean Minimalist Stalio */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center text-white font-black text-sm tracking-tighter group-hover:bg-neutral-800 transition">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-widest text-neutral-950 group-hover:opacity-80 transition uppercase">
                  STALIO
                </span>
                <span className="text-[8px] tracking-widest uppercase text-neutral-400 -mt-1 font-semibold">
                  MINIMALIST MARKET
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-600">
              <Link href="/" className="hover:text-neutral-950 transition">All Items</Link>
              <Link href="/?category=desk-aesthetics" className="hover:text-neutral-950 transition">Workspace</Link>
              <Link href="/?category=keyboards-typing" className="hover:text-neutral-950 transition">Keyboards</Link>
              <Link href="/?category=audio-sound" className="hover:text-neutral-950 transition">Audio</Link>
              <Link href="/?category=smart-power-edc" className="hover:text-neutral-950 transition">Power &amp; EDC</Link>
              <Link href="/?category=minimalist-apparel" className="hover:text-neutral-950 transition">Apparel</Link>
            </nav>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative items-center">
              <input
                type="text"
                placeholder="Search anything on Stalio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 focus:bg-white focus:outline-none focus:border-neutral-950 transition"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Action Buttons & Theme Switcher */}
            <div className="flex items-center gap-2.5">
              {/* Theme Switcher Button */}
              <ThemeSwitcher />

              {/* Wishlist */}
              <Link
                href="/?filter=wishlist"
                className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag */}
              <button
                onClick={toggleCart}
                className="flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <div className="relative">
                  <ShoppingBag className="w-3.5 h-3.5 text-neutral-200" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
                <span>{cartSubtotal > 0 ? formatBDT(cartSubtotal) : 'Bag'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-2.5 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 focus:bg-white focus:outline-none focus:border-neutral-950"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2 pointer-events-none" />
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[96px] z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white h-full max-w-xs w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Explore Marketplace
              </div>
              <div className="flex flex-col space-y-2 text-sm font-medium text-neutral-900">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 hover:text-neutral-600"
                >
                  <span>All Products</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/?category=desk-aesthetics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 hover:text-neutral-600"
                >
                  <span>Workspace &amp; Desk</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/?category=keyboards-typing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 hover:text-neutral-600"
                >
                  <span>Mechanical Keyboards</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/?category=audio-sound"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 hover:text-neutral-600"
                >
                  <span>Audio &amp; Headphones</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/?category=smart-power-edc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 hover:text-neutral-600"
                >
                  <span>Everyday Carry &amp; Power</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 pt-3">
                Customer Support
              </div>
              <div className="flex flex-col space-y-2 text-xs text-neutral-700">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-neutral-500" />
                  <span>Track Order Status</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 flex items-center gap-2 text-neutral-900 font-semibold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
              <p className="font-bold text-neutral-900">Stalio Marketplace</p>
              <p>Clean White Minimalist Commerce</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
