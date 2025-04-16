import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Box, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UsersTable = ({ users, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, handleDelete }) => {
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });

  const handleDeleteClick = (userId) => {
    setDeleteModal({ open: true, userId });
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteModal.userId);
    setDeleteModal({ open: false, userId: null });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff8e1' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Photo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>National ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.profileImg ? (
                      <Box
                        component="img"
                        src={user.profileImg}
                        alt={user.fullName}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ width: 40, height: 40, color: 'grey.500' }} />
                    )}
                  </TableCell>
                  <TableCell>{user.nationalId}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{user.type}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleDeleteClick(user.id)}
                      disabled={user.type === 'admin'}
                      sx={{ 
                        color: user.type === 'admin' ? 'grey.400' : 'error.main',
                        '&:hover': {
                          backgroundColor: user.type === 'admin' ? 'transparent' : 'error.light',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onClose={() => setDeleteModal({ open: false, userId: null })}>
        <DialogTitle sx={{ color: 'error.main' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteModal({ open: false, userId: null })}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTable;