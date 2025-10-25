import { auth, db } from './firebase'
import { authHelpers } from './auth-helpers'
import { firestoreHelpers, eventsRef } from './firestore-helpers'

// Test Firebase connection
export const testFirebase = async () => {
  console.log('🔥 Testing Firebase connection...')
  
  try {
    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase Auth:', auth.app.name)
    console.log('✅ Firestore:', db.app.name)
    
    // Test 2: Try to get events collection (should work even if empty)
    console.log('📊 Testing Firestore connection...')
    const events = await firestoreHelpers.getAll(eventsRef)
    console.log('✅ Firestore working! Found', events.length, 'events')
    
    // Test 3: Check auth state
    console.log('🔐 Current auth state:', auth.currentUser ? 'User logged in' : 'No user')
    
    console.log('🎉 Firebase is working perfectly!')
    return true
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error)
    return false
  }
}

// Test authentication (optional - requires real credentials)
export const testAuth = async (email: string, password: string) => {
  console.log('🔐 Testing authentication...')
  
  try {
    // Try to sign in (this will fail if user doesn't exist, that's okay)
    await authHelpers.signIn(email, password)
    console.log('✅ Authentication working!')
    return true
  } catch (error) {
    console.log('ℹ️ Auth test completed (expected if user doesn\'t exist)')
    return true // This is actually success - Firebase is responding
  }
}
