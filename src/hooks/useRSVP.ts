'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { firestoreHelpers, rsvpsRef } from '@/lib/firestore-helpers'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const useRSVP = (eventId: string) => {
  const { user } = useAuth()
  const [isRSVPd, setIsRSVPd] = useState(false)
  const [attendeeCount, setAttendeeCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is RSVP'd
  useEffect(() => {
    if (!user || !eventId) return

    const checkRSVP = async () => {
      try {
        // Get all RSVPs for this event
        const rsvps = await firestoreHelpers.getAll(rsvpsRef)
        const userRSVP = rsvps.find((rsvp: any) => 
          rsvp.eventId === eventId && rsvp.userId === user.uid
        )
        setIsRSVPd(!!userRSVP)
      } catch (err: any) {
        console.error('Error checking RSVP:', err)
        setError(err.message)
      }
    }

    checkRSVP()
  }, [user, eventId])

  // Listen to real-time attendee count updates
  useEffect(() => {
    if (!eventId) return

    const eventRef = doc(db, 'events', eventId)
    const unsubscribe = onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const eventData = doc.data()
        setAttendeeCount(eventData.attendees?.length || 0)
      }
    })

    return () => unsubscribe()
  }, [eventId])

  const toggleRSVP = async () => {
    if (!user) {
      setError('You must be logged in to RSVP')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const eventRef = doc(db, 'events', eventId)
      
      if (isRSVPd) {
        // Remove RSVP
        await updateDoc(eventRef, {
          attendees: arrayRemove(user.uid)
        })
        
        // Remove RSVP document
        const rsvps = await firestoreHelpers.getAll(rsvpsRef)
        const userRSVP = rsvps.find((rsvp: any) => 
          rsvp.eventId === eventId && rsvp.userId === user.uid
        )
        if (userRSVP) {
          await firestoreHelpers.delete(rsvpsRef, userRSVP.id)
        }
      } else {
        // Add RSVP
        await updateDoc(eventRef, {
          attendees: arrayUnion(user.uid)
        })
        
        // Create RSVP document
        await firestoreHelpers.add(rsvpsRef, {
          eventId,
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          userEmail: user.email,
          rsvpDate: new Date()
        })
      }
      
      setIsRSVPd(!isRSVPd)
    } catch (err: any) {
      console.error('Error toggling RSVP:', err)
      setError(err.message || 'Failed to RSVP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return {
    isRSVPd,
    attendeeCount,
    loading,
    error,
    toggleRSVP
  }
}
