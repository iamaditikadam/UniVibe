import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { User } from './types'

// User collection reference
export const usersRef = (userId: string) => doc(db, 'users', userId)

// Create or update user data
export const saveUserData = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = usersRef(userId)
    await setDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Error saving user data:', error)
    throw error
  }
}

// Get user data
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userRef = usersRef(userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        id: userSnap.id,
        name: data.name || '',
        email: data.email || '',
        campus: data.campus || '',
        avatar: data.avatar || '',
        interests: data.interests || [],
        vibePoints: data.vibePoints || 0,
        createdAt: data.createdAt?.toDate() || new Date()
      }
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}

// Update user interests
export const updateUserInterests = async (userId: string, interests: string[]) => {
  try {
    const userRef = usersRef(userId)
    await updateDoc(userRef, {
      interests,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating user interests:', error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, profileData: {
  name?: string
  campus?: string
  avatar?: string
}) => {
  try {
    const userRef = usersRef(userId)
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}
