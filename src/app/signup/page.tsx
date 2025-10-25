'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, MapPin, Heart } from 'lucide-react'
// UI components removed - using simple HTML elements
import { useAuth } from '@/contexts/AuthContext'
import { validateUniversityEmail, getUniversityFromEmail } from '@/lib/email-validation'
import { saveUserData } from '@/lib/user-helpers'

const campuses = [
  'RMIT University',
  'University of Melbourne',
  'Monash University',
  'Swinburne University'
]

const interests = [
  'Tech', 'Gaming', 'Food', 'Sports', 'Cultural', 'Career', 
  'Wellness', 'Volunteering', 'Hackathon', 'Music', 'Art', 'Photography'
]

const clubCategories = [
  'Academic', 'Sports', 'Cultural', 'Tech', 'Arts', 'Volunteering', 
  'Professional', 'Religious', 'Political', 'Environmental', 'Other'
]

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [userType, setUserType] = useState<'student' | 'club' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    campus: '',
    interests: [] as string[],
    // Club-specific fields
    clubDescription: '',
    clubWebsite: '',
    clubCategory: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (!validateUniversityEmail(formData.email)) {
      setError('Please use a valid university email address (e.g., student@university.edu)')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (!formData.name.trim()) {
      setError('Please enter your name')
      setIsLoading(false)
      return
    }

    if (!formData.campus) {
      setError('Please select your campus')
      setIsLoading(false)
      return
    }

    // Club-specific validation
    if (userType === 'club') {
      if (!formData.clubDescription.trim()) {
        setError('Please enter a club description')
        setIsLoading(false)
        return
      }
      if (!formData.clubCategory) {
        setError('Please select a club category')
        setIsLoading(false)
        return
      }
    }
    
    try {
      // Create Firebase user
      const user = await signUp(formData.email, formData.password)
      
      // Save additional user data to Firestore
      const userData = {
        name: formData.name,
        email: formData.email,
        campus: formData.campus,
        interests: formData.interests,
        vibePoints: 0,
        createdAt: new Date(),
        userType: userType === 'club' ? 'club' : 'student',
        ...(userType === 'club' && {
          clubDescription: formData.clubDescription,
          clubWebsite: formData.clubWebsite,
          clubCategory: formData.clubCategory
        })
      }
      
      await saveUserData(user.uid, userData)
      console.log('User created successfully with data saved to Firestore')
      
      // Success - redirect to home page
      router.push('/')
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">U</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">
            Join UniVibe
          </h2>
          <p className="text-white/90">
            Create your account and start discovering amazing events
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-center text-gray-900">
              {!userType ? 'Join UniVibe' : `Create ${userType === 'student' ? 'Student' : 'Club'} Account`}
            </h3>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              {!userType && (
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Choose your account type</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setUserType('student')}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-center"
                    >
                      <div className="text-4xl mb-2">🎓</div>
                      <h5 className="font-semibold text-gray-900">Student</h5>
                      <p className="text-sm text-gray-600 mt-1">Join events and discover opportunities</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('club')}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-center"
                    >
                      <div className="text-4xl mb-2">🏛️</div>
                      <h5 className="font-semibold text-gray-900">Club/Organization</h5>
                      <p className="text-sm text-gray-600 mt-1">Create and manage events</p>
                    </button>
                  </div>
                </div>
              )}

              {userType && (
                <>
                  {/* Back Button */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setUserType(null)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      ← Back to account type selection
                    </button>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium capitalize">
                      {userType} Account
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === 'club' ? 'Club/Organization Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={userType === 'club' ? 'Enter your club/organization name' : 'Enter your full name'}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-12 w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="your.email@student.university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-12 w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  formData.email && !validateUniversityEmail(formData.email) 
                    ? 'text-red-500' 
                    : 'text-gray-500'
                }`}>
                  {formData.email && !validateUniversityEmail(formData.email) 
                    ? 'Please use a valid university email address' 
                    : 'Must be a valid university email address'
                  }
                </p>
              </div>

              {/* Campus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.campus}
                    onChange={(e) => handleInputChange('campus', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your campus</option>
                    {campuses.map(campus => (
                      <option key={campus} value={campus}>{campus}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Interests - Only for students */}
              {userType === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (Optional)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Help us recommend events you'll love
                  </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-gradient-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                </div>
              )}

              {/* Club-specific fields */}
              {userType === 'club' && (
                <>
                  {/* Club Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Club Description
                    </label>
                    <textarea
                      placeholder="Tell us about your club, its mission, and what you do..."
                      value={formData.clubDescription}
                      onChange={(e) => handleInputChange('clubDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Club Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Club Category
                    </label>
                    <select
                      value={formData.clubCategory}
                      onChange={(e) => handleInputChange('clubCategory', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {clubCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Club Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        placeholder="https://yourclub.com"
                        value={formData.clubWebsite}
                        onChange={(e) => handleInputChange('clubWebsite', e.target.value)}
                        className="pl-12 w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                  required
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-white/90">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-white hover:text-white/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
