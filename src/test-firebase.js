import { auth, db } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Test Firebase connection
export const testFirebase = () => {
  console.log('🔥 Testing Firebase connection...');
  
  // Test Auth
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ Firebase Auth working! User:', user.email);
    } else {
      console.log('✅ Firebase Auth working! No user logged in.');
    }
  });

  // Test Firestore
  const testDoc = async () => {
    try {
      await setDoc(doc(db, 'test', 'connection'), {
        message: 'Firebase connection successful!',
        timestamp: new Date()
      });
      console.log('✅ Firebase Firestore working!');
    } catch (error) {
      console.error('❌ Firestore error:', error);
    }
  };

  testDoc();
  return unsubscribe;
};
