// Script to clear all events and re-seed with future dates
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO_LQ-imliC6e2u7S-stW0a2PLPedWsiY",
  authDomain: "univibe-3dae0.firebaseapp.com",
  projectId: "univibe-3dae0",
  storageBucket: "univibe-3dae0.firebasestorage.app",
  messagingSenderId: "1091723662611",
  appId: "1:1091723662611:web:444cd8cbd870aad357f6e6",
  measurementId: "G-FFELSLJQSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleEvents = [
  {
    title: '🎮 Valorant Tournament Finals',
    description: 'Join us for the ultimate Valorant tournament! $500 prize pool, free pizza, and epic gaming action. All skill levels welcome - from beginners to pros!',
    category: 'Gaming',
    date: new Date('2024-12-15T18:00:00'),
    time: '6:00 PM',
    endDate: new Date('2024-12-15T22:00:00'),
    endTime: '10:00 PM',
    campus: 'RMIT University',
    location: 'Building 80, Level 3, Computer Lab',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    host: {
      id: 'club-1',
      name: 'RMIT Gaming Society',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      university: 'RMIT University'
    },
    attendees: [],
    maxAttendees: 50,
    isFree: true,
    tags: ['Gaming', 'Tournament', 'Pizza', 'Competitive'],
    requirements: ['Bring your own laptop', 'Discord account'],
    hasFood: true,
    createdBy: 'club-1',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '🍜 Dumpling Making Workshop',
    description: 'Learn to make authentic Chinese dumplings from scratch! All ingredients provided. Vegetarian options available. Perfect for food lovers!',
    category: 'Food',
    date: new Date('2024-12-18T14:00:00'),
    time: '2:00 PM',
    endDate: new Date('2024-12-18T17:00:00'),
    endTime: '5:00 PM',
    campus: 'University of Melbourne',
    location: 'Student Union Kitchen, Ground Floor',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    host: {
      id: 'user-2',
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      university: 'University of Melbourne'
    },
    attendees: [],
    maxAttendees: 20,
    isFree: true,
    tags: ['Cooking', 'Cultural', 'Workshop', 'Food'],
    requirements: ['Apron provided', 'Hair tie recommended'],
    hasFood: true,
    createdBy: 'user-2',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '🛠 React Native Workshop: Build Your First App',
    description: 'Hands-on workshop to build a mobile app with React Native. Laptops provided. Perfect for beginners! Learn from industry experts.',
    category: 'Tech',
    date: new Date('2024-12-20T10:00:00'),
    time: '10:00 AM',
    endDate: new Date('2024-12-20T16:00:00'),
    endTime: '4:00 PM',
    campus: 'RMIT University',
    location: 'Building 14, Level 2, Lab 14.2.1',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    host: {
      id: 'club-2',
      name: 'RMIT Tech Society',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      university: 'RMIT University'
    },
    attendees: [],
    maxAttendees: 30,
    isFree: true,
    tags: ['Programming', 'Mobile', 'Workshop', 'React'],
    requirements: ['Basic JavaScript knowledge', 'Laptop (provided)'],
    hasFood: false,
    createdBy: 'club-2',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '🧪 48-Hour Climate Hackathon',
    description: 'Build innovative solutions for climate change. $5000 in prizes! Free meals, snacks, and swag. Form teams of 2-4. All skill levels welcome!',
    category: 'Hackathon',
    date: new Date('2024-12-25T09:00:00'),
    time: '9:00 AM',
    endDate: new Date('2024-12-27T17:00:00'),
    endTime: '5:00 PM',
    campus: 'Monash University',
    location: 'Clayton Campus, Building 10, Innovation Hub',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    host: {
      id: 'external-1',
      name: 'ClimateTech Melbourne',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      university: 'Monash University'
    },
    attendees: [],
    maxAttendees: 100,
    isFree: true,
    tags: ['Hackathon', 'Climate', 'Prize', 'Innovation'],
    requirements: ['Laptop', 'Team of 2-4', 'Innovation mindset'],
    hasFood: true,
    createdBy: 'external-1',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '🏃‍♀️ Campus Fun Run & Wellness Fair',
    description: '5K fun run around campus followed by wellness activities. Free t-shirt and healthy snacks! Perfect for fitness enthusiasts.',
    category: 'Wellness',
    date: new Date('2024-12-22T08:00:00'),
    time: '8:00 AM',
    endDate: new Date('2024-12-22T12:00:00'),
    endTime: '12:00 PM',
    campus: 'Swinburne University',
    location: 'Main Campus, Starting at Student Union',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    host: {
      id: 'club-3',
      name: 'Swinburne Wellness Club',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      university: 'Swinburne University'
    },
    attendees: [],
    maxAttendees: 200,
    isFree: true,
    tags: ['Fitness', 'Wellness', 'Community', 'Health'],
    requirements: ['Comfortable running shoes', 'Water bottle'],
    hasFood: true,
    createdBy: 'club-3',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '🎭 Cultural Dance Workshop',
    description: 'Learn traditional dances from around the world! Bollywood, Salsa, and Contemporary styles. No experience needed - just bring your enthusiasm!',
    category: 'Cultural',
    date: new Date('2024-12-28T19:00:00'),
    time: '7:00 PM',
    endDate: new Date('2024-12-28T21:00:00'),
    endTime: '9:00 PM',
    campus: 'University of Melbourne',
    location: 'Student Union Dance Studio',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=400&fit=crop',
    host: {
      id: 'user-3',
      name: 'Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      university: 'University of Melbourne'
    },
    attendees: [],
    maxAttendees: 25,
    isFree: true,
    tags: ['Dance', 'Cultural', 'Fitness', 'Art'],
    requirements: ['Comfortable clothes', 'Water bottle'],
    hasFood: false,
    createdBy: 'user-3',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '💼 Tech Career Fair & Networking',
    description: 'Connect with top tech companies! Resume reviews, mock interviews, and networking opportunities. Free professional headshots included!',
    category: 'Career',
    date: new Date('2024-12-30T10:00:00'),
    time: '10:00 AM',
    endDate: new Date('2024-12-30T16:00:00'),
    endTime: '4:00 PM',
    campus: 'RMIT University',
    location: 'Building 80, Level 1, Exhibition Hall',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',
    host: {
      id: 'career-1',
      name: 'RMIT Career Services',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      university: 'RMIT University'
    },
    attendees: [],
    maxAttendees: 150,
    isFree: true,
    tags: ['Career', 'Networking', 'Tech', 'Professional'],
    requirements: ['Resume', 'Business cards', 'Professional attire'],
    hasFood: true,
    createdBy: 'career-1',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: '🤝 Community Garden Volunteering',
    description: 'Help maintain our campus community garden! Learn about sustainable gardening, meet like-minded people, and contribute to campus sustainability.',
    category: 'Volunteering',
    date: new Date('2025-01-03T09:00:00'),
    time: '9:00 AM',
    endDate: new Date('2025-01-03T12:00:00'),
    endTime: '12:00 PM',
    campus: 'Monash University',
    location: 'Campus Community Garden, Behind Building 5',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    host: {
      id: 'volunteer-1',
      name: 'Green Campus Initiative',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      university: 'Monash University'
    },
    attendees: [],
    maxAttendees: 30,
    isFree: true,
    tags: ['Volunteering', 'Sustainability', 'Community', 'Environment'],
    requirements: ['Work clothes', 'Gloves (provided)', 'Positive attitude'],
    hasFood: true,
    createdBy: 'volunteer-1',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function clearAndSeedEvents() {
  try {
    console.log('🧹 Clearing existing events...');
    
    // Get all existing events
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    // Delete all existing events
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'events', docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${snapshot.docs.length} existing events`);
    
    console.log('🌱 Seeding new events with future dates...');
    
    // Add new events
    for (const event of sampleEvents) {
      await addDoc(eventsRef, event);
      console.log(`✅ Added event: ${event.title}`);
    }
    
    console.log('🎉 Successfully cleared and re-seeded all events!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing and seeding events:', error);
    process.exit(1);
  }
}

clearAndSeedEvents();
