'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)

  // Custom image compression function
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          // Draw and compress
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  })
                  resolve(compressedFile)
                } else {
                  resolve(file) // Fallback to original file
                }
              },
              'image/jpeg',
              quality
            )
          } else {
            resolve(file) // Fallback if no context
          }
        } catch (error) {
          console.error('Compression error:', error)
          resolve(file) // Fallback to original file
        }
      }

      img.onerror = () => {
        console.error('Image load error')
        resolve(file) // Fallback to original file
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setCompressing(true)

    try {
      // Compress the image
      const compressedFile = await compressImage(file, 800, 0.8)
      
      // Show compression results
      const originalSize = (file.size / 1024 / 1024).toFixed(2)
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2)
      const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1)
      
      console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB (${compressionRatio}% reduction)`)
      
      setCompressing(false)
      setUploading(true)

      const formData = new FormData()
      formData.append('file', compressedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Use the fileUrl directly from the response (it's already a complete URL)
        const fileUrl = result.fileUrl
        setPreview(fileUrl)
        onChange(fileUrl)
        toast.success(`Image uploaded successfully! (Compressed from ${originalSize}MB to ${compressedSize}MB)`)
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setCompressing(false)
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onChange('')
  }

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Product preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={removeImage}
            disabled={disabled}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
          id="image-upload"
        />
        
        <label
          htmlFor="image-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            disabled || uploading || compressing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {compressing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-blue-500 text-sm">Compressing...</span>
            </div>
          ) : uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
          
          <div className="text-sm text-gray-600">
            {compressing ? (
              'Compressing image...'
            ) : uploading ? (
              'Uploading...'
            ) : preview ? (
              'Click to change image'
            ) : (
              'Click to upload product image'
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {compressing ? (
              'Optimizing for web...'
            ) : (
              'PNG, JPG, GIF up to 10MB (auto-compressed)'
            )}
          </div>
        </label>
      </div>

      {/* URL Input Alternative */}
      <div className="text-center text-sm text-gray-500">
        or
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Or enter image URL
        </label>
        <input
          type="url"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value)
            setPreview(e.target.value)
          }}
          placeholder="https://example.com/image.jpg"
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
        />
      </div>
    </div>
  )
}
