'use client'

import { useState } from 'react'
import { testFirebase, testAuth } from '@/lib/firebase-test'
import { seedFirestore } from '@/lib/seed-firestore'
// UI components removed - using simple HTML elements

export default function TestFirebasePage() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runFirebaseTest = async () => {
    setIsLoading(true)
    setResults([])
    
    addResult('Starting Firebase tests...')
    
    try {
      const success = await testFirebase()
      if (success) {
        addResult('✅ Firebase connection successful!')
      } else {
        addResult('❌ Firebase connection failed!')
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`)
    }
    
    setIsLoading(false)
  }

  const runAuthTest = async () => {
    setIsLoading(true)
    addResult('Testing authentication...')
    
    try {
      // Test with dummy credentials (will fail but that's expected)
      await testAuth('test@example.com', 'password123')
      addResult('✅ Authentication system working!')
    } catch (error) {
      addResult(`❌ Auth error: ${error}`)
    }
    
    setIsLoading(false)
  }

  const runSeedTest = async () => {
    setIsLoading(true)
    addResult('Seeding Firestore with sample events...')
    
    try {
      const success = await seedFirestore()
      if (success) {
        addResult('✅ Firestore seeded successfully!')
        addResult('🎉 You can now see real events on your home page!')
      } else {
        addResult('❌ Failed to seed Firestore')
      }
    } catch (error) {
      addResult(`❌ Seed error: ${error}`)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Firebase Test Dashboard
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
            <p className="text-gray-600 mb-4">
              Test if Firebase is properly connected and Firestore is accessible.
            </p>
            <button 
              onClick={runFirebaseTest} 
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Firebase Connection'}
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
            <p className="text-gray-600 mb-4">
              Test if Firebase Auth is working (will show expected failure).
            </p>
            <button 
              onClick={runAuthTest} 
              disabled={isLoading}
              className="w-full px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Authentication'}
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Seed Database</h2>
            <p className="text-gray-600 mb-4">
              Add sample events to Firestore so you can see real data.
            </p>
            <button 
              onClick={runSeedTest} 
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Seeding...' : 'Seed Firestore'}
            </button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click a test button above.</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
