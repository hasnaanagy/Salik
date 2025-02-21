import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../../../public/images/logonavbar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getUser, switchRole } from "../../redux/slices/authSlice";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../../../public/images/logonavbar.jpg"; // Adjust the path
import io from "socket.io-client";
 // Replace with your backend URL

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser()); // ✅ Fetch latest user data when component mounts
  }, [dispatch]);

  const navigate = useNavigate();

  const handleEditProfile = () => navigate("/editProfile");

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleSwitchRole = async () => {
    await dispatch(switchRole());
    handleUserMenuClose();
  };

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const fullName = user?.fullName || "Guest";
  const profileImg = user?.profileImg || "https://via.placeholder.com/150";
  const currentRole = user?.role || "customer";

const socket = io("http://localhost:5000");
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
    <>
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "#ffb800", width: "100%", boxShadow: 2 }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo and Navigation Links (Left Side) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Logo */}
            <NavLink to="/" style={{ margin: "4px" }}>
              <img src={logo} alt="Logo" width="70" height="70" />
            </NavLink>

            {/* Desktop Navigation (Visible on Medium & Large Screens) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
              {["Home", "Services", "Activities"].map((text) => (
                <Button
                  key={text}
                  component={NavLink}
                  to={`/${text.toLowerCase() || ""}`}
                  sx={{ color: "black", fontWeight: "bold", mx: 1 }}
                >
                  {text}
                </Button>
              ))}
            </Box>
          </Box>

          {/* User Profile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <Button
                onClick={handleUserMenuOpen}
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                <Avatar
                  src={profileImg}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                {fullName} ({currentRole})
              </Button>
            )}

            {/* User Dropdown Menu */}
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={handleEditProfile}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Manage Account
              </MenuItem>
              <MenuItem onClick={handleSwitchRole}>
                <SyncAltIcon sx={{ mr: 1 }} /> Switch Role
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Menu Button (Hamburger) */}
          <IconButton
            edge="end"
            color="inherit"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMobileMenu}>
          <List>
            {["Home", "Services", "Activities"].map((text) => (
              <ListItem
                button
                key={text}
                component={NavLink}
                to={`/${text.toLowerCase()}`}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

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
    </AppBar>
    </>
  );
}
