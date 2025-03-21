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
  Divider,
  keyframes,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../../../public/images/logonavbar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, getUser, switchRole } from "../../redux/slices/authSlice";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const colorShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/editProfile");
    handleUserMenuClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    localStorage.removeItem("userRole");
    handleUserMenuClose();
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
  const profileImg = user?.profileImg || "https://via.placeholder.com/150";
  const currentRole = user?.type || "customer";

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        backgroundSize: "200% 200%",
        animation: `${colorShift} 10s ease infinite`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: 56, md: 64 },
          }}
        >
          {/* Logo and Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavLink
              to="/home2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={logo}
                alt="Logo"
                width={60}
                height={60}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
            </NavLink>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                ml: 3,
                animation: `${fadeIn} 0.5s ease`,
              }}
            >
              {["Home", "Services", "Activities", "Requests"].map((text) => (
                <Button
                  key={text}
                  component={NavLink}
                  to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  sx={{
                    color: "#333",
                    fontWeight: "600",
                    fontSize: "16px",
                    mx: 1.5,
                    textTransform: "none",
                    position: "relative",
                    "&:hover": {
                      color: "#000",
                      bgcolor: "rgba(255,255,255,0.2)",
                    },
                    "&.active": {
                      color: "#000",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        bottom: -4,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        bgcolor: "#000",
                      },
                    },
                  }}
                >
                  {text}
                </Button>
              ))}
            </Box>
          </Box>

          {/* User Profile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {loading ? (
              <Typography sx={{ color: "#fff", fontSize: "14px" }}>
                Loading...
              </Typography>
            ) : localStorage.getItem("token") ? (
              <Button
                onClick={handleUserMenuOpen}
                sx={{
                  color: "#333",
                  fontWeight: "600",
                  fontSize: "16px",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "20px",
                }}
              >
                <Avatar
                  src={profileImg}
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 1,
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                {fullName}
              </Button>
            ) : (
              <Button
                component={NavLink}
                to="/login"
                sx={{
                  color: "#333",
                  fontWeight: "600",
                  fontSize: "16px",
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
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
              sx={{
                mt: 1,
                "& .MuiPaper-root": {
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  animation: `${fadeIn} 0.3s ease`,
                },
              }}
            >
              <MenuItem
                onClick={handleEditProfile}
                sx={{
                  py: 1.5,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  fontSize: "15px",
                }}
              >
                <AccountCircleIcon sx={{ mr: 1.5, color: "#666" }} />
                Manage Account
              </MenuItem>
              <MenuItem
                onClick={handleSwitchRole}
                sx={{
                  py: 1.5,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  fontSize: "15px",
                }}
              >
                <SyncAltIcon sx={{ mr: 1.5, color: "#666" }} />
                Switch Role ({currentRole})
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  "&:hover": { bgcolor: "#ffebee", color: "#d32f2f" },
                  fontSize: "15px",
                }}
              >
                <ExitToAppIcon sx={{ mr: 1.5, color: "#d32f2f" }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            sx={{
              display: { xs: "block", md: "none" },
              color: "#333",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            bgcolor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            animation: `${slideIn} 0.3s ease`,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(45deg, #FFB800, #FF5722)",
            backgroundSize: "200% 200%",
            animation: `${colorShift} 10s ease infinite`,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            style={{ borderRadius: "4px" }}
          />
        </Box>
        <Divider />
        <List>
          {["Home", "Services", "Activities", "Requests"].map((text) => (
            <ListItem
              button
              key={text}
              component={NavLink}
              to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
              sx={{
                py: 1.5,
                "&:hover": { bgcolor: "#f5f5f5" },
                "&.active": { bgcolor: "#f0f0f0", fontWeight: "600" },
              }}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontSize: "16px", color: "#333" }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
