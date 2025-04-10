import React, { memo } from 'react';
import { Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const StatusChip = memo(({ status }) => {
  let color;
  let label = status;
  let icon;
  
  switch (status) {
    case 'verified':
      color = 'success';
      label = 'Verified';
      icon = <CheckCircleOutlineIcon fontSize="small" />;
      break;
    case 'accepted':
      color = 'success';
      label = 'Accepted';
      icon = <CheckCircleOutlineIcon fontSize="small" />;
      break;
    case 'pending':
      color = 'warning';
      label = 'Pending';
      icon = <HourglassEmptyIcon fontSize="small" />;
      break;
    case 'rejected':
      color = 'error';
      label = 'Rejected';
      icon = <ErrorOutlineIcon fontSize="small" />;
      break;
    case 'not_uploaded':
      color = 'default';
      label = 'Not Uploaded';
      icon = <RemoveCircleOutlineIcon fontSize="small" />;
      break;
    case 'null':
    case null:
      color = 'default';
      label = 'Not Submitted';
      icon = <RemoveCircleOutlineIcon fontSize="small" />;
      break;
    default:
      color = 'default';
      label = 'Unknown Status';
      icon = <RemoveCircleOutlineIcon fontSize="small" />;
  }
  
  return (
    <Chip 
      label={label} 
      color={color} 
      size="small" 
      icon={icon} 
      sx={{ 
        borderRadius: '4px',
        textTransform: 'capitalize',
        '& .MuiChip-icon': { 
          marginLeft: '4px',
          marginRight: '-4px'
        }
      }} 
    />
  );
});

export default StatusChip; 