import React, { useState } from 'react';
import { FlagIcon, XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const PostReporting = ({ post, user, onClose, onReport }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    { 
      id: 'misinformation', 
      label: 'Misinformation/False Information', 
      severity: 'high',
      description: 'Content contains false or misleading information',
      icon: '🚫'
    },
    { 
      id: 'spam', 
      label: 'Spam or Promotional Content', 
      severity: 'medium',
      description: 'Unwanted promotional or repetitive content',
      icon: '📧'
    },
    { 
      id: 'harassment', 
      label: 'Harassment or Bullying', 
      severity: 'high',
      description: 'Attacking or intimidating other users',
      icon: '👊'
    },
    { 
      id: 'inappropriate', 
      label: 'Inappropriate Content', 
      severity: 'medium',
      description: 'Content not suitable for the community',
      icon: '⚠️'
    },
    { 
      id: 'impersonation', 
      label: 'Impersonation', 
      severity: 'high',
      description: 'Pretending to be someone else',
      icon: '🎭'
    },
    { 
      id: 'copyright', 
      label: 'Copyright Violation', 
      severity: 'medium',
      description: 'Unauthorized use of copyrighted material',
      icon: '©️'
    },
    { 
      id: 'other', 
      label: 'Other (please specify)', 
      severity: 'low',
      description: 'Other violation not listed above',
      icon: '❓'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      const reportData = {
        postId: post.id,
        reason: selectedReason,
        details: additionalDetails,
        reportedBy: user.uid,
        reporterName: user.displayName || user.email,
        timestamp: new Date().toISOString(),
        postAuthor: post.author,
        postContent: post.content.substring(0, 200),
        severity: reportReasons.find(r => r.id === selectedReason)?.severity || 'low'
      };

      await onReport(reportData);
      setSubmitted(true);
      
      // Auto close after success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Report submission failed:', error);
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Report Submitted Successfully
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for helping keep our community safe. Our moderation team will review this report within 24 hours.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                Report ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FlagIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Report Post</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Help us maintain community standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Post Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Reporting this post:</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <img 
                  src={post.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'} 
                  alt={post.author} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{post.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4">
                    {post.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Report Reasons */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 block">
                Why are you reporting this post? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {reportReasons.map((reason) => (
                  <label 
                    key={reason.id} 
                    className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selectedReason === reason.id 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-1 text-red-600 focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{reason.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {reason.label}
                        </span>
                        {reason.severity === 'high' && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full font-medium">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reason.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Additional details (optional)
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Please provide any additional context that might help our moderation team understand the issue better..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all"
                rows={4}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {additionalDetails.length}/1000 characters
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Important Notice</p>
                  <p className="text-amber-700 dark:text-amber-300">
                    False reports may result in action against your account. Only report content that genuinely violates our community guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedReason || isSubmitting}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <FlagIcon className="w-5 h-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostReporting;
