import React from 'react'

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does delivery take inside Dhaka and nationwide?',
      a: 'Orders inside Dhaka are typically delivered within 24 to 48 hours. We also offer same-day express delivery for orders placed before 2 PM. Nationwide delivery across Bangladesh takes 2 to 4 business days via verified courier services.',
    },
    {
      q: 'Can I inspect the parcel before paying for Cash on Delivery?',
      a: 'Yes, absolutely! With Rishan Cash on Delivery, you can check the physical condition and authenticity of the product in front of the courier delivery executive before completing your payment.',
    },
    {
      q: 'What is the warranty policy on electronic accessories and screenbars?',
      a: 'All our smart clocks, screenbars, keyboards, and audio equipment come with a minimum 6-month to 1-year official replacement warranty. If you experience any manufacturing defect, we replace it hassle-free.',
    },
    {
      q: 'Are custom mechanical keyboards pre-assembled?',
      a: 'Yes, our keyboards come fully assembled with factory pre-lubed switches, sound-dampening foam, and double-shot PBT keycaps ready to plug and play via Type-C, Bluetooth, or 2.4GHz wireless.',
    },
    {
      q: 'How do I track my placed order?',
      a: 'Simply visit our "Track Order" page from the navigation bar, enter your Order ID (sent via SMS/Email) or your phone number, and you will see live status updates.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Common questions about ordering, delivery speeds, warranties, and payments.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
