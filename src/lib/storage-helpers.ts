import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

// Upload image to Firebase Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Create a reference to the file
    const imageRef = ref(storage, path)
    
    // Upload the file
    const snapshot = await uploadBytes(imageRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Upload event cover image
export const uploadEventImage = async (file: File, eventId: string): Promise<string> => {
  const path = `events/${eventId}/cover-${Date.now()}.${file.name.split('.').pop()}`
  return uploadImage(file, path)
}

// Upload user avatar
export const uploadUserAvatar = async (file: File, userId: string): Promise<string> => {
  const path = `users/${userId}/avatar-${Date.now()}.${file.name.split('.').pop()}`
  return uploadImage(file, path)
}

// Delete image from storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const url = new URL(imageUrl)
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0])
    
    const imageRef = ref(storage, path)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 2 * 1024 * 1024 // 2MB (reduced from 5MB for faster uploads)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 2MB for faster uploads. Please compress your image.' }
  }
  
  return { valid: true }
}
