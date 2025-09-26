'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, formatWhatsAppMessage, generateWhatsAppURL } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isClient, setIsClient] = useState(false)
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCartStore()

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
    setIsOpen(false)
    
    toast.success('Order sent to WhatsApp!')
  }

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {isClient && getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </div>
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-brown-900">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingCart className="w-6 h-6 text-primary-500" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-brown-900 text-sm">{item.name}</h3>
                      {item.company && (
                        <p className="text-xs text-brown-600">{item.company}</p>
                      )}
                      <p className="text-sm font-semibold text-primary-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Customer Info & Total */}
            {items.length > 0 && (
              <div className="p-4 border-t space-y-4 flex-shrink-0">
                {/* Customer Info */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone (Optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
