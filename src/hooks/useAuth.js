import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account'
});

const useAuthLogic = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false); 
  
  const [operatorIdentity, setOperatorIdentity] = useState({ alias: 'Unknown Node', avatar: 'ghost' });
  
  const [userStats, setUserStats] = useState({
    totalAnalyses: 0, threatsStopped: 0, communityPoints: 0,
    badges: [], streak: 0, level: 1, reputation: 'Newcomer',
    dailyActivity: [], securityScore: 95,
  });

  // ✅ 1. THE REDIRECT CATCHER (Extreme Debug Mode)
  useEffect(() => {
    console.log('🕵️ [DEBUG 1] Redirect useEffect MOUNTED. (If you see this twice instantly, React StrictMode is killing your token)');

    const handleRedirectResult = async () => {
      console.log('🕵️ [DEBUG 2] Firing getRedirectResult(auth)...');
      try {
        const result = await getRedirectResult(auth);
        
        console.log('🕵️ [DEBUG 3] RAW RESULT FROM FIREBASE:', result);

        if (result?.user) {
          console.log('✅ [DEBUG 4] SUCCESS! User found:', result.user.email);
          await handleUserCreation(result.user);
        } else {
          console.warn('⚠️ [DEBUG 5] Result is NULL. Firebase forgot the redirect happened.');
        }
      } catch (error) {
        console.error('❌ [DEBUG 6] ERROR CAUGHT in getRedirectResult:', error.code, error.message);
        toast.error(`Auth Error: ${error.code}`);
      }
    };

    handleRedirectResult();

    return () => console.log('🗑️ [DEBUG 7] Redirect useEffect UNMOUNTED.');
  }, []);

  // ✅ 2. MONITOR AUTH STATE (Extreme Debug Mode)
  useEffect(() => {
    console.log('🕵️ [DEBUG A] Auth State Listener Initialized.');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🕵️ [DEBUG B] Auth State Changed. Current User:', firebaseUser ? firebaseUser.email : 'NULL');
      
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserStats(firebaseUser.uid, firebaseUser.displayName);
      } else {
        setUser(null);
        resetUserStats();
      }
      setLoading(false);
      setIsRedirecting(false);
    });
    
    return () => {
      console.log('🗑️ [DEBUG C] Auth State Listener UNMOUNTED.');
      unsubscribe();
    };
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

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid, email: firebaseUser.email,
          name: firebaseUser.displayName, 
          alias: firebaseUser.displayName, 
          avatar: 'ghost',
          photoURL: firebaseUser.photoURL,
          totalAnalyses: 0, threatsStopped: 0, communityPoints: 0,
          badges: [], streak: 0, level: 1, reputation: 'Newcomer',
          dailyActivity: [], securityScore: 95,
          createdAt: new Date(), lastLoginAt: new Date(),
        });
        setOperatorIdentity({ alias: firebaseUser.displayName, avatar: 'ghost' });
        toast.success('🎉 Node Activated!');
      } else {
        await updateDoc(userRef, { lastLoginAt: new Date() });
      }
    } catch (error) {
      console.error('User sync failed:', error);
    }
  };

  // ✅ THE PURE REDIRECT LOGIN FUNCTION
  const login = async () => {
    setIsRedirecting(true);
    try {
      // Clear any ghost sessions
      if (auth.currentUser) await signOut(auth);
      
      console.log('🌍 Initiating Pure Secure Redirect Handshake...');
      // 100% Redirect. No popups. No fallbacks.
      await signInWithRedirect(auth, googleProvider);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('❌ Redirect Protocol Failed.');
      setIsRedirecting(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('👋 Node Disconnected.');
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