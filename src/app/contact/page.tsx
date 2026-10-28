'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Stalio Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Have questions about listing an item, buying goods, or order deliveries? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Get in Touch</h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Phone Hotline</span>
                <span className="text-slate-600">+880 1700 000 000</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">WhatsApp Support</span>
                <span className="text-slate-600">+880 1700 000 000 (Instant replies)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Email Inquiries</span>
                <span className="text-slate-600">support@stalio.store</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Showroom &amp; Fulfillment</span>
                <span className="text-slate-600">Banani, Dhaka-1213, Bangladesh</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Operating Hours</span>
                <span className="text-slate-600">Saturday – Thursday: 10:00 AM – 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Send Us a Direct Message</h2>
          {submitted ? (
            <div className="p-6 text-center space-y-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-700">
                Our support team will contact you shortly via WhatsApp or phone.
              </p>
            </div>
          ) : (
            <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Mahir Labib"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone / Email</label>
                <input
                  type="text"
                  required
                  placeholder="017xxxxxxxx or name@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help your desk setup?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
