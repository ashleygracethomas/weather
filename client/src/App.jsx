import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/Login";
import SignupPage from "./features/auth/Signup";
import OtpVerificationPage from "./features/auth/OtpVerificationPage";
import Dashboard from "./features/dashboard/Dashboard";
import Profile from "./features/profile/Profile";
import Layout from "./components/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";
import RealTime from "./features/RealTime/RealTime";
import AuthRoute from "./auth/AuthRoute";
import FlowEditor from "./features/FlowEditor/FlowEditor";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/editor"
            element={
              <Layout>
                <FlowEditor />
              </Layout>
            }
          />
          <Route
            path="/realtime"
            element={
              <Layout>
                <RealTime />
              </Layout>
            }
          />
        </Route>
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
