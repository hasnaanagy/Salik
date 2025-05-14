import React, { useState, memo } from 'react';
import { 
  Box, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../redux/slices/authSlice';


const UserProfile = memo(() => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch=useDispatch();


  // Open menu when profile is clicked
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout action
  const handleLogout = async () => {
    handleClose();
    await dispatch(logoutUser());
    // Ensure navigation happens after state is cleared
    setTimeout(() => {
      navigate('/login');
    }, 100);
  };

  // Navigate to settings page
  const handleSettings = () => {
    handleClose();
    navigate('/settings');
  };

  // Navigate to profile page
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <Box sx={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '16px', zIndex: 100 }}>
      {/* Notification icon */}
      <IconButton 
        aria-label="notifications"
        sx={{ color: '#333', bgcolor: 'white', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
      >
        <NotificationsIcon />
      </IconButton>
      
      {/* User avatar */}
      <Avatar 
        onClick={handleProfileClick}
        alt="User Photo" 
        src={user?.profileImg || "/images/admin-photo.jpg"}
        sx={{ 
          width: 40, 
          height: 40, 
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      />
      
      {/* Dropdown menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            overflow: 'visible',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        {/* <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
});

export default UserProfile; 