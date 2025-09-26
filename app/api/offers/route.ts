import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        products: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, discountPercentage, endDate, endTime, duration } = body

    // Calculate end date based on duration or provided date
    let calculatedEndDate = new Date(endDate)
    
    if (duration) {
      const now = new Date()
      switch (duration) {
        case 'tomorrow':
          calculatedEndDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          break
        case '2days':
          calculatedEndDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
          break
        case '1week':
          calculatedEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
        default:
          calculatedEndDate = new Date(endDate)
      }
    }

    // Round discount percentage
    const roundedDiscount = Math.round(discountPercentage)

    const offer = await prisma.offer.create({
      data: {
        name,
        discountPercentage: roundedDiscount,
        endDate: calculatedEndDate,
        endTime: endTime || '23:59'
      }
    })

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}
