# 7. Admin Dashboard

## 7.1 Dashboard Components

The Salik Admin Dashboard is built with React and Material UI, providing administrators with comprehensive tools for platform management.

### 7.1.1 Component Organization

```
salik-dashboard/
├── src/
│   ├── components/            # Reusable dashboard components
│   │   ├── Dashboard/         # Dashboard-specific components
│   │   ├── Users/             # User management components
│   │   ├── Rides/             # Ride management components
│   │   ├── Services/          # Service management components
│   │   ├── Verification/      # Document verification components
│   │   ├── Reports/           # Reporting components
│   │   └── UI/                # Common UI components
│   ├── pages/                 # Dashboard pages
│   │   ├── Dashboard.jsx      # Main dashboard page
│   │   ├── Users.jsx          # User management page
│   │   ├── Rides.jsx          # Ride management page
│   │   ├── Services.jsx       # Service management page
│   │   ├── Verification.jsx   # Document verification page
│   │   ├── Reports.jsx        # Reports page
│   │   └── Settings.jsx       # System settings page
│   ├── layout/                # Layout components
│   │   ├── MainLayout.jsx     # Main dashboard layout
│   │   ├── Sidebar.jsx        # Dashboard sidebar
│   │   └── Header.jsx         # Dashboard header
│   └── api/                   # API integration
```

### 7.1.2 Key Dashboard Components

#### Dashboard Overview

The main dashboard presents key metrics and recent activity:

```jsx
// components/Dashboard/OverviewCards.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, DirectionsCar, Build, Assignment } from '@mui/icons-material';

/**
 * Dashboard overview cards displaying key platform metrics
 */
export function OverviewCards({ metrics }) {
  const cards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: <People />,
      color: '#1976d2',
    },
    {
      title: 'Active Rides',
      value: metrics.activeRides,
      icon: <DirectionsCar />,
      color: '#2e7d32',
    },
    {
      title: 'Service Providers',
      value: metrics.serviceProviders,
      icon: <Build />,
      color: '#ed6c02',
    },
    {
      title: 'Pending Verifications',
      value: metrics.pendingVerifications,
      icon: <Assignment />,
      color: '#d32f2f',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4">{card.value}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: card.color,
                    borderRadius: '50%',
                    p: 1,
                    color: 'white',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
```

#### User Management Table

A comprehensive user management interface:

```jsx
// components/Users/UsersTable.jsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  MoreVert,
  Search,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from '@mui/icons-material';

/**
 * Users management table with filtering and actions
 */
export function UsersTable({ users, onAction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleAction = (action) => {
    onAction(action, selectedUser.id);
    handleMenuClose();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStatusChip = (user) => {
    if (user.isActive) {
      return <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />;
    } else if (user.isSuspended) {
      return <Chip icon={<Cancel />} label="Suspended" color="error" size="small" />;
    } else if (user.isPending) {
      return (
        <Chip
          icon={<HourglassEmpty />}
          label="Pending"
          color="warning"
          size="small"
        />
      );
    }
    return null;
  };

  return (
    <>
      <TextField
        variant="outlined"
        placeholder="Search users..."
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                    size="small"
                    color={
                      user.type === 'admin'
                        ? 'secondary'
                        : user.type === 'provider'
                        ? 'primary'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>{getUserStatusChip(user)}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>View Details</MenuItem>
        {selectedUser?.isActive ? (
          <MenuItem onClick={() => handleAction('suspend')}>Suspend</MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('activate')}>Activate</MenuItem>
        )}
        <MenuItem onClick={() => handleAction('reset-password')}>
          Reset Password
        </MenuItem>
        {selectedUser?.type !== 'admin' && (
          <MenuItem onClick={() => handleAction('delete')}>Delete</MenuItem>
        )}
      </Menu>
    </>
  );
}
```

#### Document Verification

Interface for approving provider documents:

```jsx
// components/Verification/DocumentVerification.jsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Avatar,
  Box,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';

/**
 * Document verification component for reviewing provider documents
 */
export function DocumentVerification({ document, onApprove, onReject }) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={document.user.profileImg} />}
        title={document.user.fullName}
        subheader={`${document.user.phone} • ${document.user.nationalId}`}
      />

      <Divider />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="National ID" />
          <Tab label="License" />
        </Tabs>
      </Box>

      <CardContent>
        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              National ID Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <img
                  src={document.nationalIdImage}
                  alt="National ID"
                  style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  ID Number: {document.user.nationalId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Submitted: {new Date(document.nationalIdSubmittedAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              License Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <img
                  src={document.licenseImage}
                  alt="Driver's License"
                  style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  License Number: {document.licenseNumber || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Submitted: {new Date(document.licenseSubmittedAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onApprove(document.id, activeTab === 0 ? 'nationalId' : 'license')}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => onReject(document.id, activeTab === 0 ? 'nationalId' : 'license')}
        >
          Reject
        </Button>
      </CardActions>
    </Card>
  );
}
```

## 7.2 Admin Functionality

The Salik Admin Dashboard provides comprehensive management tools for platform administrators.

### 7.2.1 User Management

Administrators can:

- **View User Accounts**: See all registered users with filtering and search
- **Manage User Status**: Activate or suspend user accounts
- **Reset Passwords**: Help users with account recovery
- **View User Details**: Access comprehensive user information
- **Create Admin Accounts**: Add new administrator accounts

### 7.2.2 Ride Management

Administrators can:

