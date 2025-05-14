import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Documents from "../pages/Documents";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";
import { useSelector } from "react-redux";
import Users from "../pages/Users";

/**
 * Simple placeholder component for routes that don't have their own pages yet
 * @param {Object} props
 * @param {string} props.title - The title to display on the placeholder page
 */
const PlaceholderPage = ({ title }) => (
  <Box sx={{ padding: "20px" }}>
    <h2>{title}</h2>
    <p>This page is under development.</p>
  </Box>
);


const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const isLoginPage = location.pathname === '/login';

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!token && !isLoginPage) {
      navigate('/login');
    }
  }, [token, isLoginPage, navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar navigation - only shown when not on login page */}
      {!isLoginPage && <Sidebar />}
      
      {/* Main content area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          padding: isLoginPage ? 0 : "20px", 
          overflow: "auto", 
          position: 'relative',
          width: isLoginPage ? '100%' : 'auto'
        }}
      >
        {/* User profile in top-right corner - only shown when not on login page */}
        {!isLoginPage && <UserProfile />}
        
        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default function MainLayout() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
