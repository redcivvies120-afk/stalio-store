'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { formatBDT, calcDiscount } from '@/lib/utils'
import { Heart, ShoppingBag, Star, Check } from 'lucide-react'

export interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    subtitle?: string | null
    price: number
    originalPrice?: number | null
    rating?: number
    reviewCount?: number
    isFeatured?: boolean
    isNew?: boolean
    isBestseller?: boolean
    stock: number
    category?: { name: string; slug: string } | null
    images: { url: string; alt?: string | null }[]
    variants?: { name: string; price: number; stock: number }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleItem, hasItem } = useWishlist()
  const [added, setAdded] = useState(false)

  const discount = calcDiscount(product.originalPrice, product.price)
  const isWishlisted = hasItem(product.id)
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: `${product.id}-${product.variants?.[0]?.name || 'default'}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      price: product.price,
      originalPrice: product.originalPrice,
      variantName: product.variants?.[0]?.name,
      stock: product.stock,
      openDrawer: true,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      price: product.price,
      originalPrice: product.originalPrice,
    })
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/90 hover:border-neutral-400 transition-all duration-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md">
      {/* Top Media Area */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-neutral-50 block">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white text-[9px] font-bold uppercase tracking-wider">
              -{discount}%
            </span>
          )}
          {product.isBestseller && !discount && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[9px] font-bold uppercase tracking-wider border border-neutral-200">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/90 text-neutral-400 hover:text-neutral-900 shadow-sm'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
      </Link>

      {/* Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        <div className="space-y-1">
          {product.category && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
              {product.category.name}
            </span>
          )}

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5">
            <Star className="w-3 h-3 text-neutral-800 fill-current" />
            <span className="text-[10px] font-bold text-neutral-800">
              {product.rating?.toFixed(1) || '5.0'}
            </span>
            <span className="text-[10px] text-neutral-400">
              ({product.reviewCount || 1})
            </span>
          </div>
        </div>

        {/* Price & Add Button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs sm:text-sm font-black text-neutral-900">
              {formatBDT(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[9px] text-neutral-400 line-through">
                {formatBDT(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition active:scale-95 ${
              product.stock <= 0
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-950 hover:bg-neutral-800 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
