'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

export function WhatsAppFloat() {
  const phoneNumber = '8801700000000'
  const message = 'Hello Stalio! I have a query regarding products on your marketplace.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-5 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2.5 rounded-full shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95 transition transform duration-200"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-xs font-bold hidden sm:inline">WhatsApp Help</span>
    </a>
  )
}
