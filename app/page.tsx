'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Package, Star } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import CartButton from '@/components/CartButton'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'

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
  const { getTotalItems } = useCartStore()

  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'JANU ENTERPRISE'

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTerm || selectedCompany) {
      let filtered = products
      
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.company?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (selectedCompany) {
        filtered = filtered.filter(product =>
          product.company === selectedCompany
        )
      }
      
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, selectedCompany, products])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?available=true')
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
      
      // Extract unique companies for filter
      const uniqueCompanies = Array.from(new Set(data.map((product: Product) => product.company).filter(Boolean))) as string[]
      setCompanies(uniqueCompanies)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const availableProducts = filteredProducts.filter(product => 
    product.isAvailable
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-primary-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-brown-900 mb-4">
            {businessName}
          </h1>
          <p className="text-xl md:text-2xl text-brown-700 mb-8">
            Premium Quality Food Distribution
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-600">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-medium">Trusted by thousands of customers</span>
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for rice, grains, oils, flour, biscuits, snacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
            
            {/* Company Filter */}
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg appearance-none bg-white"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(searchTerm || selectedCompany) && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCompany('')
                }}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : availableProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Check back later for new products'
              }
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {availableProducts.length}
            </div>
            <div className="text-gray-600">Products Available</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              1000+
            </div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              24/7
            </div>
            <div className="text-gray-600">Order Support</div>
          </div>
        </div>
      </main>

      {/* Floating Cart Button */}
      {isClient && getTotalItems() > 0 && <CartButton />}
    </div>
  )
}
