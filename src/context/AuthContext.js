import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalAnalyses: 0,
    threatsStopped: 0,
    communityPoints: 20,
    securityScore: 95,
    streak: 4
  });

  // ✅ WORKING LOGIN - Creates "Shozab Rizvi" profile like in screenshots
  const login = async (email = 'rshozab64@gmail.com', password = 'demo123') => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        uid: 'shozab-rizvi-' + Date.now(),
        email: email,
        displayName: 'Shozab Rizvi',
        photoURL: `https://ui-avatars.com/api/?name=Shozab+Rizvi&background=8b5cf6&color=fff&size=128`,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      
      // Set exact stats like in your screenshots
      const exactStats = {
        totalAnalyses: 34,
        threatsStopped: 7,
        communityPoints: 20,
        securityScore: 95,
        streak: 4,
        level: 3,
        reputation: 'Active Member',
        joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setUserStats(exactStats);
      localStorage.setItem(`xist-stats-${mockUser.uid}`, JSON.stringify(exactStats));
      localStorage.setItem('xist-user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
      
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setUserStats({ totalAnalyses: 0, threatsStopped: 0, communityPoints: 20, securityScore: 95, streak: 4 });
    localStorage.removeItem('xist-user');
    return { success: true };
  };

  const updateUserStats = (newStats) => {
    const updatedStats = { ...userStats, ...newStats };
    setUserStats(updatedStats);
    if (user) {
      localStorage.setItem(`xist-stats-${user.uid}`, JSON.stringify(updatedStats));
    }
  };

  // Auto-login on app start
  useEffect(() => {
    const checkAuthState = async () => {
      const savedUser = localStorage.getItem('xist-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        const savedStats = localStorage.getItem(`xist-stats-${userData.uid}`);
        if (savedStats) {
          setUserStats(JSON.parse(savedStats));
        }
      }
    };
    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userStats, loading, login, logout, updateUserStats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
