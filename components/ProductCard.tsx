'use client'

import { useState } from 'react'
import { Plus, Package, Building2, Minus } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, calculatePricePerGmFromWeight, calculateDiscountedPrice, isOfferActive } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  pricePerGm?: number
  weight?: number
  weightUnit?: string
  image?: string
  company?: string
  isAvailable: boolean
  offer?: {
    id: string
    name: string
    discountPercentage: number
    endDate: string | Date
    endTime: string
    isActive: boolean
  }
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, items, updateQuantity } = useCartStore()

  // Get current cart item for this product
  const cartItem = items.find(item => item.id === product.id)
  const currentQuantity = cartItem?.quantity || 0

  // Calculate pricing with offers
  const hasActiveOffer = product.offer && isOfferActive(product.offer.endDate, product.offer.endTime)
  const displayPrice = hasActiveOffer 
    ? calculateDiscountedPrice(product.price, product.offer!.discountPercentage)
    : product.price

  // Calculate price per gm using discounted price
  const getPricePerGm = () => {
    if (product.pricePerGm && !hasActiveOffer) {
      return product.pricePerGm
    }
    
    if (product.weight && product.weightUnit) {
      return calculatePricePerGmFromWeight(displayPrice, product.weight, product.weightUnit)
    }
    
    // Default to 1kg if no weight specified
    return calculatePricePerGmFromWeight(displayPrice, 1, 'kg')
  }

  const pricePerGm = getPricePerGm()

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
        price: displayPrice, // Use discounted price
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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      updateQuantity(product.id, 0)
    } else {
      updateQuantity(product.id, newQuantity)
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
        
        {/* Availability Badge with Weight */}
        <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isAvailable ? 'Available' : 'Not Available'}
          </span>
          {product.weight && product.weightUnit && (
            <span className="px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium text-gray-700">
              {product.weight} {product.weightUnit}
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


        {/* Price - Line 1: Current Price */}
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary-600">
            ₹{displayPrice.toFixed(2)}
          </div>
          
          {/* Line 2: Slashed Price and Offer */}
          {hasActiveOffer && product.offer && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="line-through text-gray-500">₹{product.price.toFixed(2)}</span>
              <span className="text-red-600 font-medium">
                {product.offer.discountPercentage}% OFF
              </span>
            </div>
          )}
          
          {/* Line 3: Per gm, Add Button, and Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">₹{pricePerGm.toFixed(2)}</span> per gm
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quantity Controls - Only show when quantity > 0 */}
              {currentQuantity > 0 && (
                <div className="flex items-center space-x-1 bg-primary-50 border border-primary-200 rounded-lg px-2 py-1">
                  <button
                    onClick={() => handleQuantityChange(currentQuantity - 1)}
                    className="w-6 h-6 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold px-2 text-primary-700">{currentQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(currentQuantity + 1)}
                    className="w-6 h-6 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Add Button - Only show when quantity = 0 */}
              {currentQuantity === 0 && (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || isAdding}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !product.isAvailable
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAdding ? 'Adding...' : 'Add'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
