'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, Plus, Gamepad2, Wrench, TestTube } from 'lucide-react'
// UI components removed - using simple HTML elements
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useMyEvents } from '@/hooks/useMyEvents'
import { formatDate, getCategoryEmoji } from '@/lib/utils'

export default function MyEventsPage() {
  const { attendingEvents, hostingEvents, pastEvents, loading, error } = useMyEvents()
  const [activeTab, setActiveTab] = useState('attending')

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gaming':
        return <Gamepad2 className="w-5 h-5" />
      case 'tech':
        return <Wrench className="w-5 h-5" />
      case 'hackathon':
        return <TestTube className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const renderEventCard = (event: any) => (
    <Link key={event.id} href={`/events/${event.id}`}>
      <div className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
              <div className="text-6xl">{getCategoryEmoji(event.category)}</div>
            </div>
          )}
          <div className="absolute bottom-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              {event.attendees?.length || 0}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            by {event.host?.name || 'Unknown Host'}
          </p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="bg-gradient-primary text-white flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryIcon(event.category)}
              <span>{event.category}</span>
            </span>
            {activeTab === 'attending' && (
              <button className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300">
                ✓ Attending
              </button>
            )}
            {activeTab === 'hosting' && (
              <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300">
                Hosting
              </button>
            )}
            {activeTab === 'past' && (
              <button className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Past
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
              My Events
            </h1>
            <p className="text-gray-600">
              Manage your events and track your participation.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('attending')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'attending'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Attending ({attendingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('hosting')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'hosting'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hosting ({hostingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your events...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                Failed to load events
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="space-y-6">
              {activeTab === 'attending' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Events You're Attending
                  </h2>
                  {attendingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {attendingEvents.map(renderEventCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No events yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start exploring and RSVP to events you're interested in!
                      </p>
                      <Link href="/">
                        <button className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                          Explore Events
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'hosting' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Events You're Hosting
                  </h2>
                  {hostingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hostingEvents.map(renderEventCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No events yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start creating events to build your community!
                      </p>
                      <Link href="/create">
                        <button className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Event
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'past' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Past Events
                  </h2>
                  {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map(renderEventCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No past events
                      </h3>
                      <p className="text-gray-600">
                        Your past event history will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}