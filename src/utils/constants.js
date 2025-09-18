// constants.js
export const API_ENDPOINTS = {
  // Core Analysis
  ANALYZE: '/api/analyze',
  BATCH: '/api/batch-analyze',
  
  // Specialized Analysis
  IMAGE_OCR: '/api/analyze-image-ocr',
  URL_SCAN: '/api/scan-url',
  CAMERA: '/api/analyze-camera-capture',
  
  // AI Chat
  CHAT: '/api/chat',
  
  // User Management
  USER_STATS: '/api/user/stats',
  
  // Authority & Verification
  VERIFY_ID: '/api/auth/verify-government-id',
  
  // Intelligence & Verification  
  THREAT_INTELLIGENCE: '/api/threat-intelligence',
  FACT_CHECK: '/api/fact-check',
  NEWS_VERIFY: '/api/verify-news',
  
  // System
  HEALTH: '/health',
  STATUS: '/api/status',
  SYSTEM_STATS: '/api/system/stats',
  
  // Utilities
  UPLOAD: '/api/upload',
  REPORT: '/api/report-analysis',
  RATE_LIMIT: '/api/rate-limit'
};

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST', 
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const ANALYSIS_TYPES = {
  TEXT: 'text',
  IMAGE: 'image', 
  URL: 'url',
  CAMERA: 'camera'
};
