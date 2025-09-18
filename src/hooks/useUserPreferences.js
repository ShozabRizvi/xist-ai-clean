import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import i18n from '../i18n/i18n';

export const useUserPreferences = (userId) => {
  const [preferences, setPreferences] = useState({
    language: 'en',
    fontSize: 'medium',
    theme: 'dark'
  });
  const [loading, setLoading] = useState(true);

  // Load user preferences from Firestore
  useEffect(() => {
    const loadPreferences = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'userPreferences', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPreferences(data);
          
          // Apply language preference
          i18n.changeLanguage(data.language);
          
          // Apply font size preference
          document.documentElement.setAttribute('data-font-size', data.fontSize);
          
          // Apply theme preference
          if (data.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
      
      setLoading(false);
    };

    loadPreferences();
  }, [userId]);

  // Save preferences to Firestore
  const updatePreferences = async (newPreferences) => {
    if (!userId) return;

    try {
      const docRef = doc(db, 'userPreferences', userId);
      await setDoc(docRef, newPreferences, { merge: true });
      
      setPreferences(newPreferences);
      
      // Apply changes immediately
      i18n.changeLanguage(newPreferences.language);
      document.documentElement.setAttribute('data-font-size', newPreferences.fontSize);
      
      if (newPreferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return { success: false, error: error.message };
    }
  };

  return { preferences, updatePreferences, loading };
};
