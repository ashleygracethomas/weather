// Sidebar.jsx
import React from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiFileText,
  FiActivity,
  FiX,
  FiMenu,
  FiZap,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  isMobile,
  isSidebarOpen,
  toggleSidebar,
  activeNavItem,
  setActiveNavItem,
}) => {
  const navigate = useNavigate();

  const handleNavClick = (key, route) => {
    setActiveNavItem(key);
    navigate(route);
  };

  const navItems = [
    { icon: <FiHome size={20} />, text: "Home", key: "Home", route: "/" },

    {
      icon: <FiPieChart size={20} />,
      text: "Simulation",
      key: "simulation",
      route: "/realtime",
    },
    {
      icon: <FiActivity size={20} />,
      text: "Flowcharts",
      key: "Flowcharts",
      route: "/editor",
    },
    {
      icon: <FiUser size={20} />,
      text: "Profile",
      key: "Profile",
      route: "/profile",
    },
  ];

  const mobileNavItems = [
    { icon: <FiHome size={20} />, text: "Home", key: "Home", route: "/" },
    {
      icon: <FiPieChart size={20} />,
      text: "Simulation",
      key: "simulation",
      route: "/realtime",
    },
    {
      icon: <FiActivity size={20} />,
      text: "Flowcharts",
      key: "Flowcharts",
      route: "/editor",
    },
    {
      icon: <FiUser size={20} />,
      text: "Profile",
      key: "Profile",
      route: "/profile",
    },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-800 to-gray-900 text-yellow-400 shadow-lg z-50 border-t border-gray-700">
        <div className="flex justify-around items-center h-16">
          {mobileNavItems.map((item) => (
            <MobileNavItem
              key={item.key}
              icon={item.icon}
              text={item.text}
              active={activeNavItem === item.key}
              onClick={() => handleNavClick(item.key, item.route)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-b from-gray-800 to-gray-900 text-yellow-400 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      } flex-shrink-0 border-r border-gray-700`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold flex items-center">
            <FiZap className="mr-2" /> WeatherSphere
          </h1>
        ) : (
          <h1 className="text-xl font-bold">
            <FiZap />
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-700 transition-colors"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            text={item.text}
            isSidebarOpen={isSidebarOpen}
            active={activeNavItem === item.key}
            onClick={() => handleNavClick(item.key, item.route)}
          />
        ))}
      </nav>
    </div>
  );
};

const NavItem = ({ icon, text, active, isSidebarOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 w-full text-left ${
        active
          ? "bg-gray-700 bg-opacity-50 text-yellow-400"
          : "hover:bg-gray-700 hover:bg-opacity-30 text-yellow-400"
      } transition-colors duration-200 mx-2 rounded-md`}
    >
      <span className={`${isSidebarOpen ? "mr-3" : "mx-auto"}`}>{icon}</span>
      {isSidebarOpen && <span className="text-sm">{text}</span>}
    </button>
  );
};

const MobileNavItem = ({ icon, text, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center h-full w-full relative ${
        active ? "text-yellow-400" : "text-yellow-400/70"
      }`}
    >
      {active && (
        <div className="absolute -top-3 w-12 h-1 bg-yellow-400 rounded-full"></div>
      )}
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{text}</span>
    </button>
  );
};

export default Sidebar;
