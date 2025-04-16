import React, { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DocumentsTable = memo(({ 
  paginatedDocuments, 
  selected, 
  handleSelectAllClick, 
  handleClick, 
  isSelected, 
  getStatusChip,
  onViewDocument
}) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={selected.length > 0 && selected.length < paginatedDocuments.length}
                checked={paginatedDocuments.length > 0 && selected.length === paginatedDocuments.length}
                onChange={handleSelectAllClick}
                inputProps={{
                  'aria-label': 'select all documents',
                }}
              />
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>License Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>National ID Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#666' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedDocuments.map((user) => {
            const isItemSelected = isSelected(user.id);
            const hasPendingDocuments = user.licenseStatus === 'pending' || user.nationalIdStatus === 'pending';
            const hasAnyDocument = user.licenseImage || user.nationalIdImage;
            const hasNullStatuses = (user.nationalIdStatus === null || user.nationalIdStatus === undefined) && 
                                   (user.licenseStatus === null || user.licenseStatus === undefined);
            
            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, user.id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={user.id}
                selected={isItemSelected}
                sx={{ 
                  '&.Mui-selected': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                      'aria-labelledby': `enhanced-table-checkbox-${user.id}`,
                    }}
                  />
                </TableCell>
                <TableCell>{user.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user.profileImg ? (
                      <Avatar src={user.profileImg} sx={{ mr: 2, width: 32, height: 32 }} />
                    ) : (
                      <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <AccountCircleIcon />
                      </Avatar>
                    )}
                    {user.fullName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.phone} 
                    size="small"
                    sx={{ 
                      borderRadius: '4px',
                      bgcolor: 'rgba(63, 81, 181, 0.1)',
                      color: 'rgb(63, 81, 181)'
                    }}
                  />
                </TableCell>
                <TableCell>{getStatusChip(user.licenseStatus || 'not_uploaded')}</TableCell>
                <TableCell>{getStatusChip(user.nationalIdStatus || 'not_uploaded')}</TableCell>
                <TableCell align="right">
                  {hasPendingDocuments ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row selection when clicking the button
                        onViewDocument(user);
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      View
                    </Button>
                  ) : hasAnyDocument && !hasNullStatuses ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDocument(user);
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        opacity: 0.7,
                        '&:hover': {
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      View
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="text"
                      size="small"
                      sx={{ 
                        minWidth: 'auto',
                        color: '#666',
                        opacity: 0.5
                      }}
                    >
                      No docs
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default DocumentsTable; 