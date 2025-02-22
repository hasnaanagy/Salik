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
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../../../public/images/logonavbar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getUser, switchRole } from "../../redux/slices/authSlice";

export function Header() {
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
    dispatch(getUser());
  };

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const fullName = user?.fullName || "Guest";
  const profileImg = user?.profileImg
    ? `http://localhost:5000${user.profileImg}`
    : "https://via.placeholder.com/150";
  const currentRole = user?.type || "customer ";


  return (
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
              {["Home", "Services", "Activities", "Requests"].map((text) => (
                <Button
                  key={text}
                  component={NavLink}
                  to={`${text === "Home" ? "/" : `/${text.toLowerCase()}`}`}
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
            ) : localStorage.getItem("token") !== null ? (
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
                {fullName}
              </Button>
            ) : (
              <Button
                component={NavLink}
                to="/login"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Login
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
                <SyncAltIcon sx={{ mr: 1 }} /> Switch Role ({currentRole})
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
            {["Home", "Services", "Activities", "Requests"].map((text) => (
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
    </AppBar>
  );
}
