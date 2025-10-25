'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const useTeammatePosts = (eventId: string) => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Real-time teammate posts listener
  useEffect(() => {
    if (!eventId) return

    const postsRef = collection(db, 'teammatePosts')
    const postsQuery = query(
      postsRef,
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const teammatePosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPosts(teammatePosts)
      },
      (err) => {
        console.error('Error listening to teammate posts:', err)
        setError('Failed to load teammate posts')
      }
    )

    return () => unsubscribe()
  }, [eventId])

  const createPost = async (postData: {
    title: string
    description: string
    skills: string[]
    lookingFor: string[]
    contactInfo: string
  }) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const postsRef = collection(db, 'teammatePosts')
      await addDoc(postsRef, {
        eventId,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        authorEmail: user.email,
        ...postData,
        createdAt: serverTimestamp()
      })
    } catch (err: any) {
      console.error('Error creating teammate post:', err)
      setError(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
    error,
    createPost
  }
}
