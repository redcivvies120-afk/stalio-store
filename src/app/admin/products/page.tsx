'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatBDT } from '@/lib/utils'
import {
  Package,
  Plus,
  Trash2,
  ArrowLeft,
  X,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  // Form
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [stock, setStock] = useState('50')
  const [imageUrl, setImageUrl] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const isAuth = localStorage.getItem('stalio_admin_auth') || localStorage.getItem('rishan_admin_auth')
    if (!isAuth) {
      router.push('/admin')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
        setCategories(data.categories || [])
        if (data.categories?.length > 0) {
          setCategoryId(data.categories[0].id)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!name || !price || !categoryId) {
      setFormError('Please fill in product name, price and category.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          categoryId,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          stock: Number(stock),
          imageUrl: imageUrl || undefined,
          subtitle,
          description,
          isFeatured,
        }),
      })

      if (res.ok) {
        const newProduct = await res.json()
        setProducts([newProduct, ...products])
        setModalOpen(false)
        setName('')
        setPrice('')
        setOriginalPrice('')
        setImageUrl('')
        setSubtitle('')
        setDescription('')
      } else {
        const d = await res.json()
        setFormError(d.error || 'Failed to create product')
      }
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Product Inventory Management
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6">Badges</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80'}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                        {p.subtitle || p.slug}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {p.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {formatBDT(p.price)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800">{p.stock} units</span>
                  </td>
                  <td className="py-4 px-6">
                    {p.isFeatured && (
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-200">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 inline-block"
                      title="View on Storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">List New Product on Stalio</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rishan CyberDesk RGB Clock"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (Strikeout)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4200"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL (Unsplash or direct image link)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe materials, connectivity, specs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition"
              >
                {submitting ? 'Adding Product...' : 'Publish Product to Store'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
