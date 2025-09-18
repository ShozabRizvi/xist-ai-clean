import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext();

// Main auth logic hook
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
    securityScore: 95
  });

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
      securityScore: 95
    });
  };

  const loadUserStats = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserStats({
          totalAnalyses: userData.totalAnalyses || 0,
          threatsStopped: userData.threatsStopped || 0,
          communityPoints: userData.communityPoints || 0,
          badges: userData.badges || [],
          streak: userData.streak || 0,
          level: userData.level || 1,
          reputation: userData.reputation || 'Newcomer',
          dailyActivity: userData.dailyActivity || [],
          securityScore: userData.securityScore || 95
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
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
          lastLoginAt: new Date()
        });
      } else {
        await updateDoc(userRef, {
          lastLoginAt: new Date()
        });
      }
      
      toast.success('🎉 Welcome back! Your digital protection is active.');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('❌ Login failed. Please try again.');
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
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      setUserStats(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return {
    user,
    userStats,
    loading,
    login,
    logout,
    updateUserStats
  };
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const auth = useAuthLogic();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
