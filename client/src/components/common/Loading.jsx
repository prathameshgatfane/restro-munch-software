import React from 'react';

/**
 * Reusable Loading Spinner component.
 */
export const Loading = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  fullPage = false,
  message = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-t-orange-500 border-r-transparent border-b-guava-500 border-l-transparent ${sizeClasses[size]}`}
        style={{ borderStyle: 'solid' }}
      />
      {message && <p className="text-xs font-semibold text-gray-500 tracking-wide">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-xs">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4 w-full h-full">{spinner}</div>;
};

export default Loading;
