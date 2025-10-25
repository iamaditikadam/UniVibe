'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Tag, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react'
// UI components removed - using simple HTML elements
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { firestoreHelpers, eventsRef } from '@/lib/firestore-helpers'
import { uploadEventImage, validateImageFile } from '@/lib/storage-helpers'
import { ImageUpload } from '@/components/ImageUpload'

const categories = [
  'Hackathon', 'Tech', 'Gaming', 'Food', 'Sports', 
  'Cultural', 'Career', 'Wellness', 'Volunteering', 'Clubs'
]

const campuses = [
  'RMIT University',
  'University of Melbourne', 
  'Monash University',
  'Swinburne University'
]

export default function CreateEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    campus: '',
    location: '',
    description: '',
    coverImage: '',
    capacity: '',
    tags: [] as string[],
    hasFreeFood: false,
    isBeginnerFriendly: false
  })
  const [newTag, setNewTag] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid image file')
      return
    }
    setSelectedImage(file)
    setError('')
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create an event')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let imageUrl = formData.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
      
      // Upload image if selected
      if (selectedImage) {
        imageUrl = await uploadEventImage(selectedImage, `temp-${Date.now()}`)
      }

      // Create event data for Firestore
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: new Date(formData.startDate),
        time: formData.startTime,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        endTime: formData.endTime,
        location: formData.location,
        campus: formData.campus,
        host: {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          university: formData.campus
        },
        attendees: [],
        maxAttendees: formData.capacity ? parseInt(formData.capacity) : 50,
        isFree: true, // Default to free
        tags: formData.tags,
        requirements: [],
        hasFood: formData.hasFreeFood,
        image: imageUrl,
        createdBy: user.uid
      }

      // Save to Firestore
      await firestoreHelpers.add(eventsRef, eventData)
      
      // Success! Show success message and redirect
      alert('🎉 Event created successfully!')
      router.push('/')
    } catch (error: any) {
      console.error('Error creating event:', error)
      setError(error.message || 'Failed to create event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              Create New Event
            </h1>
            <p className="text-gray-600">
              Share your event with the campus community
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-gradient-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-gradient-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-gradient-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
            {step === 1 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  <p className="text-gray-600">Tell us about your event</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Gaming Night: Valorant Tournament"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Campus */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campus
                    </label>
                    <select
                      value={formData.campus}
                      onChange={(e) => handleInputChange('campus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select your campus</option>
                      {campuses.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Building 80, Level 3, Computer Lab"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full"
                    disabled={!formData.title || !formData.category || !formData.startDate}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Event Details</h2>
                  <p className="text-gray-600">Add more information about your event</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your event in detail..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent h-32 resize-none"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image (Optional)
                    </label>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      placeholder="Upload a cover image for your event"
                      className="w-full"
                    />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button onClick={addTag} disabled={!newTag.trim()}>
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200 transition-all duration-300" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.hasFreeFood}
                        onChange={(e) => handleInputChange('hasFreeFood', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">🍕 Free Food Available</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isBeginnerFriendly}
                        onChange={(e) => handleInputChange('isBeginnerFriendly', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">✨ Beginner-Friendly</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Event'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Preview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-primary rounded-xl flex items-center justify-center">
                    <span className="text-4xl">
                      {formData.category ? '🎉' : '📅'}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {formData.title || 'Your Event Title'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      by You
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Select date'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{formData.location || 'Location'}</span>
                    </div>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
