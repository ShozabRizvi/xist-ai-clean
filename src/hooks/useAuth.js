import { useState, useEffect, createContext, useContext } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account',
  // Add popup parameters
  popup: 'true',
  login_hint: '',
});

const useAuthLogic = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalAnalyses: 0,
    threatsStopped: 0,
    communityPoints: 0,
    badges: [],
    streak: 0,
    level: 1,
    reputation: 'Newcomer',
    dailyActivity: [],
    securityScore: 95,
  });

  // Flag to prevent multiple popups
  let popupInProgress = false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserStats(firebaseUser.uid);
      } else {
        setUser(null);
        resetUserStats();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetUserStats = () => {
    setUserStats({
      totalAnalyses: 0,
      threatsStopped: 0,
      communityPoints: 0,
      badges: [],
      streak: 0,
      level: 1,
      reputation: 'Newcomer',
      dailyActivity: [],
      securityScore: 95,
    });
  };

  const loadUserStats = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserStats({
          totalAnalyses: data.totalAnalyses || 0,
          threatsStopped: data.threatsStopped || 0,
          communityPoints: data.communityPoints || 0,
          badges: data.badges || [],
          streak: data.streak || 0,
          level: data.level || 1,
          reputation: data.reputation || 'Newcomer',
          dailyActivity: data.dailyActivity || [],
          securityScore: data.securityScore || 95,
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleUserCreation = async (firebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          totalAnalyses: 0,
          threatsStopped: 0,
          communityPoints: 0,
          badges: [],
          streak: 0,
          level: 1,
          reputation: 'Newcomer',
          dailyActivity: [],
          securityScore: 95,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        });
        toast.success('🎉 Welcome to Xist AI! Your account has been created.');
      } else {
        await updateDoc(userRef, { lastLoginAt: new Date() });
        toast.success('🎉 Welcome back! Your digital protection is active.');
      }
    } catch (error) {
      console.error('Error handling user creation:', error);
      toast.error('Account setup failed. Please try again.');
    }
  };

  const login = async () => {
    if (popupInProgress) {
      console.warn('Popup login already in progress - ignoring duplicate call');
      return;
    }
    popupInProgress = true;
    
    try {
      // Clear existing auth state
      if (auth.currentUser) await signOut(auth);
      
      console.log('🔐 Starting Google sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result?.user) {
        console.log('✅ Sign-in successful:', result.user.email);
        await handleUserCreation(result.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          // User closed popup - don't show error
          break;
        case 'auth/popup-blocked':
          toast.error('🚫 Pop-up blocked. Please allow popups and try again.');
          break;
        case 'auth/cancelled-popup-request':
          // Ignore - another popup was triggered
          break;
        case 'auth/internal-error':
          toast.error('🔧 Authentication service temporarily unavailable.');
          break;
        case 'auth/network-request-failed':
          toast.error('🌐 Network error. Please check your connection.');
          break;
        case 'auth/too-many-requests':
          toast.error('⏰ Too many login attempts. Please try again later.');
          break;
        case 'auth/unauthorized-domain':
          toast.error('🏠 This domain is not authorized for authentication.');
          break;
        default:
          toast.error('❌ Login failed. Please try again.');
      }
    } finally {
      popupInProgress = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('👋 Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('❌ Logout failed.');
    }
  };

  const updateUserStats = async (updates) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { ...updates, updatedAt: new Date() });
      setUserStats((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return { user, userStats, loading, login, logout, updateUserStats };
};

export const AuthProvider = ({ children }) => {
  const authData = useAuthLogic();
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
