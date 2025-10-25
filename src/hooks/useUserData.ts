'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserData, updateUserProfile, updateUserInterests } from '@/lib/user-helpers'
import { User } from '@/lib/types'

export const useUserData = () => {
  const { user, loading: userLoading } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || userLoading) {
      setLoading(false)
      return
    }

    const loadUserData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserData(user.uid)
        
        if (data) {
          setUserData(data)
        } else {
          // If no user data exists, create default user data
          console.log('No user data found, creating default profile...')
          const defaultUserData = {
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            campus: 'RMIT University',
            avatar: '',
            interests: [],
            vibePoints: 0,
            createdAt: new Date()
          }
          
          // Save default user data
          const { saveUserData } = await import('@/lib/user-helpers')
          await saveUserData(user.uid, defaultUserData)
          setUserData(defaultUserData)
        }
      } catch (err: any) {
        console.error('Error loading user data:', err)
        setError(err.message || 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, userLoading])

  const updateProfile = async (profileData: {
    name?: string
    campus?: string
    avatar?: string
  }) => {
    if (!user) return

    try {
      setError(null)
      await updateUserProfile(user.uid, profileData)
      
      // Update local state
      setUserData(prev => prev ? { ...prev, ...profileData } : null)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
      throw err
    }
  }

  const updateInterests = async (interests: string[]) => {
    if (!user) return

    try {
      setError(null)
      await updateUserInterests(user.uid, interests)
      
      // Update local state
      setUserData(prev => prev ? { ...prev, interests } : null)
    } catch (err: any) {
      console.error('Error updating interests:', err)
      setError(err.message || 'Failed to update interests')
      throw err
    }
  }

  return {
    userData,
    loading,
    error,
    updateProfile,
    updateInterests
  }
}
