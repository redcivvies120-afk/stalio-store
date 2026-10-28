// src/app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerPhone,
      customerEmail,
      addressLine,
      city,
      area,
      postalCode,
      paymentMethod,
      shippingMethodName,
      shippingFee,
      discount,
      notes,
      items,
    } = body

    if (!customerName || !customerPhone || !addressLine || !city || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required delivery information or empty cart' },
        { status: 400 }
      )
    }

    const orderNumber = generateOrderNumber()
    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
    const finalShipping = Number(shippingFee) || 0
    const finalDiscount = Number(discount) || 0
    const totalAmount = Math.max(0, subtotal - finalDiscount + finalShipping)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        addressLine,
        city,
        area: area || null,
        postalCode: postalCode || null,
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        subtotal,
        discount: finalDiscount,
        shippingFee: finalShipping,
        totalAmount,
        notes: notes || null,
        trackingNumber: `TRK-${orderNumber.replace('RSH-', '')}`,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId || null,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            variantName: i.variantName || null,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
