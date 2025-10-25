import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth'
import { auth } from './firebase'

// Authentication functions
export const authHelpers = {
  // Sign up a new user
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  // Sign in an existing user
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  // Sign out the current user
  signOut: async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  // Listen to authentication state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback)
  }
}
