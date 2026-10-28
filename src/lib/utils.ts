// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price with BDT symbol (৳)
export function formatBDT(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '৳0'
  return `৳${Math.round(amount).toLocaleString('en-BD')}`
}

// Calculate discount percentage
export function calcDiscount(original?: number | null, current?: number | null): number {
  if (!original || !current || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

// Slug generator
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Order number generator (e.g. STL-K9X2-84F1)
export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const randPart = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const timePart = Date.now().toString(36).toUpperCase().slice(-4)
  return `STL-${timePart}-${randPart}`
}
