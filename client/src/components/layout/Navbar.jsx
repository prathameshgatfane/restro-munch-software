import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOnlineStatus } from '../../services/offline/networkStatus';
import { ROLE_LABELS } from '../../constants/roles';

/**
 * Top Navbar component.
 * @param {object} props
 * @param {object} props.user - Logged in user object
 * @param {Function} props.onLogout - Logout callback handler
 */
export const Navbar = ({ user = {}, onLogout }) => {
  const location = useLocation();
  const isOnline = useOnlineStatus();


  // Simple Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Dashboard';
    
    return paths.map((path) => {
      // capitalize first letter and replace dashes
      return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    }).join(' / ');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Navigation Breadcrumbs */}
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
          {getBreadcrumbs()}
        </h2>
      </div>

      {/* Right side: Online Status + Sync + Profile info */}
      <div className="flex items-center gap-4">
        {/* Network Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isOnline
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700 animate-pulse'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
        </div>

        {/* User profile dropdown summary */}
        {user.name && (
          <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
                {ROLE_LABELS[user.role] || 'Staff'}
              </p>
            </div>
            
            {/* Circular Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-guava-400 flex items-center justify-center font-bold text-white text-xs border border-white shadow-sm uppercase">
              {user.name.charAt(0)}
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-red-500 transition-all focus:outline-none"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
