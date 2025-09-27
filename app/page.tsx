'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Package, Star, Tag } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { formatPrice } from '../lib/utils'
import CartButton from '../components/CartButton'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [companies, setCompanies] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [showOffersOnly, setShowOffersOnly] = useState(false)
  const { getTotalItems } = useCartStore()

  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'JANU ENTERPRISE'

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([])
      return
    }
    
    let filtered = products
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply company filter
    if (selectedCompany) {
      filtered = filtered.filter(product =>
        product.company === selectedCompany
      )
    }
    
    // Apply offers filter
    if (showOffersOnly) {
      filtered = filtered.filter(product =>
        product.offer && product.offer.isActive
      )
    }
    
    setFilteredProducts(filtered)
  }, [searchTerm, selectedCompany, products, showOffersOnly])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?available=true')
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Error fetching products:', data.error)
        setProducts([])
        setFilteredProducts([])
        setCompanies([])
        return
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProducts(data)
        setFilteredProducts(data)
        
        // Extract unique companies for filter
        const uniqueCompanies = Array.from(new Set(data.map((product: Product) => product.company).filter(Boolean))) as string[]
        setCompanies(uniqueCompanies)
      } else {
        console.error('Invalid data format:', data)
        setProducts([])
        setFilteredProducts([])
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setFilteredProducts([])
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const availableProducts = Array.isArray(filteredProducts) 
    ? filteredProducts.filter(product => product.isAvailable)
    : []

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCompany('')
    setShowOffersOnly(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-primary-50">
      <Header />
      
      <main className="container mx-auto px-2 sm:px-3 py-3 sm:py-4">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brown-900 mb-1 sm:mb-2">
            {businessName}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-brown-700 mb-2 sm:mb-3">
            Premium Quality Food Distribution
          </p>
          <div className="flex items-center justify-center gap-1 text-primary-600">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            <span className="text-xs sm:text-sm font-medium">Trusted by thousands</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          </div>
        </div>

        {/* Search and Filter Bar - Mobile Optimized */}
        <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Company Filter */}
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full pl-3 pr-6 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Show Offers Button */}
          <div className="mt-2 sm:mt-3 text-center">
            <button
              onClick={() => setShowOffersOnly(!showOffersOnly)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg font-medium text-sm transition-colors touch-manipulation ${
                showOffersOnly
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-4 h-4" />
              {showOffersOnly ? 'Hide Offers' : 'Show Offers'}
            </button>
          </div>
          
          {/* Clear Filters */}
          {(searchTerm || selectedCompany || showOffersOnly) && (
            <div className="mt-2 sm:mt-3 text-center">
              <button
                onClick={clearAllFilters}
                className="text-primary-600 hover:text-primary-700 text-xs font-medium touch-manipulation"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Products Grid - Mobile Optimized */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : availableProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {availableProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">
              {showOffersOnly ? 'No offers available' : searchTerm ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {showOffersOnly 
                ? 'Check back later for new offers' 
                : searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Check back later for new products'
              }
            </p>
          </div>
        )}

        {/* Stats Section - Mobile Optimized */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 mb-1">
              {availableProducts.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Products Available</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 mb-1">
              1000+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 mb-1">
              8AM-7PM
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Mon-Sat Support</div>
          </div>
        </div>
      </main>

      {/* Floating Cart Button */}
      {isClient && getTotalItems() > 0 && <CartButton />}
    </div>
  )
}
