import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const available = searchParams.get('available')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (available === 'true') {
      where.isAvailable = true
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        offer: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, pricePer100gm, weight, weightUnit, image, company, isAvailable, offerId } = body

    // Get the highest order number
    const lastProduct = await prisma.product.findFirst({
      orderBy: { order: 'desc' }
    })

    const newOrder = (lastProduct?.order || 0) + 1

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        pricePer100gm: pricePer100gm ? parseFloat(pricePer100gm) : null,
        weight: weight ? parseFloat(weight) : null,
        weightUnit: weightUnit || null,
        image,
        company,
        isAvailable: isAvailable !== false,
        order: newOrder,
        offerId: offerId || null
      },
      include: {
        offer: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
