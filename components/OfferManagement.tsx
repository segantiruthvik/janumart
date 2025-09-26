'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Clock, Percent } from 'lucide-react'
import toast from 'react-hot-toast'

interface Offer {
  id: string
  name: string
  discountPercentage: number
  startDate: string
  endDate: string
  endTime: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface OfferFormProps {
  offer?: Offer | null
  onClose: () => void
  onSave: () => void
}

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers')
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      toast.error('Failed to fetch offers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    try {
      const response = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Offer deleted!')
        fetchOffers()
      } else {
        toast.error('Failed to delete offer')
      }
    } catch (error) {
      toast.error('Failed to delete offer')
    }
  }

  const handleSave = () => {
    fetchOffers()
    setShowForm(false)
    setEditingOffer(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Offer Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Offer</span>
        </button>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Active Offers</h3>
        </div>
        
        <div className="divide-y">
          {offers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No offers created yet
            </div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <h4 className="font-semibold text-gray-900">{offer.name}</h4>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        {offer.discountPercentage}% OFF
                      </span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Ends: {new Date(offer.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Time: {offer.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingOffer(offer)
                        setShowForm(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offer Form Modal */}
      {showForm && (
        <OfferForm
          offer={editingOffer}
          onClose={() => {
            setShowForm(false)
            setEditingOffer(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function OfferForm({ offer, onClose, onSave }: OfferFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    discountPercentage: '',
    endDate: '',
    endTime: '23:59',
    duration: '',
    isActive: true
  })

  useEffect(() => {
    if (offer) {
      setFormData({
        name: offer.name,
        discountPercentage: offer.discountPercentage.toString(),
        endDate: offer.endDate.split('T')[0],
        endTime: offer.endTime,
        duration: '',
        isActive: offer.isActive
      })
    }
  }, [offer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = offer ? `/api/offers/${offer.id}` : '/api/offers'
      const method = offer ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountPercentage: parseFloat(formData.discountPercentage)
        })
      })

      if (response.ok) {
        toast.success(offer ? 'Offer updated!' : 'Offer created!')
        onSave()
      } else {
        toast.error('Failed to save offer')
      }
    } catch (error) {
      toast.error('Failed to save offer')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex-shrink-0">
          <h3 className="text-lg font-semibold">
            {offer ? 'Edit Offer' : 'Create New Offer'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto min-h-0" id="offer-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Diwali Special"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="99"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="20"
              />
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Will be rounded to nearest whole number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Quick Select)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Custom Date</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="2days">2 Days</option>
              <option value="1week">1 Week</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default: 11:59 PM (end of day)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>

        </form>
        
        <div className="p-6 border-t flex-shrink-0">
          <div className="flex space-x-4">
            <button
              type="submit"
              form="offer-form"
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium"
            >
              {offer ? 'Update Offer' : 'Create Offer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
