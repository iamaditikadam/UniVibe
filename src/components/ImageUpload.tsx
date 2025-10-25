'use client'
import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
// UI components removed - using simple HTML elements

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onImageRemove?: () => void
  currentImage?: string
  placeholder?: string
  className?: string
}

export function ImageUpload({ 
  onImageSelect, 
  onImageRemove, 
  currentImage, 
  placeholder = "Click to upload image",
  className = ""
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onImageRemove) {
      onImageRemove()
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">{placeholder}</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
            <button type="button" className="mt-4 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
