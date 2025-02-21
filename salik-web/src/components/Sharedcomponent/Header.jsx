import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../../../public/images/logonavbar.jpg"; // Adjust the path
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your backend URL

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for real-time notifications
    socket.on("new-service-request", (data) => {
      setNotifications((prev) => [
        ...prev,
        `New ${data.serviceType} request near you! 📍`,
      ]);
    });

    return () => {
      socket.off("new-service-request");
    };
  }, []);

  // Handle Main Menu (Mobile)
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Notification Menu
  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
    setNotifications([]); // Clear notifications when opened
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffb800" }}>
      <Toolbar>
        {/* Logo */}
        <NavLink to="/">
          <img src={logo} alt="Logo" width="70" height="70" />
        </NavLink>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 3 }}>
          <Button component={NavLink} to="/" sx={{ color: "black", mx: 2 }}>
            Home
          </Button>
          <Button component={NavLink} to="/services" sx={{ color: "black", mx: 2 }}>
            Services
          </Button>
          <Button component={NavLink} to="/activities" sx={{ color: "black", mx: 2 }}>
            Activities
          </Button>
          <Button component={NavLink} to="/requests" sx={{ color: "black", mx: 2 }}>
            Requests
          </Button>
        </Box>

        {/* Notifications Icon */}
        <IconButton color="inherit" onClick={handleNotifMenuOpen}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon sx={{ color: "black" }} />
          </Badge>
        </IconButton>

        {/* Notification Dropdown Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifMenuClose}
        >
          {notifications.length === 0 ? (
            <MenuItem onClick={handleNotifMenuClose}>No new notifications</MenuItem>
          ) : (
            notifications.slice(-5).map((notif, index) => (
              <MenuItem key={index} onClick={handleNotifMenuClose}>
                {notif}
              </MenuItem>
            ))
          )}
        </Menu>

        {/* Login / Logout */}
        <Button
          component={NavLink}
          to={isLoggedIn ? "/signup" : "/login"}
          sx={{ color: "black", fontWeight: "bold", mx: 2 }}
        >
          {isLoggedIn ? "SIGN OUT" : "SIGN IN"}
          {isLoggedIn && (
            <FaUserCircle style={{ marginLeft: "10px", fontSize: "1.5rem" }} />
          )}
        </Button>

        {/* Mobile Menu */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* Dropdown Menu for Mobile */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuItem component={NavLink} to="/" onClick={handleMenuClose}>
            Home
          </MenuItem>
          <MenuItem component={NavLink} to="/services" onClick={handleMenuClose}>
            Services
          </MenuItem>
          <MenuItem component={NavLink} to="/activities" onClick={handleMenuClose}>
            Activities
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
