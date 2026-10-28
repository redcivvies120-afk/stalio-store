// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, images: true },
      orderBy: { createdAt: 'desc' },
    })
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ products, categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, categoryId, price, originalPrice, stock, description, subtitle, imageUrl, isFeatured } = body

    if (!name || !categoryId || !price) {
      return NextResponse.json({ error: 'Name, Category, and Price are required' }, { status: 400 })
    }

    const baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        subtitle: subtitle || null,
        description: description || 'Premium workspace tech accessory engineered for modern desks.',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: Number(stock) || 50,
        isFeatured: Boolean(isFeatured),
        categoryId,
        images: {
          create: [
            {
              url: imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
              alt: name,
              isPrimary: true,
            },
          ],
        },
      },
      include: { images: true, category: true },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
