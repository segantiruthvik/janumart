import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { products } = body // Array of { id, order }

    // Update each product's order
    const updatePromises = products.map((product: { id: string; order: number }) =>
      prisma.product.update({
        where: { id: product.id },
        data: { order: product.order }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering products:', error)
    return NextResponse.json(
      { error: 'Failed to reorder products' },
      { status: 500 }
    )
  }
}