- **Monitor Active Rides**: View all ongoing ride bookings
- **View Ride History**: Access historical ride data with filtering
- **Handle Disputes**: Resolve issues between riders and providers
- **Cancel Rides**: Administratively cancel problematic rides
- **Generate Reports**: Create usage and performance reports

### 7.2.3 Service Management

Administrators can:

- **View Service Listings**: Monitor all service providers and offerings
- **Track Service Requests**: View all service requests and their statuses
- **Handle Service Disputes**: Resolve issues between customers and providers
- **Service Quality Monitoring**: Track ratings and reviews

### 7.2.4 Document Verification

One of the key administrative functions is document verification:

1. **Verification Queue**: View all pending document verifications
2. **Document Review**: Examine uploaded ID cards and driver licenses
3. **Approval/Rejection**: Approve or reject documents with comments
4. **Verification History**: Track all verification activities

### 7.2.5 Content Moderation

Administrators can moderate user-generated content:

1. **Review Reports**: Handle reports of inappropriate content
2. **Moderate Reviews**: Remove or edit problematic reviews
3. **Message Monitoring**: Review flagged messages for policy violations

### 7.2.6 Analytics and Reporting

The dashboard provides analytical insights:

- **User Growth**: Track new user registrations over time
- **Ride Analytics**: Monitor ride bookings, cancellations, and completions
- **Service Analytics**: Track service requests and completions
- **Revenue Reports**: View platform revenue and transaction history
- **Performance Metrics**: Monitor system performance and response times

## 7.3 Implementation

### 7.3.1 Dashboard Layout

The overall dashboard structure:

```jsx
// pages/Dashboard.jsx
import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { OverviewCards } from '../components/Dashboard/OverviewCards';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { UserStats } from '../components/Dashboard/UserStats';
import { RideStats } from '../components/Dashboard/RideStats';
import { PendingVerifications } from '../components/Dashboard/PendingVerifications';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Main dashboard page showing platform overview
 */
export default function Dashboard() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Box>Loading dashboard data...</Box>;
  if (error) return <Box>Error loading dashboard: {error.message}</Box>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <OverviewCards metrics={data.metrics} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivity activities={data.recentActivities} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Verifications
            </Typography>
            <PendingVerifications
              verifications={data.pendingVerifications}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Statistics
            </Typography>
            <UserStats stats={data.userStats} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ride Statistics
            </Typography>
            <RideStats stats={data.rideStats} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
```

### 7.3.2 Authentication and Authorization

Admin-specific authentication with role-based access control:

```jsx
// hooks/useAdminAuth.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAdminAuth } from '../redux/slices/authSlice';

/**
 * Hook to verify admin authentication status
 */
export function useAdminAuth() {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAdminAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !error) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.type !== 'admin') {
        navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, user, loading, error, navigate]);

  return { user, isAuthenticated, loading, error };
}
```

### 7.3.3 API Integration

Integration with the backend API for admin functionality:

```javascript
// api/adminApi.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin API endpoints
export const adminService = {
  // Dashboard data
  getDashboardData: () => adminApi.get('/admin/dashboard'),

  // User management
  getUsers: (params) => adminApi.get('/admin/users', { params }),
  getUserDetails: (userId) => adminApi.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, status) =>
    adminApi.patch(`/admin/users/${userId}/status`, { status }),
  resetUserPassword: (userId) =>
    adminApi.post(`/admin/users/${userId}/reset-password`),
  deleteUser: (userId) => adminApi.delete(`/admin/users/${userId}`),

  // Document verification
  getPendingVerifications: () => adminApi.get('/admin/verifications/pending'),
  approveDocument: (userId, documentType) =>
    adminApi.post(`/admin/verifications/${userId}/approve`, { documentType }),
  rejectDocument: (userId, documentType, reason) =>
    adminApi.post(`/admin/verifications/${userId}/reject`, { documentType, reason }),

  // Content moderation
  getReportedContent: () => adminApi.get('/admin/reports'),
  moderateContent: (reportId, action) =>
    adminApi.post(`/admin/reports/${reportId}/moderate`, { action }),

  // Ride management
  getRides: (params) => adminApi.get('/admin/rides', { params }),
  getRideDetails: (rideId) => adminApi.get(`/admin/rides/${rideId}`),
  cancelRide: (rideId, reason) =>
    adminApi.post(`/admin/rides/${rideId}/cancel`, { reason }),

  // Service management
  getServices: (params) => adminApi.get('/admin/services', { params }),
  getServiceDetails: (serviceId) => adminApi.get(`/admin/services/${serviceId}`),
  updateServiceStatus: (serviceId, status) =>
    adminApi.patch(`/admin/services/${serviceId}/status`, { status }),

  // Reports and analytics
  getUserStats: (period) => adminApi.get('/admin/stats/users', { params: { period } }),
  getRideStats: (period) => adminApi.get('/admin/stats/rides', { params: { period } }),
  getServiceStats: (period) => adminApi.get('/admin/stats/services', { params: { period } }),
  exportReport: (reportType, dateRange) =>
    adminApi.get('/admin/reports/export', { params: { type: reportType, ...dateRange } }),
};
```

## 7.4 Security and Access Control

The Admin Dashboard implements robust security measures:

1. **Role-Based Access Control**: Only users with the 'admin' role can access the dashboard
2. **Action Audit Logging**: All administrative actions are logged for accountability
3. **Two-Factor Authentication**: Optional 2FA for additional security
4. **Session Management**: Automatic session timeout and explicit logout
5. **IP Restriction**: Optional IP-based access restrictions
6. **Activity Monitoring**: Real-time monitoring of unusual administrative activity 