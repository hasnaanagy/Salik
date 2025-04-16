import React, { useEffect } from "react";
import { Box, Typography, List } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

// Navigation wrapper to handle link clicks
const NavItem = ({ text, icon, isActive, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '8px',
        backgroundColor: isActive ? "#334155" : "transparent",
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        "&:hover": { backgroundColor: "#334155" },
      }}
    >
      <Box sx={{ color: "#FFFFFF", display: 'flex' }}>{icon}</Box>
      <Typography sx={{ color: "#FFFFFF", fontSize: '14px' }}>{text}</Typography>
    </Box>
  );
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Rides", icon: <DirectionsCarIcon />, path: "/rides" },
    { text: "Services", icon: <BuildIcon />, path: "/services" },
    { text: "Documents", icon: <DescriptionIcon />, path: "/documents" },
  ];

  const handleGetUser = async () => {
    await dispatch(getUser());
  };

  useEffect(() => {
    handleGetUser();
  }, [dispatch]);
  
  // Get the current path to determine which menu item is active
  const currentPath = location.pathname;
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "250px",
        height: "100vh",
        backgroundColor: "#141212",
        padding: "30px 20px 20px 20px",
        boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'start', mb: 6 }}>
        <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
          Salik Dashboard
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 0 }}>
        {menuItems.map((item, index) => (
          <NavItem
            key={index}
            text={item.text}
            icon={item.icon}
            isActive={currentPath === item.path}
            onClick={() => handleNavigation(item.path)}
          />
        ))}
      </List>
    </Box>
  );
}