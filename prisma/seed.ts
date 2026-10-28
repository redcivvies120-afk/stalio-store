// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Setting up clean production database for Stalio...')

  // Clear existing records
  await prisma.review.deleteMany().catch(() => {})
  await prisma.orderItem.deleteMany().catch(() => {})
  await prisma.order.deleteMany().catch(() => {})
  await prisma.productVariant.deleteMany().catch(() => {})
  await prisma.productSpec.deleteMany().catch(() => {})
  await prisma.productImage.deleteMany().catch(() => {})
  await prisma.product.deleteMany().catch(() => {})
  await prisma.category.deleteMany().catch(() => {})
  await prisma.coupon.deleteMany().catch(() => {})
  await prisma.shippingMethod.deleteMany().catch(() => {})
  await prisma.address.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})

  // 1. Admin Account
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Stalio Admin',
      email: 'admin@stalio.store',
      phone: '+8801700000000',
      role: 'ADMIN',
      password: adminPassword,
    },
  })

  // 2. Shipping Methods
  await prisma.shippingMethod.createMany({
    data: [
      { name: 'Standard Dhaka Dispatch', description: 'Within 24-48 hours inside Dhaka', price: 60, freeAbove: 2500, estimatedDays: '1-2 Days', sortOrder: 1 },
      { name: 'Express Same-Day Dhaka', description: 'Order before 2 PM for same-day delivery', price: 150, estimatedDays: 'Today', sortOrder: 2 },
      { name: 'Nationwide Courier', description: 'Courier delivery all across Bangladesh', price: 120, freeAbove: 4000, estimatedDays: '3-4 Days', sortOrder: 3 },
    ],
  })

  // 3. Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', discountType: 'PERCENT', discountValue: 10, minOrderAmount: 1000, maxDiscount: 500 },
      { code: 'STALIO500', discountType: 'FIXED', discountValue: 500, minOrderAmount: 3000 },
    ],
  })

  // 4. Categories Ready for Real Products
  await prisma.category.createMany({
    data: [
      {
        name: 'Workspace & Desk',
        slug: 'desk-aesthetics',
        description: 'Ultra-wide light bars, pixel displays, ambient lighting and modern desk setup accessories.',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        icon: 'Monitor',
        sortOrder: 1,
      },
      {
        name: 'Keyboards & Typing',
        slug: 'keyboards-typing',
        description: 'Custom gasket mechanical keyboards, wireless tri-mode boards, switches and keycaps.',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        icon: 'Keyboard',
        sortOrder: 2,
      },
      {
        name: 'Audio & Studio',
        slug: 'audio-sound',
        description: 'Studio monitors, hybrid ANC headphones, and audiophile desktop sound.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        icon: 'Headphones',
        sortOrder: 3,
      },
      {
        name: 'Everyday Tech & Power',
        slug: 'smart-power-edc',
        description: 'GaN fast desktop chargers, magnetic wireless power banks, and minimalist EDC gear.',
        image: 'https://images.unsplash.com/photo-1609592424361-b541334c2ee9?auto=format&fit=crop&w=800&q=80',
        icon: 'Zap',
        sortOrder: 4,
      },
      {
        name: 'Minimalist Essentials',
        slug: 'minimalist-apparel',
        description: 'Heavyweight organic cotton tees, everyday carry bags, and minimalist lifestyle goods.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        icon: 'ShoppingBag',
        sortOrder: 5,
      },
    ],
  })

  console.log('✅ Clean production database ready for Stalio!')
  console.log('   Demo products removed.')
  console.log('   Admin login: admin@stalio.store / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
