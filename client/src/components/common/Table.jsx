import React from 'react';

/**
 * Reusable data Table component.
 */
export const Table = ({
  headers = [],
  data = [],
  renderRow,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-gray-100 shadow-sm ${className}`}>
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-6 py-4 font-semibold ${
                  header.className || ''
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 4 }).map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse">
                {headers.map((_, hIdx) => (
                  <td key={hIdx} className="px-6 py-4.5">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    className="w-10 h-10 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4h16z"
                    />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            // Real Data Row rendering
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
