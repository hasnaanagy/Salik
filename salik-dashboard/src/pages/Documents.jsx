import React, { useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';

// Import components
import DocumentHeader from '../components/DocumentComponents/DocumentHeader';
import DocumentFilters from '../components/DocumentComponents/DocumentFilters';
import DocumentsTable from '../components/DocumentComponents/DocumentsTable';
import DocumentPagination from '../components/DocumentComponents/DocumentPagination';
import StatusChip from '../components/DocumentComponents/StatusChip';
import DocumentApprovalModal from '../components/DocumentComponents/DocumentApprovalModal';

// Import from redux
import { useDispatch, useSelector } from 'react-redux';
import { filterUsersAction } from '../redux/slices/documentVerificationSlice';

const Documents = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [documentStatus, setDocumentStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.documentVerificationSlice);
  
  const rowsPerPage = 5;
  
  // Filter documents based on selected filter
  const filteredDocuments = users.filter(user => {
    if (documentStatus === 'all') return true;
    
    if (documentStatus === 'not_uploaded') {
      // Show users who have null status values (not uploaded documents)
      return (user.licenseStatus === null && user.nationalIdStatus === null);
    }
    
    // Check if either license or nationalId status matches the filter
    return (user.licenseStatus === documentStatus || user.nationalIdStatus === documentStatus);
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / rowsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  
  // When filter changes, reset to first page
  useEffect(() => {
    setPage(1);
  }, [documentStatus]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedDocuments.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }
    
    setSelected(newSelected);
  };
  
  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Get status chip component
  const getStatusChip = (status) => <StatusChip status={status} />;
  
  // Handle opening the document approval modal
  const handleViewDocument = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };
  
  // Handle closing the document approval modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };
  
  // Refresh data after document approval/rejection
  const refreshData = () => {
    dispatch(filterUsersAction("provider"));
  };
  
  // Fetch providers data
  useEffect(() => {
    dispatch(filterUsersAction("provider"));
  }, [dispatch]);

  return (
    <Box sx={{ width: '100%' }}>
      <DocumentHeader />
      
      <DocumentFilters 
        documentStatusFilter={documentStatus}
        setDocumentStatusFilter={setDocumentStatus}
      />
      
      <Paper sx={{ 
        width: '100%', 
        mb: 2, 
        borderRadius: '12px', 
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '300px'
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DocumentsTable 
              paginatedDocuments={paginatedDocuments}
              selected={selected}
              handleSelectAllClick={handleSelectAllClick}
              handleClick={handleClick}
              isSelected={isSelected}
              getStatusChip={getStatusChip}
              onViewDocument={handleViewDocument}
            />
            
            <DocumentPagination 
              page={page}
              totalPages={totalPages}
              handleChangePage={handleChangePage}
            />
          </>
        )}
      </Paper>
      
      {/* Document Approval Modal */}
      <DocumentApprovalModal 
        open={modalOpen}
        handleClose={handleCloseModal}
        selectedUser={selectedUser}
        refreshData={refreshData}
      />
    </Box>
  );
};

export default Documents; 