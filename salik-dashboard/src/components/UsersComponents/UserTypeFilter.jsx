import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';

const UserTypeFilter = ({ userType, setUserType }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Users Management
      </Typography>
      <FormControl sx={{ minWidth: 200 }}>
        <Select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          sx={{
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffb800',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffb800',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffb800',
            },
          }}
        >
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="customer">Customers</MenuItem>
          <MenuItem value="provider">Providers</MenuItem>
          <MenuItem value="admin">Admins</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserTypeFilter;