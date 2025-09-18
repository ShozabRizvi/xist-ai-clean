import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Enhanced notification functions
export const showNotification = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        ...options.style
      },
      icon: '✅',
      ...options
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        ...options.style
      },
      icon: '❌',
      ...options
    });
  },

  warning: (message, options = {}) => {
    toast(message, {
      duration: 4500,
      position: 'top-right',
      style: {
        background: '#F59E0B',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
        ...options.style
      },
      icon: '⚠️',
      ...options
    });
  },

  info: (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3B82F6',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
        ...options.style
      },
      icon: 'ℹ️',
      ...options
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6366F1',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px',
        borderRadius: '10px',
        ...options.style
      },
      ...options
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred!',
    }, {
      position: 'top-right',
      style: {
        padding: '16px',
        borderRadius: '10px',
        fontWeight: '500',
      },
      ...options
    });
  }
};

// Custom Toast Component with Heroicons
const CustomToast = ({ t, message, type }) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };

  const colors = {
    success: 'text-green-600 bg-green-50',
    error: 'text-red-600 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    info: 'text-blue-600 bg-blue-50'
  };

  const IconComponent = icons[type] || InformationCircleIcon;

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-lg ${colors[type] || colors.info}`}>
      <IconComponent className="w-6 h-6 mr-3 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Main Toaster Component
const NotificationToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 20,
        right: 20,
        zIndex: 9999
      }}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#374151',
          fontWeight: '500',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '400px'
        },

        // Success toasts
        success: {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10B981',
          },
        },

        // Error toasts
        error: {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#EF4444',
          },
        },

        // Loading toasts
        loading: {
          style: {
            background: '#6366F1',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#6366F1',
          },
        }
      }}
    />
  );
};

export default NotificationToaster;
