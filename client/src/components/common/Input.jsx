import React, { forwardRef } from 'react';

/**
 * Reusable Form Input component.
 */
export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  id,
  ...rest
}, ref) => {
  const inputId = id || `input_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-700 tracking-wide"
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`w-full px-4 py-3 md:py-2.5 bg-white border rounded-lg text-sm md:text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-300'
        }`}
        {...rest}
      />

      {error && (
        <span className="text-xs text-red-600 font-medium mt-0.5">
          {error.message || error}
        </span>
      )}
      
      {!error && helperText && (
        <span className="text-xs text-gray-500">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
