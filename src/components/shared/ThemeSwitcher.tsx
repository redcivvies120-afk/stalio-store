'use client'

import React, { useState, useEffect } from 'react'
import { useTheme, ThemeType } from '@/store/theme'
import { Palette, Check } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (!mounted) return null

  const themeOptions: { id: ThemeType; label: string; preview: string; bg: string }[] = [
    {
      id: 'clean-white',
      label: 'Clean White (Minimal)',
      preview: 'bg-white border-neutral-300 text-neutral-900',
      bg: '#ffffff',
    },
    {
      id: 'obsidian-dark',
      label: 'Obsidian Dark',
      preview: 'bg-neutral-950 border-neutral-700 text-neutral-100',
      bg: '#0a0a0a',
    },
    {
      id: 'warm-minimal',
      label: 'Warm Linen',
      preview: 'bg-[#faf8f5] border-[#e6e1d8] text-[#2c2824]',
      bg: '#faf8f5',
    },
    {
      id: 'electric-cyan',
      label: 'Electric Cyan',
      preview: 'bg-white border-sky-300 text-sky-900',
      bg: '#f0f9ff',
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition shadow-sm"
        title="Change Store Theme"
      >
        <Palette className="w-3.5 h-3.5 text-neutral-500" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-neutral-200 p-2 shadow-xl z-50 space-y-1 text-xs">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Select Store Theme
            </div>
            {themeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setTheme(opt.id)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition ${
                  theme === opt.id
                    ? 'bg-neutral-100 font-bold text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full border shadow-sm ${opt.preview}`}
                    style={{ backgroundColor: opt.bg }}
                  />
                  <span>{opt.label}</span>
                </div>
                {theme === opt.id && <Check className="w-3.5 h-3.5 text-neutral-900" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
