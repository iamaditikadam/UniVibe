'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, Plus, Calendar, User, LogOut } from 'lucide-react'
// UI components removed - using simple HTML elements
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  // Navigation items - always show Explore and Create
  const publicNavItems = [
    { href: '/', label: 'Explore', icon: Search },
    { href: '/create', label: 'Create', icon: Plus },
  ]

  // Navigation items - only show when authenticated
  const privateNavItems = [
    { href: '/my-events', label: 'My Events', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-heading font-bold gradient-text">
              UniVibe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Always show public nav items */}
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Only show private nav items when authenticated */}
            {user && privateNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Welcome, {user.email?.split('@')[0]}
                    </span>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <button className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all duration-300">
                        Login
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button className="px-3 py-2 text-sm bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-300">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Always show public nav items */}
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Only show private nav items when authenticated */}
              {user && privateNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {!loading && (
                  <>
                    {user ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          Welcome, {user.email?.split('@')[0]}
                        </div>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all duration-300"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-4">
                        <Link href="/login" className="flex-1">
                          <button className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all duration-300">
                            Login
                          </button>
                        </Link>
                        <Link href="/signup" className="flex-1">
                          <button className="w-full px-3 py-2 text-sm bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-300">
                            Sign Up
                          </button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
