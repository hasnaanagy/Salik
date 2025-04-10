import React, { memo } from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';

const DocumentHeader = memo(() => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3,
      mt: 4 // Add top margin to account for the user profile
    }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
        Documents
      </Typography>
    </Box>
  );
});

export default DocumentHeader; 