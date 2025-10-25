'use client'

import React, { useState } from 'react'
import { Search, Filter, MapPin, Calendar } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { EventCard } from '@/components/EventCard'
// UI components removed - using simple HTML elements
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/contexts/AuthContext'
import { Event } from '@/lib/types'

const categories = [
  { id: 'all', label: 'All', emoji: '🎉' },
  { id: 'Hackathon', label: 'Hackathon', emoji: '🧪' },
  { id: 'Tech', label: 'Tech', emoji: '🛠' },
  { id: 'Gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'Food', label: 'Food', emoji: '🍜' },
  { id: 'Sports', label: 'Sports', emoji: '⚽' },
  { id: 'Cultural', label: 'Cultural', emoji: '🎭' },
  { id: 'Career', label: 'Career', emoji: '💼' },
  { id: 'Wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'Volunteering', label: 'Volunteering', emoji: '🤝' },
  { id: 'Clubs', label: 'Clubs', emoji: '👥' },
]

const campuses = [
  'All Campuses',
  'RMIT University',
  'University of Melbourne',
  'Monash University',
  'Swinburne University',
]

export default function HomePage() {
  const { events, loading, error } = useEvents()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('All Campuses')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [specialFilters, setSpecialFilters] = useState({
    freeFood: false,
    beginnerFriendly: false,
    happeningToday: false
  })

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const matchesCampus = selectedCampus === 'All Campuses' || event.campus === selectedCampus
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Date range filtering
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
    const matchesDateRange = 
      (!dateRange.start || eventDate >= new Date(dateRange.start)) &&
      (!dateRange.end || eventDate <= new Date(dateRange.end))
    
    // Special filters
    const matchesFreeFood = !specialFilters.freeFood || event.hasFood
    const matchesBeginnerFriendly = !specialFilters.beginnerFriendly || event.tags.includes('Beginner') || event.tags.includes('Beginner-Friendly')
    const matchesHappeningToday = !specialFilters.happeningToday || 
      eventDate.toDateString() === new Date().toDateString()
    
    return matchesCategory && matchesCampus && matchesSearch && matchesDateRange && 
           matchesFreeFood && matchesBeginnerFriendly && matchesHappeningToday
  }).sort((a, b) => {
    // First priority: User's attending events
    if (user) {
      const userAttendingA = a.attendees?.includes(user.uid) || false
      const userAttendingB = b.attendees?.includes(user.uid) || false
      
      if (userAttendingA && !userAttendingB) return -1
      if (!userAttendingA && userAttendingB) return 1
    }
    
    // Second priority: Sort by date - upcoming events first
    const dateA = a.date instanceof Date ? a.date : new Date(a.date)
    const dateB = b.date instanceof Date ? b.date : new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  // Separate attending events from other events
  const attendingEvents = user ? filteredEvents.filter(event => event.attendees?.includes(user.uid)) : []
  const otherEvents = user ? filteredEvents.filter(event => !event.attendees?.includes(user.uid)) : filteredEvents

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />
      
      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search events, tags, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campus Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {campuses.map(campus => (
                    <option key={campus} value={campus}>{campus}</option>
                  ))}
                </select>
              </div>
              
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <input 
                    type="date" 
                    className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Special Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span 
            className={`cursor-pointer hover:scale-105 transition-transform px-3 py-1 rounded-full text-sm font-medium ${
              specialFilters.freeFood ? 'bg-primary-500 text-white' : 'bg-green-100 text-green-800'
            }`}
            onClick={() => setSpecialFilters(prev => ({ ...prev, freeFood: !prev.freeFood }))}
          >
            🍕 Free Food
          </span>
          <span 
            className={`cursor-pointer hover:scale-105 transition-transform px-3 py-1 rounded-full text-sm font-medium ${
              specialFilters.beginnerFriendly ? 'bg-primary-500 text-white' : 'bg-yellow-100 text-yellow-800'
            }`}
            onClick={() => setSpecialFilters(prev => ({ ...prev, beginnerFriendly: !prev.beginnerFriendly }))}
          >
            ✨ Beginner-Friendly
          </span>
          <span 
            className={`cursor-pointer hover:scale-105 transition-transform px-3 py-1 rounded-full text-sm font-medium ${
              specialFilters.happeningToday ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setSpecialFilters(prev => ({ ...prev, happeningToday: !prev.happeningToday }))}
          >
            🎯 Happening Today
          </span>
        </div>

        {/* Your Attending Events Section */}
        {user && attendingEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-heading font-bold text-gray-900">
                Your Attending Events
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Sorted by date</span>
              </div>
            </div>
            
            {/* Attending Events Count */}
            <p className="text-lg text-gray-600 mb-6">
              {attendingEvents.length} {attendingEvents.length === 1 ? 'Event' : 'Events'} You're Attending
            </p>

            {/* Attending Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {attendingEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Events Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900">
              {user && attendingEvents.length > 0 ? 'Discover More Events' : 'Coming Up Events'}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Sorted by date</span>
            </div>
          </div>
          
          {/* Event Count */}
          <p className="text-lg text-gray-600 mb-6">
            {otherEvents.length} {otherEvents.length === 1 ? 'Event' : 'Events'} Found
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events from Firestore...</p>
          </div>
        ) : error ? (
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
        ) : otherEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all')
                setSelectedCampus('All Campuses')
                setSearchQuery('')
              }}
              className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
