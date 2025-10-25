// Script to check the actual dates stored in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkDates() {
  try {
    console.log('🔍 Checking event dates in Firestore...');
    console.log('Current date:', new Date());
    console.log('Current date string:', new Date().toDateString());
    console.log('---');
    
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const eventDate = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      const now = new Date();
      const isUpcoming = eventDate > now;
      
      console.log(`Event: ${data.title}`);
      console.log(`  Stored date: ${data.date}`);
      console.log(`  Parsed date: ${eventDate}`);
      console.log(`  Current date: ${now}`);
      console.log(`  Is upcoming: ${isUpcoming}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking dates:', error);
    process.exit(1);
  }
}

checkDates();
