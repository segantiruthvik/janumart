'use client'

import { useState } from 'react'
import { Plus, Package, Building2, Tag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, calculateDiscountedPrice, calculatePricePer100gmFromWeight, isOfferActive, formatWeight } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  pricePer100gm?: number
  weight?: number
  weightUnit?: string
  image?: string
  company?: string
  isAvailable: boolean
  offer?: {
    id: string
    name: string
    discountPercentage: number
    endDate: string
    endTime: string
    isActive: boolean
  }
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()

  // Calculate pricing
  const hasActiveOffer = product.offer && isOfferActive(product.offer.endDate, product.offer.endTime)
  const displayPrice = hasActiveOffer 
    ? calculateDiscountedPrice(product.price, product.offer.discountPercentage)
    : product.price
  
  // Calculate price per 100gm based on actual weight or use provided value
  const displayPricePer100gm = product.pricePer100gm 
    ? (hasActiveOffer 
        ? calculatePricePer100gmFromWeight(displayPrice, product.weight || 1, product.weightUnit || 'kg')
        : product.pricePer100gm)
    : (product.weight && product.weightUnit 
        ? calculatePricePer100gmFromWeight(displayPrice, product.weight, product.weightUnit)
        : calculatePricePer100gmFromWeight(displayPrice, 1, 'kg')) // Default to 1kg if no weight specified

  const handleAddToCart = async () => {
    if (!product.isAvailable) {
      toast.error('Product not available')
      return
    }

    setIsAdding(true)
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: displayPrice, // Use discounted price if offer is active
        image: product.image,
        company: product.company
      })
      
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="card p-4 hover:scale-105 transition-transform duration-200">
      {/* Product Image */}
      <div className="relative mb-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-food.jpg'
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-cream-100 rounded-lg flex items-center justify-center">
            <Package className="w-16 h-16 text-primary-400" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isAvailable ? 'Available' : 'Not Available'}
          </span>
          {hasActiveOffer && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Tag className="w-3 h-3 inline mr-1" />
              {product.offer.discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Company */}
        {product.company && (
          <div className="flex items-center text-sm text-brown-600">
            <Building2 className="w-4 h-4 mr-1" />
            <span>{product.company}</span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-brown-900 text-lg line-clamp-2">
          {product.name}
        </h3>


        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              {hasActiveOffer && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    Save {formatPrice(product.price - displayPrice)}
                  </span>
                </div>
              )}
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(displayPrice)}
              </span>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable || isAdding}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                !product.isAvailable
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
          
          {/* Price per 100gm */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">₹{displayPricePer100gm.toFixed(2)}</span> per 100gm
            {product.weight && product.weightUnit && (
              <span className="ml-2 text-gray-500">
                ({formatWeight(product.weight, product.weightUnit)})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
