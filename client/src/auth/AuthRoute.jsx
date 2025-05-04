// src/components/AuthRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const token = localStorage.getItem("token");
  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AuthRoute;