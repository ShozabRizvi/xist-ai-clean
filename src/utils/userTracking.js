// User activity tracking utilities
export const trackUserSession = (userId) => {
  const sessionKey = `xist-sessions-${userId}`;
  const sessions = JSON.parse(localStorage.getItem(sessionKey) || '[]');
  
  const newSession = {
    id: Date.now(),
    startTime: new Date().toISOString(),
    endTime: null,
    activities: [],
    dataUsed: 0
  };
  
  sessions.push(newSession);
  localStorage.setItem(sessionKey, JSON.stringify(sessions.slice(-50))); // Keep last 50 sessions
  
  return newSession.id;
};

export const endUserSession = (userId, sessionId) => {
  const sessionKey = `xist-sessions-${userId}`;
  const sessions = JSON.parse(localStorage.getItem(sessionKey) || '[]');
  
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex !== -1) {
    sessions[sessionIndex].endTime = new Date().toISOString();
    localStorage.setItem(sessionKey, JSON.stringify(sessions));
  }
};

export const trackAnalysis = (userId, analysisData) => {
  const analysisKey = `xist-analysis-${userId}`;
  const analyses = JSON.parse(localStorage.getItem(analysisKey) || '[]');
  
  analyses.push({
    ...analysisData,
    timestamp: new Date().toISOString(),
    dataUsed: estimateDataUsage(analysisData)
  });
  
  localStorage.setItem(analysisKey, JSON.stringify(analyses.slice(-100))); // Keep last 100
};

const estimateDataUsage = (analysisData) => {
  // Estimate data usage based on content length and analysis complexity
  const contentLength = analysisData.inputContent?.length || 0;
  const baseUsage = Math.max(0.01, contentLength / 10000); // MB
  const aiUsage = analysisData.realAIAnalysis?.aiGenerated ? 0.05 : 0.01;
  return baseUsage + aiUsage;
};
