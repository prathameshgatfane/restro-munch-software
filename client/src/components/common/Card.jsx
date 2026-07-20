import React from 'react';

/**
 * Reusable Card layout block.
 */
export const Card = ({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  className = '',
  hoverEffect = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden flex flex-col ${
        hoverEffect ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-gray-200' : ''
      } ${className}`}
    >
      {/* Header section */}
      {(title || subtitle || headerActions) && (
        <div className="px-4 py-3 md:px-5 md:py-4 border-b border-gray-50 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-sm font-bold text-gray-900 leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex-shrink-0">{headerActions}</div>}
        </div>
      )}

      {/* Body section */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">{children}</div>

      {/* Footer section */}
      {footer && (
        <div className="px-4 py-3 md:px-5 md:py-3.5 bg-gray-50/50 border-t border-gray-50 mt-auto flex items-center justify-between text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
