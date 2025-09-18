import React, { useState } from 'react';
import {
  DocumentArrowDownIcon,
  ShareIcon,
  PrinterIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AnalysisReport = ({ analysisData, onShare, onSave }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Export as PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('analysis-report');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `xist-ai-analysis-${Date.now()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
    setIsExporting(false);
  };

  // Export as JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify({
      ...analysisData,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xist-ai-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share analysis
  const shareAnalysis = () => {
    const shareData = {
      title: 'Xist AI Analysis Report',
      text: `Content credibility analysis: ${analysisData.credibilityScore}% credible`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      const text = `Xist AI Analysis Report\nCredibility Score: ${analysisData.credibilityScore}%\nAnalysis: ${analysisData.analysis}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Analysis copied to clipboard!');
      });
    }
  };

  const getCredibilityColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getCredibilityIcon = (score) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    if (score >= 40) return '🟠';
    return '🔴';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-6">
      
      {/* Export Actions */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
          Analysis Report
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={shareAnalysis}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={exportToJSON}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>JSON</span>
          </button>
          
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div id="analysis-report" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Xist AI Analysis Report</h1>
              <p className="text-purple-100">Professional Misinformation Detection & Credibility Assessment</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{analysisData.credibilityScore}%</div>
              <div className="text-sm text-purple-200">Credibility Score</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Executive Summary */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ShieldCheckIcon className="w-6 h-6 mr-2" />
              Executive Summary
            </h2>
            
            <div className={`p-4 rounded-lg border ${getCredibilityColor(analysisData.credibilityScore)}`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{getCredibilityIcon(analysisData.credibilityScore)}</span>
                <div>
                  <h3 className="font-bold text-lg">
                    {analysisData.credibilityScore >= 80 ? 'Highly Credible Content' :
                     analysisData.credibilityScore >= 60 ? 'Moderately Credible' :
                     analysisData.credibilityScore >= 40 ? 'Low Credibility Warning' :
                     'High Risk - Likely Misinformation'}
                  </h3>
                  <p className="text-sm opacity-75">
                    Based on comprehensive analysis of {analysisData.claims?.length || 0} factual claims
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3">
                <div 
                  className="h-3 rounded-full bg-current transition-all duration-1000"
                  style={{ width: `${analysisData.credibilityScore}%` }}
                />
              </div>
              
              <p className="text-sm leading-relaxed">
                {analysisData.analysis}
              </p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2" />
              Detailed Analysis
            </h2>
            
            {/* Analysis Metrics */}
            {analysisData.detailedMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-300 text-sm font-medium">Source Credibility</div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {analysisData.detailedMetrics.sourceCredibility || 'N/A'}%
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-300 text-sm font-medium">Fact-Check Consensus</div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {analysisData.detailedMetrics.factCheckConsensus || 'N/A'}%
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <div className="text-green-600 dark:text-green-300 text-sm font-medium">Claims Verification</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {analysisData.detailedMetrics.claimsVerification || 'N/A'}%
                  </div>
                </div>
              </div>
            )}

            {/* Claims Analysis */}
            {analysisData.claims && analysisData.claims.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  Factual Claims Identified ({analysisData.claims.length})
                </h3>
                <div className="space-y-3">
                  {analysisData.claims.map((claim, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Claim {idx + 1} • {claim.type}
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          {Math.round(claim.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{claim.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Source Credibility */}
          {analysisData.sourceCredibility && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                Source Credibility Assessment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">✅ Trusted Sources</h4>
                  {analysisData.sourceCredibility.trustedSources?.length > 0 ? (
                    <div className="space-y-2">
                      {analysisData.sourceCredibility.trustedSources.map((source, idx) => (
                        <div key={idx} className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            {source}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No trusted sources identified</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">⚠️ Suspicious Sources</h4>
                  {analysisData.sourceCredibility.suspiciousSources?.length > 0 ? (
                    <div className="space-y-2">
                      {analysisData.sourceCredibility.suspiciousSources.map((source, idx) => (
                        <div key={idx} className="bg-red-50 dark:bg-red-900 p-3 rounded-lg">
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">
                            {source}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No suspicious sources detected</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Corrective Information */}
          {analysisData.correctiveInformation && analysisData.correctiveInformation.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2" />
                Corrective Information
              </h2>
              
              <div className="space-y-4">
                {analysisData.correctiveInformation.map((correction, idx) => (
                  <div key={idx} className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Correction #{idx + 1}
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      <strong>Original Claim:</strong> {correction.originalClaim}
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      <strong>Correct Information:</strong> {correction.correction}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Source: {correction.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysisData.recommendations && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2" />
                Professional Recommendations
              </h2>
              
              <div className="space-y-2">
                {analysisData.recommendations.map((recommendation, idx) => (
                  <div key={idx} className="flex items-start bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
                    <span className="text-yellow-600 mr-2 mt-0.5">•</span>
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                      {recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Analysis Metadata
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <strong>Analysis Date:</strong> {formatDate(Date.now())}
              </div>
              <div>
                <strong>Processing Time:</strong> {analysisData.processingTime ? `${(analysisData.processingTime / 1000).toFixed(1)}s` : 'N/A'}
              </div>
              <div>
                <strong>Content Length:</strong> {analysisData.content ? `${analysisData.content.length} characters` : 'N/A'}
              </div>
              <div>
                <strong>Analysis Engine:</strong> Xist AI Advanced v3.2
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              This analysis was generated by Xist AI's advanced misinformation detection system.
              <br />
              For questions about this report, contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
