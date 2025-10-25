// Script to test chat functionality
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs } = require('firebase/firestore');

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

async function testChat() {
  try {
    console.log('🧪 Testing chat functionality...');
    
    // Get the first event ID
    const eventsRef = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsRef);
    
    if (eventsSnapshot.empty) {
      console.log('❌ No events found. Please seed events first.');
      return;
    }
    
    const firstEvent = eventsSnapshot.docs[0];
    const eventId = firstEvent.id;
    console.log('📅 Using event:', firstEvent.data().title, 'ID:', eventId);
    
    // Test writing a chat message
    const messagesRef = collection(db, 'chatMessages');
    const testMessage = {
      eventId: eventId,
      senderId: 'test-user-123',
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      content: 'Hello from test script!',
      createdAt: serverTimestamp()
    };
    
    console.log('💬 Writing test message...');
    const docRef = await addDoc(messagesRef, testMessage);
    console.log('✅ Message written successfully with ID:', docRef.id);
    
    // Test reading chat messages
    console.log('📖 Reading chat messages...');
    const messagesSnapshot = await getDocs(messagesRef);
    console.log('📊 Found', messagesSnapshot.docs.length, 'messages');
    
    messagesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.senderName}: ${data.content} (${data.eventId})`);
    });
    
    console.log('🎉 Chat test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Chat test failed:', error);
    process.exit(1);
  }
}

testChat();
