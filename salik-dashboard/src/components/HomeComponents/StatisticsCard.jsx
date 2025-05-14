import React from 'react';
import { Paper, Typography, Box, Icon } from '@mui/material';

const StatisticsCard = ({ title, value, subtitle, icon, bgColor }) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '20px',
        background: `linear-gradient(145deg, #ffffff 0%, ${bgColor}0a 100%)`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
        },
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        position: 'absolute',
        top: -20,
        right: -20,
        opacity: 0.1,
        transform: 'scale(2)'
      }}>
        {icon}
      </Box>
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" sx={{ 
          color: bgColor,
          fontWeight: 600,
          mb: 3,
          fontSize: '1.1rem'
        }}>
          {title}
        </Typography>
        
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          mb: 2,
          color: '#2d3436',
          fontSize: '2.5rem'
        }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="body2" sx={{ 
            color: '#636e72',
            fontSize: '0.9rem',
            mt: 1
          }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default React.memo(StatisticsCard);