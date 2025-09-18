import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Helper function to sanitize data for Firebase
const sanitizeForFirebase = (obj) => {
  if (obj === null || obj === undefined) return null;
  
  if (Array.isArray(obj)) {
    // Convert nested arrays to objects with indices
    return obj.map((item, index) => ({
      index,
      data: sanitizeForFirebase(item)
    }));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip undefined values and functions
      if (value !== undefined && typeof value !== 'function') {
        sanitized[key] = sanitizeForFirebase(value);
      }
    }
    return sanitized;
  }
  
  return obj;
};

// Save analysis with proper Firebase format
export const saveAnalysis = async (userId, analysisData) => {
  try {
    console.log('💾 Saving analysis to Firebase...');
    
    // Sanitize the analysis data
    const sanitizedData = {
      userId,
      content: analysisData.content || '',
      riskScore: Number(analysisData.riskScore) || 0,
      credibilityScore: Number(analysisData.credibilityScore) || 0,
      threatLevel: analysisData.threatLevel || 'LOW',
      analysis: analysisData.analysis || '',
      timestamp: analysisData.timestamp || new Date().toISOString(),
      processingTime: Number(analysisData.processingTime) || Date.now(),
      inputMethod: analysisData.inputMethod || 'text',
      
      // Handle claims safely
      claims: Array.isArray(analysisData.claims) ? 
        analysisData.claims.map((claim, index) => ({
          index,
          claim: claim.claim || claim.text || String(claim),
          confidence: Number(claim.confidence) || 0,
          category: claim.category || 'general'
        })) : [],
      
      // Handle fact check results safely  
      factCheckResults: Array.isArray(analysisData.factCheckResults) ?
        analysisData.factCheckResults.map((result, index) => ({
          index,
          summary: result.summary || '',
          rating: result.rating || 'unknown',
          source: result.source || 'system',
          url: result.url || ''
        })) : [],
      
      // Handle recommendations safely
      recommendations: Array.isArray(analysisData.recommendations) ?
        analysisData.recommendations.map((rec, index) => ({
          index,
          text: String(rec)
        })) : [],
      
      // Handle detailed metrics
      detailedMetrics: {
        sourceCredibility: Number(analysisData.detailedMetrics?.sourceCredibility) || 50,
        factCheckConsensus: Number(analysisData.detailedMetrics?.factCheckConsensus) || 60,
        claimsVerification: Number(analysisData.detailedMetrics?.claimsVerification) || 70,
        newsCorroboration: Number(analysisData.detailedMetrics?.newsCorroboration) || 60
      },
      
      // Add metadata
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'analyses'), sanitizedData);
    
    console.log('✅ Analysis saved successfully with ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Error saving analysis:', error);
    
    // Fallback: save to localStorage
    try {
      const localAnalyses = JSON.parse(localStorage.getItem('xist-analyses') || '[]');
      const localAnalysis = {
        id: Date.now().toString(),
        ...analysisData,
        createdAt: new Date().toISOString()
      };
      localAnalyses.unshift(localAnalysis);
      localStorage.setItem('xist-analyses', JSON.stringify(localAnalyses.slice(0, 50)));
      console.log('💾 Analysis saved to localStorage as fallback');
      return localAnalysis.id;
    } catch (localError) {
      console.error('❌ LocalStorage fallback also failed:', localError);
      throw new Error('Failed to save analysis');
    }
  }
};

// Get user analyses
export const getUserAnalyses = async (userId, limitCount = 20) => {
  try {
    console.log('📊 Loading user analyses...');
    
    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const analyses = [];
    
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Loaded ${analyses.length} analyses from Firebase`);
    return analyses;
    
  } catch (error) {
    console.error('❌ Error loading analyses from Firebase:', error);
    
    // Fallback: load from localStorage
    try {
      const localAnalyses = JSON.parse(localStorage.getItem('xist-analyses') || '[]');
      console.log(`💾 Loaded ${localAnalyses.length} analyses from localStorage`);
      return localAnalyses.slice(0, limitCount);
    } catch (localError) {
      console.error('❌ LocalStorage fallback failed:', localError);
      return [];
    }
  }
};

// Save user stats
export const saveUserStats = async (userId, stats) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    await setDoc(userStatsRef, {
      ...stats,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('✅ User stats saved successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving user stats:', error);
    return false;
  }
};

// Get user stats
export const getUserStats = async (userId) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const docSnap = await getDoc(userStatsRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default stats
      const defaultStats = {
        totalAnalyses: 0,
        threatsStopped: 0,
        points: 0,
        level: 1,
        badges: [],
        streak: 0,
        communityPoints: 0,
        createdAt: new Date().toISOString()
      };
      
      // Save default stats
      await setDoc(userStatsRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    return {
      totalAnalyses: 0,
      threatsStopped: 0,
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
      communityPoints: 0
    };
  }
};
