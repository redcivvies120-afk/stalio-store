import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WhatsAppFloat } from '@/components/shared/WhatsAppFloat'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stalio.store'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Stalio — Clean White Minimalist Store',
    template: '%s | Stalio',
  },
  description:
    'Stalio is a clean white, minimalist online storefront featuring premium desk setups, mechanical keyboards, audio gear, and everyday tech essentials.',
  keywords: [
    'Stalio',
    'Stalio Store',
    'Stalio Ecommerce',
    'Clean White Store',
    'Minimalist Store',
    'Desk Setup',
    'Keyboards',
    'Audio Gear',
    'Everyday Tech',
    'Bangladesh Ecommerce',
  ],
  authors: [{ name: 'Stalio' }],
  creator: 'Stalio',
  publisher: 'Stalio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Stalio — Clean White Minimalist Store',
    description:
      'A clean white, minimalist online storefront featuring premium desk setups, mechanical keyboards, and studio audio.',
    url: siteUrl,
    siteName: 'Stalio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stalio — Clean White Minimalist Store',
    description:
      'A clean white, minimalist online storefront with customizable themes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Stalio',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" data-theme="clean-white">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
