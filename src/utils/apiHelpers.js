// apiHelpers.js
export const checkAPIStatus = async () => {
  try {
    // Mock API health check
    return {
      status: 'healthy',
      responseTime: 150,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: 0,
      timestamp: new Date().toISOString()
    };
  }
};
