import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'default',
  disabled = false,
  className = '',
  icon = null,
  loading = false,
  ...props 
}) => {
  const { screenSize } = useResponsive();

  const baseClasses = `
    touch-button inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500',
    ghost: 'text-purple-600 hover:bg-purple-100 focus:ring-purple-500 dark:text-purple-400 dark:hover:bg-purple-900/20'
  };

  const sizes = {
    small: screenSize.isMobile ? 'px-3 py-2 text-sm' : 'px-3 py-2 text-sm',
    default: screenSize.isMobile ? 'px-4 py-3 text-base' : 'px-4 py-2 text-sm',
    large: screenSize.isMobile ? 'px-6 py-4 text-lg' : 'px-6 py-3 text-base'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
