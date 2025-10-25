import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Collection references
export const usersRef = collection(db, 'users')
export const eventsRef = collection(db, 'events')
export const rsvpsRef = collection(db, 'rsvps')

// Helper functions for database operations
export const firestoreHelpers = {
  // Add a new document
  add: async (collectionRef: any, data: any) => {
    try {
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now()
      })
      return docRef
    } catch (error) {
      console.error('Error adding document:', error)
      throw error
    }
  },

  // Get all documents from a collection
  getAll: async (collectionRef: any) => {
    try {
      const querySnapshot = await getDocs(collectionRef)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() || {})
      }))
    } catch (error) {
      console.error('Error getting documents:', error)
      throw error
    }
  },

  // Get a single document
  get: async (collectionRef: any, id: string) => {
    try {
      const docRef = doc(collectionRef, id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  },

  // Delete a document
  delete: async (collectionRef: any, id: string) => {
    try {
      const docRef = doc(collectionRef, id)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }
}
