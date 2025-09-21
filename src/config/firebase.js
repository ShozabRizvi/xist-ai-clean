import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCODoezYbGNyxlh06uWRn0wK_IF7kzokZY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "xistai.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "xistai",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "xistai.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "330145222134",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:330145222134:web:3e9c879483b5fcdfff0bd7",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-TDZNSCH7J0"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if window defined and in production environment
let analytics = null;
if (typeof window !== 'undefined' && process.env.REACT_APP_ENVIRONMENT === 'production') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { analytics };
export default app;
