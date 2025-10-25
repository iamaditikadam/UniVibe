'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, Share2, MessageCircle, Users2, QrCode } from 'lucide-react'
// UI components removed - using simple HTML elements
import { useAuth } from '@/contexts/AuthContext'
import { firestoreHelpers, eventsRef } from '@/lib/firestore-helpers'
import { formatDate, getCategoryEmoji } from '@/lib/utils'
import { Event } from '@/lib/types'
import { useRSVP } from '@/hooks/useRSVP'
import { useChat } from '@/hooks/useChat'
import { useTeammatePosts } from '@/hooks/useTeammatePosts'

export default function EventDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const eventId = params.id as string
  const [activeTab, setActiveTab] = useState('about')
  const [showQR, setShowQR] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Use the new RSVP hook
  const { isRSVPd, attendeeCount, loading: rsvpLoading, error: rsvpError, toggleRSVP } = useRSVP(eventId)
  
  // Use real-time chat and teammate posts
  const { messages: chatMessages, loading: chatLoading, error: chatError, sendMessage } = useChat(eventId)
  const { posts: teammatePosts, loading: postsLoading, error: postsError, createPost } = useTeammatePosts(eventId)
  
  // Debug logging
  console.log('Event Detail Page - Event ID:', eventId)
  console.log('Chat Messages:', chatMessages)
  console.log('Chat Error:', chatError)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const eventData = await firestoreHelpers.get(eventsRef, eventId)
        if (eventData) {
          setEvent(eventData as Event)
        } else {
          setError('Event not found')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            {error || 'Event Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleRSVP = () => {
    toggleRSVP()
    // Add confetti effect here
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(newMessage)
      setNewMessage('')
    }
  }

  const tabs = [
    { id: 'about', label: 'About', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    ...(event.category === 'Hackathon' || event.category === 'Tech' ? 
      [{ id: 'teammates', label: 'Find Teammates', icon: Users2 }] : []
    )
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            <span className="text-8xl">{getCategoryEmoji(event.category)}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => window.history.back()}
            className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
          >
            ← Back
          </button>
        </div>
        
        {/* Event Info */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryEmoji(event.category)} {event.category}
            </span>
            {event.hasFood && (
              <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                🍕 Free Food
              </span>
            )}
            {event.isBeginnerFriendly && (
              <span className="bg-yellow-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✨ Beginner
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {event.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{attendeeCount} attending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* RSVP Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {rsvpError && (
            <div className="text-red-500 text-sm mb-2">
              {rsvpError}
            </div>
          )}
          <button
            onClick={handleRSVP}
            disabled={rsvpLoading}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isRSVPd 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gradient-primary text-white hover:shadow-lg'
            } ${rsvpLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {rsvpLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : isRSVPd ? (
              '✓ RSVP\'d'
            ) : (
              '🎉 RSVP to Event'
            )}
            {rsvpLoading ? 'Processing...' : ''}
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          {user && event.createdBy === user.uid && (
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
          )}
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Check-in QR Code</h3>
              <div className="bg-gray-100 p-8 rounded-xl text-center">
                <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Scan this QR code to check in to the event
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Event Details</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Host</h4>
                    <p className="text-gray-600">{event.host?.name || 'Unknown Host'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Capacity</h4>
                    <p className="text-gray-600">
                      {event.maxAttendees ? `${attendeeCount}/${event.maxAttendees} spots` : 'Unlimited'}
                    </p>
                  </div>
                </div>
                
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Event Chat</h3>
              <p className="text-sm text-gray-600">
                {isRSVPd ? 'Chat with other attendees' : 'RSVP to join the chat'}
              </p>
            </div>
            <div className="p-6">
              {isRSVPd ? (
                <div className="space-y-4">
                  {/* Loading State */}
                  {chatLoading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading chat messages...</p>
                    </div>
                  )}
                  
                  {/* Error State */}
                  {chatError && (
                    <div className="text-center py-4">
                      <p className="text-sm text-red-600">{chatError}</p>
                    </div>
                  )}
                  
                  {/* Messages */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {chatMessages.length === 0 && !chatLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No messages yet. Be the first to start the conversation!</p>
                      </div>
                    ) : (
                      chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            message.senderId === user?.uid
                              ? 'bg-gradient-primary text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.senderName} • {message.createdAt?.toDate ? new Date(message.createdAt.toDate()).toLocaleTimeString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      onClick={handleSendMessage} 
                      disabled={chatLoading || !newMessage.trim()}
                      className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chatLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : null}
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    RSVP to the event to join the chat and connect with other attendees!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'teammates' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Find Teammates</h3>
              <p className="text-sm text-gray-600">
                Connect with other participants to form teams
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {teammatePosts.length > 0 ? (
                  teammatePosts.map(post => (
                    <div key={post.id} className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.skillsNeeded.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {post.members.length} member{post.members.length !== 1 ? 's' : ''}
                        </span>
                        <button className="bg-gradient-primary text-white px-3 py-1 rounded-lg text-sm hover:shadow-lg transition-all duration-300">
                          Join Team
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No teammate posts yet. Be the first to post!
                    </p>
                    <button className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                      Create Team Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
