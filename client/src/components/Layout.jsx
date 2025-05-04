// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState("Home");

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {!isMobile && (
          <Sidebar
            isMobile={isMobile}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            activeNavItem={activeNavItem}
            setActiveNavItem={setActiveNavItem}
          />
        )}

        <main className="flex-1 bg-gray-100 p-4 overflow-auto">{children}</main>
      </div>

      {isMobile && (
        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
        />
      )}
    </div>
  );
};

export default Layout;
