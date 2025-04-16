import React, { memo } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const DocumentFilters = memo(({ 
  documentStatusFilter, 
  setDocumentStatusFilter
}) => {
  const selectStyles = {
    borderRadius: '8px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
    }
  };

  return (
    <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
      <FormControl sx={{ minWidth: 210, ...selectStyles }}>
        <InputLabel id="document-status-filter-label">Document Status</InputLabel>
        <Select
          labelId="document-status-filter-label"
          id="document-status-filter"
          value={documentStatusFilter}
          label="Document Status"
          onChange={(e) => setDocumentStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All Documents</MenuItem>
          <MenuItem value="verified">Verified Documents</MenuItem>
          <MenuItem value="pending">Pending Documents</MenuItem>
          <MenuItem value="rejected">Rejected Documents</MenuItem>
          <MenuItem value="not_uploaded">Not Uploaded</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
});

export default DocumentFilters; 