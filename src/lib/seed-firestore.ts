import { firestoreHelpers, eventsRef } from './firestore-helpers'
import { mockEvents } from './mock-data'

export const seedFirestore = async () => {
  console.log('🌱 Seeding Firestore with sample events...')
  
  try {
    // Clear existing events (optional - remove this if you want to keep existing data)
    console.log('📝 Adding sample events to Firestore...')
    
    // Add each mock event to Firestore
    for (const event of mockEvents) {
      await firestoreHelpers.add(eventsRef, {
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        image: event.image,
        host: event.host,
        attendees: event.attendees,
        maxAttendees: event.maxAttendees,
        isFree: event.isFree,
        tags: event.tags,
        requirements: event.requirements,
        hasFood: event.hasFood,
        campus: event.campus
      })
    }
    
    console.log('✅ Successfully seeded Firestore with', mockEvents.length, 'events!')
    return true
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error)
    return false
  }
}
