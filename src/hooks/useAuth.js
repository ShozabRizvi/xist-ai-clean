import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithPopup, // 🛡️ SWITCHED TO POPUP
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';
import { 
  UserPlusIcon, 
  ArrowRightEndOnRectangleIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account'
});

const useAuthLogic = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Kept this variable name so your UI loading spinners don't break
  const [isRedirecting, setIsRedirecting] = useState(false); 
  
  const [operatorIdentity, setOperatorIdentity] = useState({ alias: 'Unknown Node', avatar: 'ghost' });
  
  const [userStats, setUserStats] = useState({
    totalAnalyses: 0, threatsStopped: 0, communityPoints: 0,
    badges: [], streak: 0, level: 1, reputation: 'Newcomer',
    dailyActivity: [], securityScore: 95,
  });

  // ✅ 1. MONITOR AUTH STATE (Cleaned up)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserStats(firebaseUser.uid, firebaseUser.displayName);
      } else {
        setUser(null);
        resetUserStats();
      }
      setLoading(false);
      setIsRedirecting(false); // Reset UI state just in case
    });
    
    return () => unsubscribe();
  }, []);

  const resetUserStats = () => {
    setUserStats({ 
      totalAnalyses: 0, threatsStopped: 0, communityPoints: 0, 
      badges: [], streak: 0, level: 1, reputation: 'Newcomer', 
      dailyActivity: [], securityScore: 95 
    });
    setOperatorIdentity({ alias: 'Unknown Node', avatar: 'ghost' });
  };

  const loadUserStats = async (userId, fallbackName) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setOperatorIdentity({
          alias: data.alias || fallbackName || 'Unknown Node',
          avatar: data.avatar || 'ghost'
        });
        
        setUserStats({
          totalAnalyses: data.totalAnalyses || 0,
          threatsStopped: data.threatsStopped || 0,
          communityPoints: data.communityPoints || 0,
          badges: data.badges || [], streak: data.streak || 0,
          level: data.level || 1, reputation: data.reputation || 'Newcomer',
          dailyActivity: data.dailyActivity || [], securityScore: data.securityScore || 95,
        });
      }
    } catch (error) {
      console.error('Stats load failed:', error);
    }
  };

  const handleUserCreation = async (firebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      // 🚀 NEW LOGIC: Check if document exists to differentiate status
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid, 
          email: firebaseUser.email,
          name: firebaseUser.displayName, 
          alias: firebaseUser.displayName, 
          avatar: 'ghost',
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
        setOperatorIdentity({ alias: firebaseUser.displayName, avatar: 'ghost' });
        
        toast.dismiss(); 
        toast.success('New Account Created', {
          icon: <UserPlusIcon className="w-5 h-5 text-emerald-500" />,
        });
      } else {
        await updateDoc(userRef, { lastLoginAt: new Date() });
        
        // 🚀 DISMISS OLD & SHOW NEW
        toast.dismiss();
        toast.success('Welcome Back', {
          icon: <ShieldCheckIcon className="w-5 h-5 text-indigo-500" />,
        });
      }
    } catch (error) {
      console.error('User sync failed:', error);
      toast.error('❌ Sync failed.', {
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />,
      });
    }
  };

  const login = async () => {
    setIsRedirecting(true);
    try {
      if (auth.currentUser) await signOut(auth);
      
      console.log('🌍 Initiating Secure Popup Handshake...');
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result?.user) {
        // handleUserCreation now handles the specific toast messages internally
        await handleUserCreation(result.user);
      }
      
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(`❌ Auth Failed: ${error.code}`);
      }
    } finally {
      setIsRedirecting(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('👋 Node Disconnected.', {
        icon: <ArrowRightEndOnRectangleIcon className="w-5 h-5 text-slate-500" />,
      });
    } catch (error) {
      toast.error('❌ Disconnect failed.');
    }
  };

  return { user, userStats, operatorIdentity, loading, isRedirecting, login, logout };
};

export const AuthProvider = ({ children }) => {
  const authData = useAuthLogic();
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);