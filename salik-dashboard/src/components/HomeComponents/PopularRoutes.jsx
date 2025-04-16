import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PopularRoutes = ({ routes }) => {
  return (
    <Box sx={{ height: '100%' }}>
      <List sx={{ p: 0 }}>
        {routes.map((route, index) => (
          <ListItem 
            key={index}
            sx={{
              borderRadius: '12px',
              mb: 2,
              transition: 'all 0.3s ease',
              background: '#ffffff90',
              backdropFilter: 'blur(10px)',
              p: 2,
              '&:hover': {
                transform: 'translateX(8px)',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                }}>
                  <LocationOnIcon sx={{ color: '#ffb800' }} />
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600,
                    color: '#2d3436'
                  }}>
                    {route._id.from}
                  </Typography>
                  <ArrowForwardIcon sx={{ color: '#ffb800' }} />
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600,
                    color: '#2d3436'
                  }}>
                    {route._id.to}
                  </Typography>
                </Box>
              }
              secondary={
                <Chip 
                  label={`${route.count} rides`}
                  size="small"
                  sx={{ 
                    backgroundColor: '#ffb80020',
                    color: '#ffb800',
                    fontWeight: 500
                  }}
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default React.memo(PopularRoutes);