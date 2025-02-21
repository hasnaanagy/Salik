import React from "react";
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function UserProfile() {
  // Dummy user data
  const user = {
    name: "John Doe",
    phone: "+1 234 567 890",
    profilePic: "https://via.placeholder.com/150", // Replace with actual user profile picture
  };

  return (
    <Container sx={{ display: "flex", minHeight: "100vh", mt: 4 }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 280,
          p: 3,
          mr: 4,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "white",
        }}
      >
        {/* User Profile Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            src={user.profilePic}
            sx={{
              width: 100,
              height: 100,
              mb: 1,
              border: "4px solid #1976d2",
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sidebar Menu */}
        <List>
          <ListItem button sx={{ borderRadius: 2, "&:hover": { bgcolor: "grey.200" } }}>
            <ListItemIcon>
              <AccountCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Manage Account" />
          </ListItem>

          <ListItem button sx={{ borderRadius: 2, "&:hover": { bgcolor: "grey.200" } }}>
            <ListItemIcon>
              <SyncAltIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Switch Role to Provider" />
          </ListItem>

          <ListItem button sx={{ borderRadius: 2, "&:hover": { bgcolor: "grey.200" } }}>
            <ListItemIcon>
              <ExitToAppIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "red" }} />
          </ListItem>
        </List>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, {user.name}! 🎉
        </Typography>
      </Box>
    </Container>
  );
}
