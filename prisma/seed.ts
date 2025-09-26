import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@januenterprise.com' },
    update: {},
    create: {
      email: 'admin@januenterprise.com',
      password: hashedPassword,
      name: 'Admin',
      isAdmin: true,
    },
  })

  // Create sample offers
  const diwaliOffer = await prisma.offer.create({
    data: {
      name: 'Diwali Special',
      discountPercentage: 15,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endTime: '23:59',
      isActive: true
    }
  })

  const weekendOffer = await prisma.offer.create({
    data: {
      name: 'Weekend Sale',
      discountPercentage: 10,
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endTime: '18:00',
      isActive: true
    }
  })

  // Create sample products
  const products = [
    {
      name: 'Premium Basmati Rice',
      price: 450,
      pricePerGm: 0.45,
      weight: 1.0,
      weightUnit: 'kg',
      company: 'Royal Foods',
      isAvailable: true,
      order: 1,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      offerId: diwaliOffer.id
    },
    {
      name: 'Extra Virgin Olive Oil',
      price: 650,
      pricePerGm: 0.65,
      weight: 1.0,
      weightUnit: 'kg',
      company: 'Mediterranean Gold',
      isAvailable: true,
      order: 2,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
      offerId: weekendOffer.id
    },
    {
      name: 'Whole Wheat Flour',
      price: 120,
      pricePerGm: 0.12,
      weight: 1.0,
      weightUnit: 'kg',
      company: 'Farm Fresh',
      isAvailable: true,
      order: 3,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      name: 'Organic Quinoa',
      price: 800,
      pricePerGm: 0.80,
      weight: 1.0,
      weightUnit: 'kg',
      company: 'Nature\'s Best',
      isAvailable: true,
      order: 4,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      offerId: diwaliOffer.id
    },
    {
      name: 'Coconut Oil',
      price: 280,
      pricePerGm: 0.28,
      weight: 1.0,
      weightUnit: 'kg',
      company: 'Tropical Pure',
      isAvailable: true,
      order: 5,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'
    },
    {
      name: 'Mixed Nuts',
      price: 950,
      pricePerGm: 0.95,
      weight: 1.0,
      weightUnit: 'kg',
      company: 'Nutty Delights',
      isAvailable: true,
      order: 6,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      offerId: weekendOffer.id
    },
    {
      name: 'Brown Sugar',
      price: 180,
      pricePerGm: 0.18,
      weight: 500,
      weightUnit: 'gm',
      company: 'Sweet Harvest',
      isAvailable: true,
      order: 7,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      name: 'Black Pepper',
      price: 320,
      pricePerGm: 0.32,
      weight: 100,
      weightUnit: 'gm',
      company: 'Spice World',
      isAvailable: true,
      order: 8,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      offerId: diwaliOffer.id
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })