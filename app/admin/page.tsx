'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingBag, 
  LogOut,
  ArrowUp,
  ArrowDown,
  Tag
} from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import OfferManagement from '@/components/OfferManagement'

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
  order: number
  offer?: {
    id: string
    name: string
    discountPercentage: number
    endDate: string
    endTime: string
    isActive: boolean
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showOffers, setShowOffers] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    pricePer100gm: '',
    weight: '',
    weightUnit: 'kg',
    company: '',
    isAvailable: true,
    image: '',
    offerId: ''
  })

  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'JANU ENTERPRISE'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProducts()
      fetchOffers()
    }
  }, [session])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.sort((a: Product, b: Product) => a.order - b.order))
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers')
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      toast.error('Failed to fetch offers')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          pricePer100gm: formData.pricePer100gm ? parseFloat(formData.pricePer100gm) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          offerId: formData.offerId || null
        })
      })

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product added!')
        fetchProducts()
        resetForm()
      } else {
        toast.error('Failed to save product')
      }
    } catch (error) {
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Product deleted!')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const moveProduct = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === productId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= products.length) return

    const newProducts = [...products]
    const [movedProduct] = newProducts.splice(currentIndex, 1)
    newProducts.splice(newIndex, 0, movedProduct)

    // Update order numbers
    const updatedProducts = newProducts.map((product, index) => ({
      ...product,
      order: index
    }))

    setProducts(updatedProducts)

    try {
      const response = await fetch('/api/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: updatedProducts.map(item => ({ id: item.id, order: item.order }))
        })
      })

      if (response.ok) {
        toast.success('Product order updated!')
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.error('Reorder error:', error)
      toast.error('Failed to update product order')
      fetchProducts() // Revert on error
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      pricePer100gm: '',
      weight: '',
      weightUnit: 'kg',
      company: '',
      isAvailable: true,
      image: '',
      offerId: ''
    })
    setEditingProduct(null)
    setShowAddForm(false)
    setIsEditing(false)
  }

  const startEdit = (product: Product) => {
    if (isEditing) return // Prevent multiple clicks
    
    console.log('Starting edit for product:', product.name) // Debug log
    setIsEditing(true)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      pricePer100gm: product.pricePer100gm?.toString() || '',
      weight: product.weight?.toString() || '',
      weightUnit: product.weightUnit || 'kg',
      company: product.company || '',
      isAvailable: product.isAvailable,
      image: product.image || '',
      offerId: product.offer?.id || ''
    })
    setShowAddForm(true)
    console.log('Form should be visible now') // Debug log
    
    // Reset editing state after a short delay
    setTimeout(() => setIsEditing(false), 500)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{businessName}</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isAvailable).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unavailable</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => !p.isAvailable).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setShowOffers(!showOffers)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <Tag className="w-5 h-5" />
            <span>{showOffers ? 'Hide Offers' : 'Manage Offers'}</span>
          </button>
        </div>

        {/* Offers Management */}
        {showOffers && (
          <div className="mb-8">
            <OfferManagement />
          </div>
        )}

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Brand
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per 100gm
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePer100gm}
                  onChange={(e) => setFormData({ ...formData, pricePer100gm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="45.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-calculate from weight
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="999.9"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1.0"
                  />
                  <select
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="kg">kg</option>
                    <option value="gm">gm</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter weight below 1000 (e.g., 1.5 kg or 500 gm)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apply Offer
                </label>
                <select
                  value={formData.offerId}
                  onChange={(e) => setFormData({ ...formData, offerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">No Offer</option>
                  {offers.filter(offer => offer.isActive).map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.name} ({offer.discountPercentage}% OFF)
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Available for customers</span>
                </label>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="text-sm text-gray-600">Use up/down arrows to reorder products</p>
          </div>
          
          <div className="divide-y">
            {products.map((product, index) => (
              <div key={product.id} className="flex items-center p-4 hover:bg-gray-50">
                {/* Order Controls */}
                <div className="flex flex-col space-y-1 mr-4">
                  <button
                    onClick={() => moveProduct(product.id, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${
                      index === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveProduct(product.id, 'down')}
                    disabled={index === products.length - 1}
                    className={`p-1 rounded ${
                      index === products.length - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    {product.company && (
                      <p className="text-sm text-gray-600">{product.company}</p>
                    )}
                    {product.offer && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 mt-1">
                        {product.offer.name} ({product.offer.discountPercentage}% OFF)
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{product.price.toFixed(2)}
                      </p>
                      {product.offer && (
                        <div className="text-xs">
                          <p className="text-green-600 font-medium">
                            Offer: ₹{Math.round(product.price * (1 - product.offer.discountPercentage / 100)).toFixed(2)}
                          </p>
                          <p className="text-gray-500">
                            Save: ₹{(product.price - Math.round(product.price * (1 - product.offer.discountPercentage / 100))).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                    {product.pricePer100gm && (
                      <p className="text-xs text-gray-500">
                        ₹{product.pricePer100gm.toFixed(2)}/100gm
                      </p>
                    )}
                    {product.weight && product.weightUnit && (
                      <p className="text-xs text-gray-500">
                        {product.weight} {product.weightUnit}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        startEdit(product)
                      }}
                      disabled={isEditing}
                      className={`p-1 rounded transition-colors ${
                        isEditing 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                      }`}
                      title={isEditing ? "Editing..." : "Edit product"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDelete(product.id)
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
