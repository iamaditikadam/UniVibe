'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { eventsRef, rsvpsRef } from '@/lib/firestore-helpers'
import { Event } from '@/lib/types'
import { onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const useMyEvents = () => {
  const { user, loading: userLoading } = useAuth()
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([])
  const [hostingEvents, setHostingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || userLoading) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Get all events
    const eventsQuery = query(eventsRef, orderBy('createdAt', 'desc'))
    const unsubscribeEvents = onSnapshot(
      eventsQuery,
      (snapshot) => {
        try {
          const allEvents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))

          // Transform Firestore data to match our Event type
          const transformedEvents: Event[] = allEvents.map((doc: any) => ({
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

          const now = new Date()

          // Filter events based on user's relationship
          const attending = transformedEvents.filter(event => 
            event.attendees.includes(user.uid)
          )

          const hosting = transformedEvents.filter(event => 
            event.createdBy === user.uid
          )

          // Past events are those the user attended or hosted that have already occurred
          const past = transformedEvents.filter(event => 
            event.date < now && 
            (event.attendees.includes(user.uid) || event.createdBy === user.uid)
          )

          setAttendingEvents(attending)
          setHostingEvents(hosting)
          setPastEvents(past)
          setLoading(false)
        } catch (err) {
          console.error('Error processing my events:', err)
          setError('Failed to load your events')
          setLoading(false)
        }
      },
      (err) => {
        console.error('Error listening to my events:', err)
        setError('Failed to load your events')
        setLoading(false)
      }
    )

    return () => unsubscribeEvents()
  }, [user, userLoading])

  return {
    attendingEvents,
    hostingEvents,
    pastEvents,
    loading,
    error
  }
}
