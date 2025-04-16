import React from 'react';
import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const StatisticsSection = ({ title, description, children }) => {
  return (
    <Paper sx={{ 
      p: 3,
      borderRadius: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      mb: 3
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '2px solid #ffe0b2',
        pb: 2,
        mb: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffb800' }}>
          {title}
        </Typography>
        {description && (
          <Tooltip title={description}>
            <IconButton size="small">
              <InfoIcon sx={{ color: '#ffb800' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2
      }}>
        {children}
      </Box>
    </Paper>
  );
};

export default React.memo(StatisticsSection);