import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Catalog</span>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-slate-800">{currentCategory.name}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : currentCategory
            ? currentCategory.name
            : 'All Workspace Gear'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {currentCategory?.description ||
            'Explore our full lineup of performance desk accessories, ergonomic mechanical keyboards, and precision audio gear.'}
        </p>
      </div>

      {/* Filter and Sorting Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Link
            href="/products"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              !categorySlug
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                categorySlug === cat.slug
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sorting Dropdown Links */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-medium text-slate-600 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort by:</span>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug ? { category: categorySlug } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
                sort: 'featured',
              }).toString()}`}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                sortBy === 'featured' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug ? { category: categorySlug } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
                sort: 'price-low',
              }).toString()}`}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                sortBy === 'price-low' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Price: Low
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug ? { category: categorySlug } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
                sort: 'price-high',
              }).toString()}`}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                sortBy === 'price-high' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Price: High
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug ? { category: categorySlug } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
                sort: 'newest',
              }).toString()}`}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                sortBy === 'newest' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Newest
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500">
            Try removing filters or search with another keyword.
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Clear All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
