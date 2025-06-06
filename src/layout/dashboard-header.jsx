import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';



function DashboardHeader({ onMenuClick }) {
  const { currentUser:user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="lg:hidden -ml-2 p-2 text-gray-500 hover:text-gray-600"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-1 items-center justify-center px-6 lg:justify-end">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div> */}
              {/* <input
                id="search"
                name="search"
                className="block w-full rounded-full border-dashed border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="Search..."
                type="search"
              /> */}
            </div>
          </div>
        </div>

        {/* Right: User Menu & Notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {/* <button
            type="button"
            className="relative p-2 text-gray-500 hover:text-gray-600"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
          </button> */}

          {/* User Menu */}
          <div className="relative flex items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-brand-purple flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;