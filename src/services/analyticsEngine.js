import { EventEmitter } from 'events';

class AnalyticsEngine extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.updateInterval = null;
    this.realTimeData = {
      activeScans: 0,
      threatsDetected: 0,
      dailyScans: [],
      threatsByType: {},
      geographicThreats: {},
      riskTrends: [],
      performanceMetrics: {
        avgResponseTime: 1.2,
        successRate: 98.5,
        uptime: 99.9
      }
    };
    this.mockDataGenerators();
  }

  // START REAL-TIME MONITORING
  startRealTimeUpdates() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔴 Real-time analytics started');
    
    // Update every 5 seconds
    this.updateInterval = setInterval(() => {
      this.generateRealTimeUpdate();
    }, 5000);
    
    // Initial data load
    this.generateRealTimeUpdate();
  }

  // STOP REAL-TIME MONITORING
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isRunning = false;
    console.log('🟢 Real-time analytics stopped');
  }

  // GENERATE REAL-TIME DATA UPDATE
  generateRealTimeUpdate() {
    const now = new Date();
    
    // Simulate active scanning activity
    this.realTimeData.activeScans = Math.floor(Math.random() * 50) + 10;
    
    // Simulate threat detection
    if (Math.random() > 0.7) {
      this.realTimeData.threatsDetected += Math.floor(Math.random() * 3) + 1;
      this.addThreatByType();
    }
    
    // Update daily scans (last 24 hours in hourly buckets)
    this.updateDailyScans(now);
    
    // Update geographic threat data
    this.updateGeographicThreats();
    
    // Update risk trends
    this.updateRiskTrends(now);
    
    // Update performance metrics
    this.updatePerformanceMetrics();
    
    // Emit update event
    this.emit('dataUpdate', {
      timestamp: now.toISOString(),
      data: { ...this.realTimeData }
    });
  }

  // DAILY SCANS DATA (24-hour rolling window)
  updateDailyScans(now) {
    const currentHour = now.getHours();
    
    // Initialize if empty
    if (this.realTimeData.dailyScans.length === 0) {
      for (let i = 0; i < 24; i++) {
        const hour = (currentHour - (23 - i)) % 24;
        this.realTimeData.dailyScans.push({
          hour: hour < 0 ? hour + 24 : hour,
          scans: Math.floor(Math.random() * 100) + 20,
          threats: Math.floor(Math.random() * 10) + 1,
          timestamp: new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
        });
      }
    } else {
      // Update current hour
      const currentData = this.realTimeData.dailyScans[23];
      if (currentData.hour === currentHour) {
        currentData.scans += Math.floor(Math.random() * 5) + 1;
        currentData.threats += Math.random() > 0.8 ? 1 : 0;
      } else {
        // Shift array and add new hour
        this.realTimeData.dailyScans.shift();
        this.realTimeData.dailyScans.push({
          hour: currentHour,
          scans: Math.floor(Math.random() * 20) + 5,
          threats: Math.floor(Math.random() * 3),
          timestamp: now
        });
      }
    }
  }

  // THREATS BY TYPE DATA
  addThreatByType() {
    const threatTypes = ['phishing', 'malware', 'scam', 'misinformation', 'spam'];
    const randomType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    
    this.realTimeData.threatsByType[randomType] = 
      (this.realTimeData.threatsByType[randomType] || 0) + 1;
  }

  // GEOGRAPHIC THREATS DATA
  updateGeographicThreats() {
    const countries = ['US', 'CN', 'RU', 'IN', 'BR', 'GB', 'DE', 'FR', 'JP'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    if (Math.random() > 0.6) {
      this.realTimeData.geographicThreats[randomCountry] = 
        (this.realTimeData.geographicThreats[randomCountry] || 0) + 1;
    }
  }

  // RISK TRENDS DATA (7-day rolling window)
  updateRiskTrends(now) {
    const dayOfWeek = now.getDay();
    
    if (this.realTimeData.riskTrends.length === 0) {
      // Initialize 7-day data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        this.realTimeData.riskTrends.push({
          date: date.toISOString().split('T')[0],
          riskScore: Math.floor(Math.random() * 40) + 30,
          threats: Math.floor(Math.random() * 50) + 10,
          scans: Math.floor(Math.random() * 500) + 100
        });
      }
    } else {
      // Update today's data
      const today = this.realTimeData.riskTrends[6];
      today.threats += Math.random() > 0.7 ? 1 : 0;
      today.scans += Math.floor(Math.random() * 3) + 1;
      today.riskScore = Math.min(100, today.riskScore + (Math.random() - 0.5) * 2);
    }
  }

  // PERFORMANCE METRICS
  updatePerformanceMetrics() {
    this.realTimeData.performanceMetrics.avgResponseTime += (Math.random() - 0.5) * 0.1;
    this.realTimeData.performanceMetrics.avgResponseTime = Math.max(0.5, 
      Math.min(3.0, this.realTimeData.performanceMetrics.avgResponseTime));
    
    this.realTimeData.performanceMetrics.successRate += (Math.random() - 0.5) * 0.5;
    this.realTimeData.performanceMetrics.successRate = Math.max(95, 
      Math.min(100, this.realTimeData.performanceMetrics.successRate));
  }

  // GET CURRENT DATA SNAPSHOT
  getCurrentData() {
    return { ...this.realTimeData };
  }

  // MOCK DATA GENERATORS FOR DEMO
  mockDataGenerators() {
    // Initialize with some mock data
    this.realTimeData.threatsByType = {
      phishing: 45,
      malware: 23,
      scam: 34,
      misinformation: 18,
      spam: 67
    };
    
    this.realTimeData.geographicThreats = {
      US: 89,
      CN: 67,
      RU: 45,
      IN: 34,
      BR: 23
    };
  }

  // ANALYTICS CALCULATIONS
  calculateThreatGrowth() {
    const recent = this.realTimeData.riskTrends.slice(-2);
    if (recent.length < 2) return 0;
    
    const growth = ((recent[1].threats - recent[0].threats) / recent[0].threats) * 100;
    return Math.round(growth * 10) / 10;
  }

  calculateDetectionRate() {
    const totalScans = this.realTimeData.riskTrends.reduce((sum, day) => sum + day.scans, 0);
    const totalThreats = this.realTimeData.riskTrends.reduce((sum, day) => sum + day.threats, 0);
    
    return totalScans > 0 ? Math.round((totalThreats / totalScans) * 100 * 10) / 10 : 0;
  }

  // EXPORT DATA
  exportAnalyticsData(format = 'json') {
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalThreats: this.realTimeData.threatsDetected,
        activeScans: this.realTimeData.activeScans,
        threatGrowth: this.calculateThreatGrowth(),
        detectionRate: this.calculateDetectionRate()
      },
      data: this.realTimeData,
      metadata: {
        exportFormat: format,
        dataRange: '7days',
        version: '1.0.0'
      }
    };

    if (format === 'csv') {
      return this.convertToCSV(exportData);
    }
    
    return JSON.stringify(exportData, null, 2);
  }

  convertToCSV(data) {
    // Convert key metrics to CSV format
    let csv = 'Date,Scans,Threats,Risk Score\n';
    
    data.data.riskTrends.forEach(day => {
      csv += `${day.date},${day.scans},${day.threats},${day.riskScore}\n`;
    });
    
    return csv;
  }
}

export default new AnalyticsEngine();
