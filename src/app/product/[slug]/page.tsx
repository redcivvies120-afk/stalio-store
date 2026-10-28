import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'
import { ProductCard } from '@/components/product/ProductCard'
import { ChevronRight } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      specs: true,
      variants: true,
      category: true,
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { images: true, category: true, variants: true },
    take: 4,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-slate-900 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-slate-900 transition">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-slate-900 transition"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              You May Also Like
            </h2>
            <Link
              href={`/products?category=${product.category?.slug}`}
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
