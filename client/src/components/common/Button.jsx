import React from 'react';

/**
 * A premium reusable Button component.
 * @param {object} props
 * @param {React.ReactNode} props.children - Button label / content
 * @param {'primary'|'secondary'|'accent'|'danger'|'outline'|'text'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading=false] - Shows loading spinner
 * @param {boolean} [props.disabled=false] - Disables interaction
 * @param {string} [props.className=''] - Extra Tailwind classes
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.rest] - Extra attributes
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover-scale';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500 border border-transparent shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300 border border-transparent',
    accent: 'bg-guava-500 hover:bg-guava-600 text-white focus:ring-guava-500 border border-transparent shadow-sm',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 border border-transparent shadow-sm',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-300',
    text: 'bg-transparent hover:bg-gray-50 text-orange-600 focus:ring-orange-500 border-none',
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
