import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, discountPercentage, endDate, endTime, isActive } = body

    // Round discount percentage
    const roundedDiscount = Math.round(discountPercentage)

    const offer = await prisma.offer.update({
      where: { id: params.id },
      data: {
        name,
        discountPercentage: roundedDiscount,
        endDate: new Date(endDate),
        endTime,
        isActive
      }
    })

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, remove offer from all products
    await prisma.product.updateMany({
      where: { offerId: params.id },
      data: { offerId: null }
    })

    // Then delete the offer
    await prisma.offer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    )
  }
}
