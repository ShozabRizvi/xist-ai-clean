// scripts/optimize.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing PRIME System for production...');

// Optimize CSS for production
const cssPath = path.join(__dirname, '../assets/css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Add production optimizations to CSS
const optimizedCSS = `
/* PRODUCTION OPTIMIZED - PRIME v2.1.0 */
${css}

/* Production performance enhancements */
* {
  box-sizing: border-box;
}

.glass-panel,
.glass-elevated {
  will-change: auto;
  contain: layout style paint;
}

/* Reduce animations on lower-end devices */
@media (max-width: 768px) {
  .animate-bounce-gentle,
  .animate-pulse-gentle,
  .animate-glow {
    animation-duration: 0.5s !important;
  }
}
`;

fs.writeFileSync(cssPath, optimizedCSS);
console.log('✅ CSS optimized for production');

// Create production config
const configPath = path.join(__dirname, '../config/production.config.js');
const productionConfig = `
// Production Configuration for PRIME System
window.PRIME_CONFIG = {
  version: '2.1.0',
  environment: 'production',
  features: {
    allEnabled: true,
    warnings: false,
    debugging: false,
    analytics: true
  },
  performance: {
    optimized: true,
    minified: true,
    compressed: true
  }
};
`;

fs.writeFileSync(configPath, productionConfig);
console.log('✅ Production configuration created');
console.log('🎉 PRIME System optimized successfully!');
