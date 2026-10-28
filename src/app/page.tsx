import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import {
  ArrowUpDown,
  Star,
  PlusCircle,
  Tag,
  Filter,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const categorySlug = params.category
  const searchQuery = params.search
  const sortBy = params.sort || 'featured'

  // Fetch categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  // Build query
  const where: any = { isActive: true }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { subtitle: { contains: searchQuery } },
    ]
  }

  // Sorting
  let orderBy: any = [{ isFeatured: 'desc' }, { soldCount: 'desc' }]
  if (sortBy === 'price-low') {
    orderBy = { price: 'asc' }
  } else if (sortBy === 'price-high') {
    orderBy = { price: 'desc' }
  } else if (sortBy === 'newest') {
    orderBy = { createdAt: 'desc' }
  } else if (sortBy === 'rating') {
    orderBy = { rating: 'desc' }
  }

  const products = await prisma.product.findMany({
    where,
    include: { images: true, category: true, variants: true },
    orderBy,
  })

  const currentCategory = categories.find((c) => c.slug === categorySlug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* ── CLEAN WHITE MINIMALIST STORE HEADER ────────── */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>Stalio Store</span>
              {currentCategory && (
                <>
                  <span>/</span>
                  <span className="text-neutral-900">{currentCategory.name}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : currentCategory
                ? currentCategory.name
                : 'Curated Catalog'}
            </h1>
            <p className="text-xs text-neutral-500 max-w-xl">
              {currentCategory?.description ||
                'Clean white and minimalist commerce. Workspace gear, mechanical keyboards, and everyday tech essentials.'}
            </p>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Sorting Pills */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full text-xs font-medium border border-neutral-200">
              <Link
                href={`/?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  sort: 'featured',
                }).toString()}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  sortBy === 'featured' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Featured
              </Link>
              <Link
                href={`/?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  sort: 'price-low',
                }).toString()}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  sortBy === 'price-low' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Price: Low
              </Link>
              <Link
                href={`/?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  sort: 'price-high',
                }).toString()}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  sortBy === 'price-high' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Price: High
              </Link>
              <Link
                href={`/?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  sort: 'newest',
                }).toString()}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  sortBy === 'newest' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Newest
              </Link>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              !categorySlug
                ? 'bg-neutral-950 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
            }`}
          >
            All Items ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                categorySlug === cat.slug
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── MINIMALIST PRODUCT GRID ─────────────────────── */}
      {products.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-neutral-200 shadow-sm max-w-md mx-auto p-8">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Filter className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900">Storefront Ready</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              No products currently listed. Add your items anytime via the Admin Portal to publish them live.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-block px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition"
          >
            Open Admin &amp; Add Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* ── MINIMALIST BANNER ──────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <Tag className="w-3.5 h-3.5" />
            <span>Launch Discount Voucher</span>
          </div>
          <p className="text-xs text-neutral-500">
            Use code <span className="font-mono font-bold text-neutral-900 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">WELCOME10</span> at checkout for 10% off your order.
          </p>
        </div>
        <Link
          href="/checkout"
          className="px-4 py-2 rounded-full bg-white border border-neutral-300 hover:border-neutral-950 text-neutral-900 font-bold text-xs whitespace-nowrap transition"
        >
          Redeem at Checkout
        </Link>
      </div>

      {/* ── MINIMALIST SOCIAL REVIEWS ───────────────────── */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Verified Buyers &amp; Sellers
          </span>
          <h2 className="text-base font-black text-neutral-950 tracking-tight">
            Customer Feedback
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
            <div className="flex text-neutral-900">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              &ldquo;Clean interface with zero clutter. The delivery inside Dhaka was completed within 24 hours and the quality of the screenbar is top-notch.&rdquo;
            </p>
            <div className="pt-1 text-[11px] text-neutral-400 font-medium">
              Zubair H. • Verified Buyer
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
            <div className="flex text-neutral-900">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              &ldquo;Being able to switch themes and sell custom mechanical accessories in one place makes Stalio feel leagues ahead of clunky traditional marketplaces.&rdquo;
            </p>
            <div className="pt-1 text-[11px] text-neutral-400 font-medium">
              Siam R. • Seller &amp; Enthusiast
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
            <div className="flex text-neutral-900">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              &ldquo;Package checking on delivery made the checkout feel 100% risk free. Pristine unboxing experience.&rdquo;
            </p>
            <div className="pt-1 text-[11px] text-neutral-400 font-medium">
              Nafis C. • Verified Buyer
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
