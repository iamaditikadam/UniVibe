import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO_LQ-imliC6e2u7S-stW0a2PLPedWsiY",
  authDomain: "univibe-3dae0.firebaseapp.com",
  projectId: "univibe-3dae0",
  storageBucket: "univibe-3dae0.firebasestorage.app",
  messagingSenderId: "1091723662611",
  appId: "1:1091723662611:web:444cd8cbd870aad357f6e6",
  measurementId: "G-FFELSLJQSK"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
