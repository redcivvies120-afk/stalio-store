'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { formatBDT, calcDiscount } from '@/lib/utils'
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Check,
  Zap,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

interface ProductDetailProps {
  product: {
    id: string
    name: string
    slug: string
    subtitle?: string | null
    description: string
    price: number
    originalPrice?: number | null
    stock: number
    sku?: string | null
    rating: number
    reviewCount: number
    category?: { name: string; slug: string } | null
    images: { id: string; url: string; alt?: string | null }[]
    specs: { id: string; label: string; value: string }[]
    variants: { id: string; name: string; price: number; stock: number }[]
    reviews: { id: string; name: string; rating: number; comment: string; createdAt: Date | string }[]
  }
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleItem, hasItem } = useWishlist()

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
  )
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs')

  // Review form state
  const [reviewsList, setReviewsList] = useState(product.reviews || [])
  const [reviewName, setReviewName] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  const isWishlisted = hasItem(product.id)
  const activePrice = selectedVariant ? selectedVariant.price : product.price
  const discount = calcDiscount(product.originalPrice, activePrice)

  const handleAddToCart = (openDrawer = true) => {
    addItem({
      id: `${product.id}-${selectedVariant?.name || 'default'}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: selectedImage,
      price: activePrice,
      originalPrice: product.originalPrice,
      variantName: selectedVariant?.name,
      stock: selectedVariant ? selectedVariant.stock : product.stock,
      quantity,
      openDrawer,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart(false)
    router.push('/checkout')
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewComment.trim()) return

    setReviewSubmitting(true)
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewName.trim(),
          comment: reviewComment.trim(),
          rating: reviewRating,
        }),
      })

      if (res.ok) {
        const newReview = await res.json()
        setReviewsList([newReview, ...reviewsList])
        setReviewName('')
        setReviewComment('')
      } else {
        // Fallback local addition if api route is offline
        const mockReview = {
          id: Math.random().toString(),
          name: reviewName.trim(),
          comment: reviewComment.trim(),
          rating: reviewRating,
          createdAt: new Date().toISOString(),
        }
        setReviewsList([mockReview, ...reviewsList])
        setReviewName('')
        setReviewComment('')
      }
    } catch {
      const mockReview = {
        id: Math.random().toString(),
        name: reviewName.trim(),
        comment: reviewComment.trim(),
        rating: reviewRating,
        createdAt: new Date().toISOString(),
      }
      setReviewsList([mockReview, ...reviewsList])
      setReviewName('')
      setReviewComment('')
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Top Grid: Gallery & Buying Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition duration-300"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-lg">
                SAVE {discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === img.url
                      ? 'border-sky-600 shadow-md scale-95'
                      : 'border-slate-200 hover:border-slate-300 opacity-80'
                  }`}
                >
                  <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Controls (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="text-sm text-slate-500 font-medium">
                {product.subtitle}
              </p>
            )}

            {/* Rating overview */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {product.rating?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-slate-400">
                ({reviewsList.length} verified reviews)
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              {formatBDT(activePrice)}
            </span>
            {product.originalPrice && product.originalPrice > activePrice && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatBDT(product.originalPrice)}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 ml-auto bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              In Stock &amp; Ready to Ship
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Option / Color:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      selectedVariant?.id === variant.id
                        ? 'border-neutral-950 bg-neutral-100 text-neutral-950 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buy Buttons */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-slate-200 text-slate-600 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-slate-200 text-slate-600 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Wishlist Toggle Button */}
              <button
                onClick={() =>
                  toggleItem({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: selectedImage,
                    price: activePrice,
                    originalPrice: product.originalPrice,
                  })
                }
                className={`p-2.5 rounded-xl border transition ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-500 bg-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(true)}
                className={`py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Instant Checkout</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Dhaka: 24-48 Hours delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>100% Original Brand Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>7 Days Free Replacement</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Check parcel before payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs: Description & Specs / Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex gap-4 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-bold pb-2 transition border-b-2 -mb-[14px] ${
              activeTab === 'specs'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview &amp; Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-2 transition border-b-2 -mb-[14px] flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews ({reviewsList.length})</span>
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="pt-6 space-y-6">
            <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-w-2xl bg-white">
                  {product.specs.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="font-semibold text-slate-500">{spec.label}</span>
                      <span className="font-medium text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {reviewsList.length === 0 ? (
                <p className="text-xs text-slate-500">No reviews yet. Be the first to review!</p>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Write a Customer Review
              </h4>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Mahir Labib"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    <option value={2}>⭐⭐ (2/5 Below Average)</option>
                    <option value={1}>⭐ (1/5 Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="What did you like about this product?"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
