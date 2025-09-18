import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'default', 
  color = 'primary',
  variant = 'spinner',
  className = '',
  text = '',
  fullScreen = false,
  overlay = false
}) => {
  
  // Size classes
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  // Color classes
  const colors = {
    primary: 'text-purple-600',
    secondary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const sizeClass = sizes[size] || sizes.default;
  const colorClass = colors[color] || colors.primary;

  // Spinner Variants
  const SpinnerVariant = () => (
    <motion.div
      className={`${sizeClass} ${colorClass} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );

  const DotsVariant = () => {
    const dotVariants = {
      initial: { y: 0 },
      animate: {
        y: [-4, 0, -4],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${colorClass.replace('text-', 'bg-')}`}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  };

  const PulseVariant = () => (
    <motion.div
      className={`${sizeClass} ${colorClass.replace('text-', 'bg-')} rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const RippleVariant = () => (
    <div className={`relative ${sizeClass} ${className}`}>
      {[0, 1].map((index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 rounded-full border-2 ${colorClass.replace('text-', 'border-')}`}
          animate={{
            scale: [0, 1],
            opacity: [1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );

  const BarsVariant = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`w-1 ${colorClass.replace('text-', 'bg-')}`}
          style={{ height: size === 'xs' ? '12px' : size === 'sm' ? '16px' : '24px' }}
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const GridVariant = () => (
    <div className={`grid grid-cols-3 gap-1 ${sizeClass} ${className}`}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <motion.div
          key={index}
          className={`w-full h-full ${colorClass.replace('text-', 'bg-')} rounded-sm`}
          animate={{
            scale: [1, 0.8, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Render appropriate variant
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'ripple':
        return <RippleVariant />;
      case 'bars':
        return <BarsVariant />;
      case 'grid':
        return <GridVariant />;
      case 'spinner':
      default:
        return <SpinnerVariant />;
    }
  };

  // Content wrapper
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderSpinner()}
      {text && (
        <motion.p
          className={`text-sm ${colorClass} font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {content}
      </motion.div>
    );
  }

  // Overlay
  if (overlay) {
    return (
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {content}
      </motion.div>
    );
  }

  // Regular spinner
  return content;
};

// Specialized Loading Components
export const FullScreenLoader = ({ text = "Loading...", ...props }) => (
  <LoadingSpinner fullScreen text={text} {...props} />
);

export const OverlayLoader = ({ text = "Processing...", ...props }) => (
  <LoadingSpinner overlay text={text} {...props} />
);

export const ButtonLoader = ({ ...props }) => (
  <LoadingSpinner size="sm" color="white" variant="spinner" {...props} />
);

export const InlineLoader = ({ ...props }) => (
  <LoadingSpinner size="xs" variant="dots" {...props} />
);

// Loading states component
export const LoadingStates = ({ state = 'loading', children }) => {
  const states = {
    loading: <FullScreenLoader text="Loading application..." />,
    processing: <OverlayLoader text="Processing your request..." />,
    saving: <OverlayLoader text="Saving changes..." variant="pulse" />,
    uploading: <OverlayLoader text="Uploading files..." variant="bars" />,
    scanning: <OverlayLoader text="Scanning for threats..." variant="ripple" color="warning" />
  };

  if (state && states[state]) {
    return states[state];
  }

  return children;
};

export default LoadingSpinner;
