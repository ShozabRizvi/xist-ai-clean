import { useState, useEffect } from 'react';
import { getUserAnalyses } from '../utils/dbOperations';

export const useAnalysisHistory = (userId) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!userId) {
        console.log('⏳ No user ID provided, skipping analysis fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 Fetching analysis history for user:', userId);
        const userAnalyses = await getUserAnalyses(userId);
        
        if (userAnalyses && userAnalyses.length > 0) {
          console.log(`✅ Found ${userAnalyses.length} analyses for user`);
          setAnalyses(userAnalyses);
        } else {
          console.log('📝 No analysis data found for user:', userId);
          setAnalyses([]);
        }
      } catch (err) {
        console.error('❌ Error fetching analyses:', err);
        setError(err.message || 'Failed to fetch analysis history');
        setAnalyses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [userId]);

  const addAnalysis = (newAnalysis) => {
    setAnalyses(prev => [newAnalysis, ...prev]);
  };

  const updateAnalysis = (id, updatedData) => {
    setAnalyses(prev => 
      prev.map(analysis => 
        analysis.id === id ? { ...analysis, ...updatedData } : analysis
      )
    );
  };

  const deleteAnalysis = (id) => {
    setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
  };

  return {
    analyses,
    loading,
    error,
    addAnalysis,
    updateAnalysis,
    deleteAnalysis,
    refetch: () => {
      if (userId) {
        setLoading(true);
        getUserAnalyses(userId).then(setAnalyses).finally(() => setLoading(false));
      }
    }
  };
};
