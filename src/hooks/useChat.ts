'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { firestoreHelpers, rsvpsRef } from '@/lib/firestore-helpers'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const useChat = (eventId: string) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Real-time chat messages listener
  useEffect(() => {
    if (!eventId) return

    console.log('Setting up chat listener for event:', eventId)
    setError(null) // Clear any previous errors

    const messagesRef = collection(db, 'chatMessages')
    const messagesQuery = query(
      messagesRef,
      where('eventId', '==', eventId)
      // Removed orderBy to avoid index requirement
    )

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        console.log('Chat snapshot received:', snapshot.docs.length, 'messages')
        const chatMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort messages by creation time in JavaScript
        chatMessages.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)
          return aTime.getTime() - bTime.getTime()
        })
        setMessages(chatMessages)
        setError(null) // Clear error on successful load
      },
      (err) => {
        console.error('Error listening to chat messages:', err)
        setError(`Failed to load chat messages: ${err.message}`)
      }
    )

    return () => unsubscribe()
  }, [eventId])

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return

    console.log('Sending message:', content, 'for event:', eventId)
    setLoading(true)
    setError(null)

    try {
      const messagesRef = collection(db, 'chatMessages')
      const messageData = {
        eventId,
        senderId: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        senderEmail: user.email,
        content: content.trim(),
        createdAt: serverTimestamp()
      }
      
      console.log('Message data:', messageData)
      const docRef = await addDoc(messagesRef, messageData)
      console.log('Message sent successfully with ID:', docRef.id)
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(`Failed to send message: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage
  }
}
