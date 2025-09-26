'use client'

import { ShoppingBag, Phone, Mail } from 'lucide-react'

export default function Header() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'JANU ENTERPRISE'
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91 9014231299'
  const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'janugamez@gmail.com'

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-brown-900">{businessName}</h1>
              <p className="text-sm text-brown-600">Premium Quality Food Distribution</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-brown-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{businessPhone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{businessEmail}</span>
            </div>
          </div>

          {/* Mobile Contact */}
          <div className="md:hidden">
            <a 
              href={`tel:${businessPhone.replace(/\s/g, '')}`}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">Call</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
