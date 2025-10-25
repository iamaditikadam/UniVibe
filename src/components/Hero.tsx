'use client'

import React from 'react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-white/5" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6">
            Find Your Vibe
            <br />
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-2">
              on Campus 🎉
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover hackathons, gaming nights, food clubs, and tech workshops 
            — all in one place, with your people.
          </p>
          
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Events This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2.5K</div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">15</div>
              <div className="text-white/80">Campus Partners</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/5 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse-slow"></div>
    </section>
  )
}
