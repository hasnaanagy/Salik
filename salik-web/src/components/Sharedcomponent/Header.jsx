import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../../public/images/logonavbar.jpg"; // Adjust the path accordingly

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Change to false to test
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle Menu Open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle Menu Close
  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <Button
            component={NavLink}
            to="/services"
            sx={{ color: "black", mx: 2 }}
          >
            Services
          </Button>
          <Button
            component={NavLink}
            to="/activities"
            sx={{ color: "black", mx: 2 }}
          >
            Activities
          </Button>
        </Box>

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
          <MenuItem
            component={NavLink}
            to="/services"
            onClick={handleMenuClose}
          >
            Services
          </MenuItem>
          <MenuItem
            component={NavLink}
            to="/activities"
            onClick={handleMenuClose}
          >
            Activities
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
