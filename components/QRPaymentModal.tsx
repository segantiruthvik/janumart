'use client'

import { useState, useEffect } from 'react'
import { X, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { formatPrice } from '../lib/utils'
import toast from 'react-hot-toast'

interface QRPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onPaymentSuccess: () => void
}

export default function QRPaymentModal({ isOpen, onClose, amount, onPaymentSuccess }: QRPaymentModalProps) {
  const { paymentStatus, paymentAttempts, setPaymentStatus, incrementPaymentAttempts, resetPaymentStatus } = useCartStore()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCountdown, setVerificationCountdown] = useState(0)

  const qrCodeImage = 'https://k1zi1iqv2o9yfraw.public.blob.vercel-storage.com/agency%20scanner.jpg'

  useEffect(() => {
    if (isOpen) {
      resetPaymentStatus()
    }
  }, [isOpen, resetPaymentStatus])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (verificationCountdown > 0) {
      interval = setInterval(() => {
        setVerificationCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [verificationCountdown])

  const handleVerifyPayment = async () => {
    setIsVerifying(true)
    setPaymentStatus('verifying')
    incrementPaymentAttempts()
    
    // Simulate payment verification (replace with actual API call)
    setTimeout(() => {
      // For demo purposes, randomly succeed/fail based on attempts
      const success = Math.random() > 0.3 || paymentAttempts >= 2
      
      if (success) {
        setPaymentStatus('success')
        toast.success('Payment verified successfully!')
        setTimeout(() => {
          onPaymentSuccess()
          onClose()
        }, 2000)
      } else {
        setPaymentStatus('failed')
        toast.error('Payment verification failed. Please try again.')
        setVerificationCountdown(30) // 30 second cooldown
      }
      setIsVerifying(false)
    }, 3000)
  }

  const handleRetryPayment = () => {
    resetPaymentStatus()
    setVerificationCountdown(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Scan & Pay</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Amount Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              ₹{amount.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Scan QR code to pay</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={qrCodeImage}
                alt="PhonePe QR Code"
                className="w-64 h-64 object-contain border border-gray-200 rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-food.jpg'
                }}
              />
              {paymentStatus === 'verifying' && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Verifying payment...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Payment Successful!</p>
              <p className="text-sm text-green-600">Your order is being processed...</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">Payment Failed</p>
              <p className="text-sm text-red-600">
                Attempt {paymentAttempts}: Please try scanning again
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">How to pay:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Open PhonePe app on your phone</li>
              <li>Tap on "Scan QR" or camera icon</li>
              <li>Scan the QR code above</li>
              <li>Enter amount: ₹{amount.toFixed(2)}</li>
              <li>Complete the payment</li>
              <li>Click "Verify Payment" below</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {paymentStatus === 'pending' && (
              <button
                onClick={handleVerifyPayment}
                disabled={isVerifying || verificationCountdown > 0}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  isVerifying || verificationCountdown > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : verificationCountdown > 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Wait {verificationCountdown}s</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify Payment</span>
                  </>
                )}
              </button>
            )}

            {paymentStatus === 'failed' && verificationCountdown === 0 && (
              <button
                onClick={handleRetryPayment}
                className="w-full py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
