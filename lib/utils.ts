import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  const discountAmount = (originalPrice * discountPercentage) / 100
  return Math.round(originalPrice - discountAmount)
}

export function calculatePricePerGm(price: number, weightInGrams: number): number {
  return Math.round((price / weightInGrams) * 100) / 100
}

export function calculatePricePerGmFromWeight(price: number, weight: number, unit: string): number {
  // Convert weight to grams
  const weightInGrams = unit === 'kg' ? weight * 1000 : weight
  return calculatePricePerGm(price, weightInGrams)
}

export function formatWeight(weight: number, unit: string): string {
  return `${weight} ${unit}`
}

export function calculateDiscountedPricePerGm(originalPrice: number, discountPercentage: number, weightInGrams: number = 1000): number {
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage)
  return calculatePricePerGm(discountedPrice, weightInGrams)
}

export function isOfferActive(endDate: string | Date, endTime: string = '23:59'): boolean {
  const now = new Date()
  let offerEnd: Date
  
  if (endDate instanceof Date) {
    // If endDate is already a Date object, use it directly
    offerEnd = new Date(endDate)
    // Set the time if endTime is provided
    if (endTime) {
      const [hours, minutes] = endTime.split(':')
      offerEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    }
  } else {
    // If endDate is a string, check if it already has time info
    if (endDate.includes('T')) {
      // Date string already includes time (e.g., '2025-10-03T08:57:53.086Z')
      offerEnd = new Date(endDate)
    } else {
      // Date string without time, add the endTime
      offerEnd = new Date(`${endDate}T${endTime}:00`)
    }
  }
  
  console.log('isOfferActive debug:', { now, offerEnd, isActive: now < offerEnd })
  return now < offerEnd
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}

export function formatWhatsAppMessage(items: any[], total: number, customerName?: string): string {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'JANU ENTERPRISE'
  
  const message = `🍽️ *${businessName} - Order Request*

${customerName ? `Customer: ${customerName}\n` : ''}📋 *Order Details:*

${items.map(item => 
  `• ${item.name}${item.company ? ` (${item.company})` : ''}
  Quantity: ${item.quantity}
  Price: ₹${item.price.toFixed(2)} each
  Subtotal: ₹${(item.price * item.quantity).toFixed(2)}`
).join('\n\n')}

💰 *Total Amount: ₹${total.toFixed(2)}*

📞 Please confirm this order and provide delivery details.`

  return message
}

export function generateWhatsAppURL(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
}
