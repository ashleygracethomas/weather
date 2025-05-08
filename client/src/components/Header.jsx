import React from "react";
import { FiBell, FiChevronDown, FiSearch, FiUser, FiMenu } from "react-icons/fi";

const Header = ({ 
  toggleSidebar, 
  toggleProfile, 
  isProfileOpen, 
  navigate, 
  handleLogout 
}) => {
  return (
    <header className=" shadow-sm z-10 fixed top-0 left-0 right-0">
      <div className="flex items-center justify-between p-4">
        {/* Mobile menu button and logo */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 mr-2 md:hidden"
          >
            <FiMenu size={20} className="text-black" />
          </button>
          <h1 className="text-lg font-semibold text-black md:hidden">Dashboard</h1>
        </div>

        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm w-full"
            />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notification bell - hidden on mobile */}
          <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors hidden md:block">
            <FiBell size={20} className="text-black" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile dropdown - always visible */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-black">
                <FiUser size={18} />
              </div>
              <span className="text-sm font-medium hidden md:inline">
                John Doe
              </span>
              <FiChevronDown className="hidden md:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 overflow-hidden">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                >
                  Your Profile
                </button>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                >
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;