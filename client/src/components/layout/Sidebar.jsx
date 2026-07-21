import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROLES } from '../../constants/roles';

/**
 * Main application Navigation Sidebar.
 * @param {object} props
 * @param {boolean} props.isOpen - Sidebar drawer visible state
 * @param {Function} props.onToggle - Collapse callback
 * @param {string} props.userRole - Current logged in user role
 */
export const Sidebar = ({ isOpen, onToggle, userRole = ROLES.ADMIN }) => {
  // Navigation links definition
  const allLinks = [
    {
      to: '/super-admin/dashboard',
      label: 'Super Admin Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
      roles: [ROLES.SUPER_ADMIN],
    },
    {
      to: '/super-admin/restaurants',
      label: 'SaaS Restaurants',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      roles: [ROLES.SUPER_ADMIN],
    },
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
    },
    {
      to: '/pos',
      label: 'Point of Sale (POS)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.MANAGER, ROLES.WAITER],
    },
    {
      to: '/kitchen',
      label: 'Kitchen KDS',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.KITCHEN],
    },
    {
      to: '/admin/menu',
      label: 'Menu Management',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      to: '/admin/inventory',
      label: 'Inventory',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      to: '/admin/users',
      label: 'Staff Management',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    },
    {
      to: '/reports',
      label: 'Reports & Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  ];

  // Filter links by current user role
  const activeLinks = allLinks.filter((link) => link.roles.includes(userRole));

  const handleLinkClick = () => {
    // If mobile, auto-close sidebar
    if (window.innerWidth < 768 && isOpen) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${!isOpen ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800 bg-gray-950 gap-3 overflow-hidden">
          {/* Themed Logo symbol */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 font-bold text-white text-sm shadow">
            RM
          </div>
          {isOpen && (
            <span className="font-bold text-white text-sm tracking-wider uppercase bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Restro Munch
            </span>
          )}
        </div>

        {/* Navigation Links list */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-1">
          {activeLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,0.2)]'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                }`
              }
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {(isOpen) && (
                <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button at bottom */}
        <div className="p-3 border-t border-gray-800 bg-gray-950/40 flex justify-center">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors focus:outline-none"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${
                isOpen ? 'rotate-0' : 'rotate-180'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
