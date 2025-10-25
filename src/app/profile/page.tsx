'use client'

import React, { useState, useEffect } from 'react'
import { User, MapPin, Star, Calendar, Trophy, Settings, LogOut, Edit3 } from 'lucide-react'
// UI components removed - using simple HTML elements
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useUserData } from '@/hooks/useUserData'
import { uploadUserAvatar, validateImageFile } from '@/lib/storage-helpers'
import { ImageUpload } from '@/components/ImageUpload'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { userData, loading: userDataLoading, error: userDataError, updateProfile, updateInterests } = useUserData()
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '',
    campus: '',
    interests: [] as string[]
  })
  const [newInterest, setNewInterest] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setUserInfo({
        name: userData.name || user?.displayName || user?.email?.split('@')[0] || 'User',
        campus: userData.campus || 'RMIT University',
        interests: userData.interests || []
      })
    } else if (user && !userDataLoading) {
      // If no userData but user is loaded, set default values
      setUserInfo({
        name: user?.displayName || user?.email?.split('@')[0] || 'User',
        campus: 'RMIT University',
        interests: []
      })
    }
  }, [userData, user, userDataLoading])

  // Calculate stats (simplified for now)
  const attendedEvents = 0 // TODO: Calculate from real data
  const hostedEvents = 0 // TODO: Calculate from real data
  const vibePoints = userData?.vibePoints || 0

  const addInterest = () => {
    if (newInterest.trim() && !userInfo.interests.includes(newInterest.trim())) {
      setUserInfo(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setUserInfo(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const handleAvatarSelect = (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error || 'Invalid image file')
      return
    }
    setSelectedAvatar(file)
  }

  const handleAvatarRemove = () => {
    setSelectedAvatar(null)
    setAvatarPreview('')
  }

  const handleSave = async () => {
    try {
      setSaveStatus('saving')
      let avatarUrl = userData?.avatar
      
      // Upload avatar if selected with timeout
      if (selectedAvatar && user) {
        try {
          // Add timeout for image upload (30 seconds)
          const uploadPromise = uploadUserAvatar(selectedAvatar, user.uid)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Image upload timeout')), 30000)
          )
          
          avatarUrl = await Promise.race([uploadPromise, timeoutPromise]) as string
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError)
          setSaveStatus('error')
          setTimeout(() => setSaveStatus('idle'), 5000)
          return
        }
      }
      
      // Save profile data with timeout
      const savePromise = Promise.all([
        updateProfile({
          name: userInfo.name,
          campus: userInfo.campus,
          avatar: avatarUrl
        }),
        updateInterests(userInfo.interests)
      ])
      
      const saveTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save timeout')), 15000)
      )
      
      await Promise.race([savePromise, saveTimeoutPromise])
      
      setSaveStatus('success')
      setIsEditing(false)
      setSelectedAvatar(null)
      
      // Clear success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    }
  }

  const stats = [
    { label: 'Events Attended', value: attendedEvents, icon: Calendar, color: 'text-blue-600' },
    { label: 'Events Hosted', value: hostedEvents, icon: Trophy, color: 'text-green-600' },
    { label: 'Vibe Points', value: vibePoints, icon: Star, color: 'text-yellow-600' },
  ]

  // Show loading state while user data is loading
  if (userDataLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {selectedAvatar ? (
              <img 
                src={URL.createObjectURL(selectedAvatar)} 
                alt="Profile Preview" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-accent text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all"
                title="Change avatar"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {selectedAvatar && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            {userInfo.name}
          </h1>
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{userInfo.campus}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900">
              {vibePoints} Vibe Points
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all duration-300 flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>
            
            {/* Hidden file input for avatar upload */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAvatarSelect(e.target.files[0])
                }
              }}
              className="hidden"
            />
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{userInfo.name}</p>
                )}
              </div>

              {/* Campus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                {isEditing ? (
                  <select
                    value={userInfo.campus}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, campus: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="RMIT University">RMIT University</option>
                    <option value="University of Melbourne">University of Melbourne</option>
                    <option value="Monash University">Monash University</option>
                    <option value="Swinburne University">Swinburne University</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userInfo.campus}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              {isEditing && (
                <div className="space-y-3">
                  {saveStatus === 'success' && (
                    <div className="text-green-600 text-sm font-medium">
                      ✅ Profile saved successfully!
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="text-red-600 text-sm font-medium">
                      ❌ Failed to save profile. This might be due to:
                      <ul className="list-disc list-inside mt-1 text-xs">
                        <li>Slow internet connection</li>
                        <li>Large image file</li>
                        <li>Firebase connection issue</li>
                      </ul>
                      <p className="mt-1 text-xs">Try again or use a smaller image.</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button 
                      onClick={handleSave} 
                      className="flex-1 bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={saveStatus === 'saving'}
                    >
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saveStatus === 'saving' && (
                      <button 
                        onClick={() => {
                          setSaveStatus('idle')
                          // Reset to original values
                          if (userData) {
                            setUserInfo({
                              name: userData.name || user?.displayName || user?.email?.split('@')[0] || 'User',
                              campus: userData.campus || 'RMIT University',
                              interests: userData.interests || []
                            })
                          }
                          setSelectedAvatar(null)
                        }}
                        className="px-6 py-3 border border-red-300 bg-white hover:bg-red-50 text-red-600 rounded-lg transition-all duration-300"
                      >
                        Cancel Save
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setIsEditing(false)
                        setSaveStatus('idle')
                        setSelectedAvatar(null)
                      }}
                      disabled={saveStatus === 'saving'}
                      className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Interests</h2>
              <p className="text-sm text-gray-600">
                Help us recommend events you'll love
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Add Interest */}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <button 
                    onClick={addInterest} 
                    disabled={!newInterest.trim()}
                    className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Interest Tags */}
              <div className="flex flex-wrap gap-2">
                {userInfo.interests.map(interest => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => isEditing && removeInterest(interest)}
                  >
                    {interest}
                    {isEditing && ' ×'}
                  </Badge>
                ))}
              </div>

              {userInfo.interests.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No interests added yet. Add some to get better event recommendations!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Get notified about new events and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Email Updates</h3>
                <p className="text-sm text-gray-600">Receive weekly event summaries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900">Privacy</h3>
                <p className="text-sm text-gray-600">Make your profile visible to other students</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-lg border border-red-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
              </div>
              <button className="px-6 py-3 border border-red-300 bg-white hover:bg-red-50 text-red-600 rounded-lg transition-all duration-300">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
