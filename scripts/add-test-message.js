// Script to add a test message to a specific event
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

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

async function addTestMessage() {
  try {
    console.log('💬 Adding test message to Community Garden Volunteering event...');
    
    // Use the event ID from the test output (this should be the Community Garden event)
    const eventId = 'RbyOHkpzQY3izT1YsXXP' // This should be the Community Garden event ID
    
    const messagesRef = collection(db, 'chatMessages');
    const testMessage = {
      eventId: eventId,
      senderId: 'test-user-456',
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      content: 'Hello! This is a test message for the Community Garden event.',
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(messagesRef, testMessage);
    console.log('✅ Test message added successfully with ID:', docRef.id);
    console.log('🎯 Event ID used:', eventId);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add test message:', error);
    process.exit(1);
  }
}

addTestMessage();
