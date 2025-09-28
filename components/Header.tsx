'use client'

import { ShoppingBag, Phone, Mail, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { useState, useEffect } from 'react'
import CartButton from './CartButton'

export default function Header() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'JANU ENTERPRISE'
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91 9014231299'
  const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'janugamez@gmail.com'
  const { getTotalItems, getTotalPrice } = useCartStore()
  const [isClient, setIsClient] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-3 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand - Mobile Optimized */}
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 p-1.5 sm:p-2 rounded-lg">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-brown-900">{businessName}</h1>
                <p className="text-xs sm:text-sm text-brown-600 hidden sm:block">Premium Quality Food Distribution</p>
              </div>
            </div>

            {/* Right Side - Contact and Cart */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Cart Button - Always Visible */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 touch-manipulation"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Cart {isClient && getTotalItems() > 0 && `(${getTotalItems()})`}
                </span>
                {isClient && getTotalItems() > 0 && (
                  <span className="text-xs sm:text-sm font-bold text-primary-600">
                    ₹{getTotalPrice().toFixed(2)}
                  </span>
                )}
              </button>

              {/* Contact Info - Desktop */}
              <div className="hidden lg:flex items-center space-x-4 text-sm text-brown-600">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{businessPhone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{businessEmail}</span>
                </div>
              </div>

              {/* Mobile Contact */}
              <div className="lg:hidden">
                <a 
                  href={`tel:${businessPhone.replace(/\s/g, '')}`}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      <CartButton isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
