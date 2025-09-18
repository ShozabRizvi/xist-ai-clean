import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// Notification Context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const showNotification = (message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      persistent: options.persistent || false,
      action: options.action || null,
      timestamp: new Date(),
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove non-persistent notifications
    if (!notification.persistent) {
      setTimeout(() => {
       removeNotification(id);
      }, notification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const removeAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      removeNotification,
      removeAllNotifications
    }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Individual Toast Component
const Toast = ({ notification, onRemove }) => {
  const { id, message, type, action, timestamp } = notification;
  const removeNotification = (id) => {
    if (onRemove && typeof onRemove === 'function') {
      onRemove(id);
    } else {
      console.warn('removeNotification called but onRemove not provided');
    }
  };
  
  // Icons for different types
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    default: BellIcon
  };

  // Colors for different types
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    default: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
  };

  // Icon colors
  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    default: 'text-gray-500'
  };

  const Icon = icons[type] || icons.default;
  const colorClass = colors[type] || colors.default;
  const iconColorClass = iconColors[type] || iconColors.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`relative flex items-start p-4 rounded-lg border shadow-lg backdrop-blur-sm ${colorClass} max-w-md`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>

      {/* Content */}
      <div className="ml-3 flex-1">
        <div className="text-sm font-medium">
          {message}
        </div>
        
        {/* Timestamp */}
        <div className="mt-1 text-xs opacity-75">
          {timestamp.toLocaleTimeString()}
        </div>

        {/* Action Button */}
        {action && (
          <div className="mt-2">
            <button
              onClick={() => {
                action.onClick();
                onRemove(id);
              }}
              className="text-xs font-medium underline hover:no-underline transition-all"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(id)}
        className="ml-3 flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        <XMarkIcon className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <div key={notification.id} className="pointer-events-auto">
            <Toast 
              notification={notification} 
              onRemove={removeNotification}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Utility function for standalone usage
export const showNotification = (() => {
  let notificationFunction = null;

  // Set the notification function from context
  const setNotificationFunction = (fn) => {
    notificationFunction = fn;
  };

  // Return the actual function
  return (message, type = 'info', options = {}) => {
    if (notificationFunction) {
      return notificationFunction(message, type, options);
    } else {
      // Fallback to console
      console.log(`[${type.toUpperCase()}] ${message}`);
      return Date.now();
    }
  };
})();

// Hook to register the notification function
export const useNotificationRegister = () => {
  const { showNotification: contextShowNotification } = useNotification();
  
  useEffect(() => {
    // Register the context function globally
    showNotification.setFunction = contextShowNotification;
    return () => {
      showNotification.setFunction = null;
    };
  }, [contextShowNotification]);
};

// Predefined notification types
export const notifications = {
  success: (message, options) => showNotification(message, 'success', options),
  error: (message, options) => showNotification(message, 'error', options),
  warning: (message, options) => showNotification(message, 'warning', options),
  info: (message, options) => showNotification(message, 'info', options),
  
  // Specific use cases
  loading: (message = 'Loading...') => showNotification(message, 'info', { 
    persistent: true,
    duration: 0 
  }),
  
  saved: (item = 'Changes') => showNotification(`${item} saved successfully`, 'success'),
  
  deleted: (item = 'Item') => showNotification(`${item} deleted`, 'warning'),
  
  copied: (item = 'Content') => showNotification(`${item} copied to clipboard`, 'success', {
    duration: 2000
  }),
  
  networkError: () => showNotification('Network error. Please check your connection.', 'error'),
  
  unauthorized: () => showNotification('Please sign in to continue', 'warning'),
  
  featureUnavailable: () => showNotification('This feature is coming soon!', 'info'),

  securityAlert: (message) => showNotification(message, 'error', {
    persistent: true,
    action: {
      label: 'View Details',
      onClick: () => console.log('Security alert clicked')
    }
  }),

  scanComplete: (result) => showNotification(
    result.safe ? 'Scan completed - No threats found' : 'Threats detected! Review results.',
    result.safe ? 'success' : 'warning'
  )
};

// Progress notification
export class ProgressNotification {
  constructor(message, removeNotificationFn) {
    this.removeNotification = removeNotificationFn;
    this.id = showNotification(message, 'info', { 
      persistent: true,
      message: `${message} 0%`
    });
    this.baseMessage = message;
  }

  update(progress, message = this.baseMessage) {
    // Remove the old notification and create a new one
    if (this.removeNotification) {
      this.removeNotification(this.id);
    }
    this.id = showNotification(`${message} ${progress}%`, 'info', { 
      persistent: true 
    });
  }

  complete(message = 'Completed successfully') {
    if (this.removeNotification) {
      this.removeNotification(this.id);
    }
    showNotification(message, 'success');
  }

  error(message = 'Operation failed') {
    if (this.removeNotification) {
      this.removeNotification(this.id);
    }
    showNotification(message, 'error');
  }
}

// Default export
const NotificationToast = {
  Provider: NotificationProvider,
  Container: ToastContainer,
  useNotification,
  showNotification,
  notifications,
  ProgressNotification
};

export default NotificationToast;
