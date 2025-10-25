'use client'

import { useState, useEffect } from 'react'
import { eventsRef } from '@/lib/firestore-helpers'
import { Event } from '@/lib/types'
import { onSnapshot, query, orderBy } from 'firebase/firestore'

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    // Create a real-time listener for events
    const eventsQuery = query(eventsRef, orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        try {
          const firestoreEvents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // Transform Firestore data to match our Event type
          const transformedEvents: Event[] = firestoreEvents.map((doc: any) => ({
            id: doc.id,
            title: doc.title || 'Untitled Event',
            description: doc.description || '',
            date: doc.date?.toDate() || new Date(),
            time: doc.time || '7:00 PM',
            endDate: doc.endDate?.toDate(),
            endTime: doc.endTime,
            location: doc.location || 'TBA',
            category: doc.category || 'general',
            image: doc.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
            host: doc.host || {
              id: 'unknown',
              name: 'Unknown Host',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              university: 'Unknown University'
            },
            attendees: doc.attendees || [],
            maxAttendees: doc.maxAttendees || 50,
            isFree: doc.isFree !== false,
            tags: doc.tags || [],
            requirements: doc.requirements || [],
            hasFood: doc.hasFood || false,
            campus: doc.campus || 'main',
            createdBy: doc.createdBy || 'unknown',
            createdAt: doc.createdAt?.toDate() || new Date(),
            updatedAt: doc.updatedAt?.toDate() || new Date()
          }))
          
          setEvents(transformedEvents)
          setLoading(false)
        } catch (err) {
          console.error('Error processing events:', err)
          setError('Failed to load events')
          setLoading(false)
        }
      },
      (err) => {
        console.error('Error listening to events:', err)
        setError('Failed to load events')
        setLoading(false)
      }
    )

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [])

  return { events, loading, error }
}
