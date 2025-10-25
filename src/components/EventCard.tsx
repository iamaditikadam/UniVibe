'use client'

import React, { useState } from 'react'
// import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
// UI components removed - using simple HTML elements
import { Event } from '@/lib/types'
import { formatDate, getCategoryEmoji } from '@/lib/utils'
import { useRSVP } from '@/hooks/useRSVP'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { isRSVPd, attendeeCount, loading, error, toggleRSVP } = useRSVP(event.id)

  const handleRSVP = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleRSVP()
  }

  const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
  const now = new Date()
  const isUpcoming = eventDate > now
  const isToday = eventDate.toDateString() === now.toDateString()

  return (
    <Link href={`/events/${event.id}`}>
      <div 
        className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <span className="text-6xl">{getCategoryEmoji(event.category)}</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryEmoji(event.category)} {event.category}
            </span>
          </div>
          
          {/* Special Tags */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {event.hasFood && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                🍕 Free Food
              </span>
            )}
          </div>
          
          {/* Attendee Count */}
          <div className="absolute bottom-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              {attendeeCount}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          {/* Host */}
          <p className="text-sm text-gray-600 mb-3">
            by {event.host?.name || 'Unknown Host'}
          </p>
          
          {/* Date & Time */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {isToday ? 'Today' : formatDate(eventDate)}
            </span>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">
              {error}
            </div>
          )}

          {/* RSVP Button */}
          <button
            onClick={handleRSVP}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              isRSVPd 
                ? 'bg-gradient-accent hover:shadow-lg text-white' 
                : 'bg-gradient-primary hover:shadow-lg text-white'
            } ${(!isUpcoming || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isUpcoming || loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : !isUpcoming ? (
              <Clock className="w-4 h-4 mr-2" />
            ) : isRSVPd ? (
              '✓ RSVP\'d'
            ) : (
              '🎉 RSVP'
            )}
            {loading ? 'Processing...' : !isUpcoming ? 'Event Ended' : isRSVPd ? '' : ''}
          </button>
        </div>
      </div>
    </Link>
  )
}
