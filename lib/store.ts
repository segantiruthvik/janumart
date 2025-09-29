import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  company?: string
}

interface CartStore {
  items: CartItem[]
  paymentMethod: 'online' | 'cod' | 'gpay' | 'phonepe' | 'paytm'
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setPaymentMethod: (method: 'online' | 'cod' | 'gpay' | 'phonepe' | 'paytm') => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getDeliveryFee: () => number
  getCodFee: () => number
  getFinalTotal: () => number
  getAmountForFreeDelivery: () => number
  isMinimumOrderMet: () => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      paymentMethod: 'online' as 'online' | 'cod',
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }]
          })
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })
      },
      setPaymentMethod: (method) => {
        set({ paymentMethod: method })
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      getDeliveryFee: () => {
        const total = get().getTotalPrice()
        if (total >= 200) return 0 // Free delivery above ₹200
        if (total >= 50) return 20 // ₹20 delivery fee for ₹50-200
        return 0 // No delivery fee below ₹50 (but order won't be allowed)
      },
      getCodFee: () => {
        return get().paymentMethod === 'cod' ? 20 : 0 // ₹20 extra only for COD
      },
      getFinalTotal: () => {
        return get().getTotalPrice() + get().getDeliveryFee() + get().getCodFee()
      },
      getAmountForFreeDelivery: () => {
        const total = get().getTotalPrice()
        if (total >= 200) return 0
        return 200 - total
      },
      isMinimumOrderMet: () => {
        return get().getTotalPrice() >= 50
      }
    }),
    {
      name: 'janu-cart-storage',
    }
  )
)
