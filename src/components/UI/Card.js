import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  clickable = false,
  padding = 'default',
  shadow = 'default',
  border = true,
  gradient = false,
  glowing = false,
  onClick,
  ...props 
}) => {
  
  // Base classes
  const baseClasses = 'rounded-lg transition-all duration-300';
  
  // Variant classes
  const variants = {
    default: 'bg-white dark:bg-gray-800',
    glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg',
    gradient: 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    primary: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  };
  
  // Padding classes
  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  // Shadow classes
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  
  // Border classes
  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  
  // Hover effects
  const hoverClass = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  
  // Clickable effects
  const clickableClass = clickable || onClick ? 'cursor-pointer hover:shadow-md active:scale-95' : '';
  
  // Glowing effect
  const glowingClass = glowing ? 'ring-2 ring-purple-500/20 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : '';
  
  // Gradient overlay
  const gradientOverlay = gradient ? 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/5 before:to-transparent before:pointer-events-none' : '';
  
  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variants[variant] || variants.default,
    paddings[padding] || paddings.default,
    shadows[shadow] || shadows.default,
    borderClass,
    hoverClass,
    clickableClass,
    glowingClass,
    gradientOverlay,
    className
  ].filter(Boolean).join(' ');

  // Animation variants for motion
  const motionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 }
  };

  if (onClick || hover || clickable) {
    return (
      <motion.div
        className={combinedClasses}
        onClick={onClick}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        layout
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={combinedClasses}
      variants={motionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Specialized Card Components
export const GlassCard = ({ children, ...props }) => (
  <Card variant="glass" {...props}>
    {children}
  </Card>
);

export const GradientCard = ({ children, ...props }) => (
  <Card variant="gradient" gradient={true} {...props}>
    {children}
  </Card>
);

export const ClickableCard = ({ children, onClick, ...props }) => (
  <Card clickable onClick={onClick} hover {...props}>
    {children}
  </Card>
);

export const StatusCard = ({ status = 'default', children, ...props }) => {
  const statusVariants = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    default: 'default'
  };
  
  return (
    <Card variant={statusVariants[status]} {...props}>
      {children}
    </Card>
  );
};

export const MetricCard = ({ title, value, change, icon: Icon, trend = 'neutral', ...props }) => (
  <Card hover padding="md" {...props}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {change !== undefined && (
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-500'
          }`}>
            <span>{change}</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="ml-4">
          <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
      )}
    </div>
  </Card>
);

export default Card;
