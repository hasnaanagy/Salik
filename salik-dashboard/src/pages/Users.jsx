import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { filterUsersAction } from '../redux/slices/documentVerificationSlice';
import { deleteUser } from '../redux/slices/authSlice';
import UsersTable from '../components/UsersComponents/UsersTable';
import UserTypeFilter from '../components/UsersComponents/UserTypeFilter';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.documentVerificationSlice);
  const [userType, setUserType] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (userType === 'all') {
      dispatch(filterUsersAction(''));
    } else {
      dispatch(filterUsersAction(userType));
    }
  }, [dispatch, userType]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (userId) => {
    await dispatch(deleteUser(userId));
    if (userType === 'all') {
      dispatch(filterUsersAction(''));
    } else {
      dispatch(filterUsersAction(userType));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress sx={{ color: '#ffb800' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <UserTypeFilter userType={userType} setUserType={setUserType} />
      <UsersTable 
        users={users}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default Users;
