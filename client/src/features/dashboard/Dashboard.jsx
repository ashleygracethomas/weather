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
  FiHome,
  FiSettings,
  FiBarChart2,
  FiAlertOctagon,
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
    if (isMobile) setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Quick links data
  const quickLinks = [
    {
      icon: <FiActivity size={20} />,
      label: "Dashboard",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FiAlertOctagon size={20} />,
      label: "Alerts",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <FiBarChart2 size={20} />,
      label: "Reports",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FiSettings size={20} />,
      label: "Settings",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Mobile Quick Links Bar - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-20 md:hidden">
          <div className="flex justify-around py-3">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg ${link.color} w-full mx-1`}
                onClick={() => handleNavClick(link.label)}
              >
                <span className="mb-1">{link.icon}</span>
                <span className="text-xs font-medium">{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            {/* Mobile menu button and logo */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 mr-2 hidden"
              >
                <FiMenu size={20} className="text-black" />
              </button>
              <h1 className="text-xl font-bold text-yellow-600 hidden md:block">
                AnomalyDetect
              </h1>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Notification bell - hidden on mobile */}
              <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors hidden md:block">
                <FiBell size={20} className="text-black" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-black">
                    <FiUser size={18} />
                  </div>
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
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto p-4">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-4 mb-6 shadow-md">
              <h2 className="text-xl font-bold text-white mb-1">
                Welcome back!
              </h2>
              <p className="text-yellow-100 text-sm">
                Monitoring 3 motors with 2 active anomalies
              </p>
            </div>

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
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Vibration chart</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">
                  Recent Anomalies
                </h3>
                <button className="text-sm text-yellow-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                <ActivityItem
                  title="High vibration detected on Motor1"
                  time="10 min ago"
                  icon={<FiAlertTriangle className="text-red-500" />}
                  status="high"
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

// Reusable Components
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: "bg-green-50 border-green-100 hover:bg-green-100",
    yellow: "bg-yellow-50 border-yellow-100 hover:bg-yellow-100",
    red: "bg-red-50 border-red-100 hover:bg-red-100",
  };

  const textClasses = {
    green: "text-green-800",
    yellow: "text-yellow-800",
    red: "text-red-800",
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-sm border ${colorClasses[color]} transition-colors duration-200`}
    >
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
      className={`flex items-start p-3 rounded-md border ${statusClasses[status]} transition-transform hover:scale-[1.01]`}
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
