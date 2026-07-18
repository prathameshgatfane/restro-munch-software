import React from 'react';

/**
 * Reusable Badge indicator pill.
 */
export const Badge = ({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary'
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border tracking-wide';

  const variantStyles = {
    primary: 'bg-orange-50 border-orange-200 text-orange-700',
    secondary: 'bg-gray-100 border-gray-200 text-gray-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
