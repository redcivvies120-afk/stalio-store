// src/app/api/products/[id]/reviews/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, rating, comment } = body

    if (!name || !comment) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        productId: id,
        name: name.trim(),
        rating: Math.max(1, Math.min(5, Number(rating) || 5)),
        comment: comment.trim(),
        isVerified: true,
      },
    })

    // Recalculate product rating
    const allReviews = await prisma.review.findMany({
      where: { productId: id },
      select: { rating: true },
    })

    const avgRating = allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length

    await prisma.product.update({
      where: { id },
      data: {
        rating: Number(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    })

    return NextResponse.json(review)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
