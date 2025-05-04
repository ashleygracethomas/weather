import React, { useState, useEffect } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiAlertCircle,
  FiBell,
  FiChevronDown,
  FiSearch,
  FiUser,
  FiMenu,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Anomalies");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on mobile by default
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleNavClick = (item) => {
    setActiveNavItem(item);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Always visible */}

        
        <header className="shadow-sm z-10">
       
       
       
          <div className="flex items-center justify-between p-4">


            
            {/* Mobile menu button and logo */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 mr-2 md:hidden"
              >
                {/* <FiMenu size={20} className="text-black" /> */}
              </button>
           
            </div>

            {/* Search bar - hidden on mobile */}
          

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
                    {/* <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                    >
                      Settings
                    </a> */}
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 ">
          <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
              <FiActivity className="mr-2 text-yellow-500" /> Equipment Anomaly
              Dashboard
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Normal"
                value="55"
                icon={
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiActivity className="text-green-600" size={20} />
                  </div>
                }
                color="green"
              />
              <StatCard
                title="Low-Level Anomaly"
                value="9"
                icon={
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <FiAlertCircle className="text-yellow-600" size={20} />
                  </div>
                }
                color="yellow"
              />
              <StatCard
                title="High-Level Anomaly"
                value="2"
                icon={
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FiAlertTriangle className="text-red-600" size={20} />
                  </div>
                }
                color="red"
              />
            </div>

            {/* Motor Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                  Motor1 Vibration Signal (Z Axis)
                </h3>
                <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center border border-gray-200">
                  <p className="text-gray-400">Vibration chart placeholder</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-black mr-2"></span>
                  Motor2 Vibration Signal (Z Axis)
                </h3>
                <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center border border-gray-200">
                  <p className="text-gray-400">Vibration chart placeholder</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">
                Recent Anomalies
              </h3>
              <div className="space-y-3">
                <ActivityItem
                  title="High vibration detected on Motor1"
                  time="10 min ago"
                  icon={<FiAlertTriangle className="text-red-500" />}
                  status="high"
                />
                <ActivityItem
                  title="Low anomaly detected on Motor2"
                  time="35 min ago"
                  icon={<FiAlertCircle className="text-yellow-500" />}
                  status="medium"
                />
                <ActivityItem
                  title="System check completed"
                  time="2 hours ago"
                  icon={<FiActivity className="text-green-500" />}
                  status="low"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Components (these could also be moved to separate files)
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: "bg-green-50 border-green-100",
    yellow: "bg-yellow-50 border-yellow-100",
    red: "bg-red-50 border-red-100",
  };

  const textClasses = {
    green: "text-green-800",
    yellow: "text-yellow-800",
    red: "text-red-800",
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm border ${colorClasses[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-sm font-medium ${textClasses[color]}`}>{title}</p>
          <p className={`text-2xl font-bold ${textClasses[color]} mt-1`}>
            {value}
          </p>
        </div>
        {icon}
      </div>
    </div>
  );
};

const ActivityItem = ({ title, time, icon, status }) => {
  const statusClasses = {
    high: "bg-red-50 border-red-100",
    medium: "bg-yellow-50 border-yellow-100",
    low: "bg-green-50 border-green-100",
  };

  return (
    <div
      className={`flex items-start p-3 rounded-md border ${statusClasses[status]}`}
    >
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default Dashboard;