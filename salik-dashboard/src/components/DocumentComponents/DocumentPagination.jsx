import React, { memo } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Stack
} from '@mui/material';

const DocumentPagination = memo(({ page, totalPages, handleChangePage }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      p: 2,
      borderTop: '1px solid rgba(0, 0, 0, 0.08)'
    }}>
      <Typography variant="body2" color="text.secondary">
        Page {page} of {totalPages}
      </Typography>
      <Stack spacing={2}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handleChangePage}
          showFirstButton 
          showLastButton
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '4px'
            }
          }}
        />
      </Stack>
    </Box>
  );
});

export default DocumentPagination; 