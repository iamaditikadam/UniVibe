// Script to test real-time chat listener
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, onSnapshot } = require('firebase/firestore');

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

async function testRealtimeChat() {
  try {
    console.log('🔄 Testing real-time chat listener...');
    
    const eventId = 'RbyOHkpzQY3izT1YsXXP' // Community Garden event ID
    console.log('📅 Listening to event ID:', eventId);
    
    const messagesRef = collection(db, 'chatMessages');
    const messagesQuery = query(
      messagesRef,
      where('eventId', '==', eventId)
      // Removed orderBy to avoid index requirement
    );
    
    console.log('👂 Setting up real-time listener...');
    
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        console.log('📨 Real-time update received!');
        console.log('📊 Messages count:', snapshot.docs.length);
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log(`  - ${data.senderName}: ${data.content}`);
        });
      },
      (err) => {
        console.error('❌ Real-time listener error:', err);
        console.error('Error details:', err.message);
        console.error('Error code:', err.code);
      }
    );
    
    console.log('✅ Real-time listener set up successfully!');
    console.log('⏳ Waiting for updates... (Press Ctrl+C to stop)');
    
    // Keep the script running to test real-time updates
    setTimeout(() => {
      console.log('⏰ Test completed after 10 seconds');
      unsubscribe();
      process.exit(0);
    }, 10000);
    
  } catch (error) {
    console.error('❌ Failed to test real-time chat:', error);
    process.exit(1);
  }
}

testRealtimeChat();
