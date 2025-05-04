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
      icon: <FiActivity size={20} />,
      text: "Flowcharts",
      key: "Flowcharts",
      route: "/editor",
    },
    {
      icon: <FiPieChart size={20} />,
      text: "Simulation",
      key: "simulation",
      route: "/realtime",
    },
    // { icon: <FiUsers size={20} />, text: "Users", key: "Users", route: "/users" },
    // { icon: <FiFileText size={20} />, text: "Reports", key: "Reports", route: "/reports" },
    // { icon: <FiSettings size={20} />, text: "Settings", key: "Settings", route: "/settings" },
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
      <div className="fixed bottom-0 left-0 right-0 bg-black text-yellow-400 shadow-lg z-50">
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
      className={`bg-black text-yellow-400 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      } flex-shrink-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-yellow-400">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold flex items-center">
            <FiZap className="mr-2" /> AnomalyDash
          </h1>
        ) : (
          <h1 className="text-xl font-bold">
            <FiZap />
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-800 transition-colors"
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
          ? "bg-gray-900 text-yellow-400"
          : "hover:bg-gray-800 text-yellow-400"
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
