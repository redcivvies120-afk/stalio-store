'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123' || password === 'admin@123' || password === 'admin') {
      localStorage.setItem('stalio_admin_auth', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid admin credentials. Use "admin123"')
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center mx-auto text-lg font-black shadow-sm">
            S
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-tight uppercase">
            Stalio Portal
          </h1>
          <p className="text-xs text-neutral-500">
            Open marketplace administration &amp; product listing control.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
              Store Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 transition active:scale-95"
          >
            <span>Enter Admin Dashboard</span>
            <ArrowRight className="w-4 h-4 text-sky-400" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
