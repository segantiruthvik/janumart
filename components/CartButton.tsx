'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { formatPrice, formatWhatsAppMessage, generateWhatsAppURL } from '../lib/utils'
import toast from 'react-hot-toast'

interface CartButtonProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function CartButton({ isOpen: externalIsOpen, onClose: externalOnClose }: CartButtonProps) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCartStore()

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const onClose = externalOnClose || (() => setInternalIsOpen(false))

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const total = getTotalPrice()
    const message = formatWhatsAppMessage(items, total, customerName)
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210'
    const whatsappURL = generateWhatsAppURL(whatsappNumber, message)
    
    window.open(whatsappURL, '_blank')
    
    // Clear cart after sending
    clearCart()
    setCustomerName('')
    setCustomerPhone('')
    onClose()
    
    toast.success('Order sent to WhatsApp!')
  }

  return (
    <>
      {/* Floating Cart Button - Only show when used as floating button */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 sm:p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 z-50 touch-manipulation"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
            {isClient && getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Cart Modal - Mobile Optimized */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-brown-900">Your Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 touch-manipulation"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
              {items.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-brown-900 text-xs sm:text-sm truncate">{item.name}</h3>
                      {item.company && (
                        <p className="text-xs text-brown-600 truncate">{item.company}</p>
                      )}
                      <p className="text-xs sm:text-sm font-semibold text-primary-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors touch-manipulation"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="w-6 sm:w-8 text-center font-semibold text-primary-700 text-xs sm:text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors touch-manipulation"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Customer Info & Total */}
            {items.length > 0 && (
              <div className="p-3 sm:p-4 border-t space-y-3 sm:space-y-4 flex-shrink-0">
                {/* Customer Info */}
                <div className="space-y-2 sm:space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone (Optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 touch-manipulation"
                >
                  <span className="text-sm sm:text-base">Order via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
