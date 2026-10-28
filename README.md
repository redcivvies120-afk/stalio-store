# ⚡ Rishan Store - Next-Gen E-Commerce Platform

A production-grade, full-featured modern e-commerce website built for **Rishan** (Tech, Workspace Aesthetics & Minimalist EDC Gear in Bangladesh).

---

## 🌟 Key Features

- **Storefront & Aesthetics:**
  - Modern, high-converting hero showcase with ambient glowing backdrops & value proposition badges.
  - Curated category navigation: Desk Aesthetics, Keyboards & Switches, Hi-Fi Audio, Smart Power & EDC.
  - Interactive product cards with dynamic badges (New, Bestseller, Discount %), rating stars, quick add-to-bag, and instant wishlist toggle.
  - Fully responsive design with glassmorphism header, mobile bottom navigation bar, and sticky WhatsApp support.

- **Product Detail Experience (`/product/[slug]`):**
  - High-res multi-image gallery with interactive thumbnail switching.
  - Dynamic variant picker (colors, switch types, models) with real-time price adjustment.
  - Comprehensive technical specifications table.
  - Live customer reviews system with interactive 5-star rating submission form.
  - Trust indicators: 100% Authentic, 24-48h Dhaka dispatch, 7-day replacement guarantee.

- **Shopping Bag & Checkout Flow:**
  - Slide-over Cart Drawer (`useCart` Zustand store with `localStorage` persistence).
  - Dynamic Free Delivery progress tracker (e.g. "Add ৳500 for Free Delivery").
  - Dedicated full cart page with promo code validator (`WELCOME10`, `RISHAN500`).
  - Single-page checkout supporting:
    - Customer details & active mobile number validation.
    - Delivery location selector (Dhaka vs. Nationwide).
    - Multi-payment options: Cash on Delivery (COD), bKash, Nagad, Debit/Credit Card.
    - Instant order placement generating unique order numbers (e.g. `RSH-DEMO-001`).

- **Real-Time Order Tracking (`/track-order`):**
  - Live 5-stage shipment visual stepper (Placed → Confirmed → Processing → In Transit → Delivered).
  - Search by Order ID or phone number.
  - Displays assigned courier tracking number, delivery address, and ordered item receipt.

- **Complete Store Admin Dashboard (`/admin`):**
  - KPI cards: Total Revenue, Total Orders, Pending Shipments, Fulfilled Orders.
  - Live Order Management table: inspect customer phone/address, update order statuses (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled) in real time.
  - Product Inventory Manager (`/admin/products`): Add new products with categories, pricing, stock, custom images, and toggle featured status.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- SQLite (included out-of-the-box via Prisma)

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials & Test Data

- **Admin Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - Master Password / Pin: `admin123`
- **Sample Order for Tracking:**
  - Enter Order ID: `RSH-DEMO-001` on [http://localhost:3000/track-order](http://localhost:3000/track-order)
- **Active Promotional Coupons:**
  - `WELCOME10` — 10% discount on orders above ৳1,000
  - `RISHAN500` — ৳500 flat discount on orders above ৳3,000
