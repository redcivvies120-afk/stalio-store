import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WhatsAppFloat } from '@/components/shared/WhatsAppFloat'

export const metadata: Metadata = {
  title: 'Stalio — Clean White Minimalist Store',
  description:
    'A clean white minimalist modern storefront with customizable themes.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="clean-white">
      <body className="antialiased selection:bg-neutral-900 selection:text-white">
        <Navbar />
        <CartDrawer />
        <WhatsAppFloat />
        <main className="min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}
