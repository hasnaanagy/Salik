import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import IdCardIcon from '@mui/icons-material/ContactMail';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import StatusChip from './StatusChip';
import { useDispatch } from 'react-redux';
import { verifyDocumentAction } from '../../redux/slices/documentVerificationSlice';

const DocumentApprovalModal = ({ open, handleClose, selectedUser, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [processedDocuments, setProcessedDocuments] = useState(new Set());
  const dispatch = useDispatch();

  // Determine if there are pending documents
  const hasPendingDocuments = selectedUser && (
    selectedUser.nationalIdStatus === 'pending' || 
    selectedUser.licenseStatus === 'pending'
  );

  // For verified users: show both documents with tabs
  // For pending users: show one document at a time
  useEffect(() => {
    if (!selectedUser) return;
    
    if (hasPendingDocuments) {
      // Priority is always National ID first if pending, then license
      if (selectedUser.nationalIdStatus === 'pending') {
        setCurrentDocument('nationalId');
      } else if (selectedUser.licenseStatus === 'pending') {
        setCurrentDocument('license');
      }
    } else {
      // For verified users, default to showing National ID first
      setActiveTab(0);
    }
  }, [selectedUser, hasPendingDocuments]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
      setProcessedDocuments(new Set());
    }
  }, [open]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVerifyDocument = async (action) => {
    if (!currentDocument) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use Redux action instead of direct API call
      const documentData = {
        userId: selectedUser.id,
        documentType: currentDocument,
        action
      };
      
      await dispatch(verifyDocumentAction(documentData)).unwrap();

      // Add the processed document to the set
      setProcessedDocuments(prev => new Set([...prev, `${selectedUser.id}-${currentDocument}`]));

      setSuccess(`${currentDocument === 'nationalId' ? 'National ID' : 'License'} has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // If both documents were pending, switch to the other after approval
      setTimeout(() => {
        // Check again if there are still other pending documents
        const otherDocumentPending = (
          currentDocument === 'nationalId' && selectedUser.licenseStatus === 'pending'
        ) || (
          currentDocument === 'license' && selectedUser.nationalIdStatus === 'pending'
        );
        
        if (otherDocumentPending) {
          // Switch to the other pending document
          setCurrentDocument(currentDocument === 'nationalId' ? 'license' : 'nationalId');
          setSuccess(null);
        } else {
          // If no more pending documents, refresh and close
          refreshData();
          handleClose();
        }
      }, 1500);
    } catch (err) {
      setError(err || `Failed to ${action} document`);
    } finally {
      setLoading(false);
    }
  };

  // Handle rendering of documents based on pending status
  const renderDocumentContent = () => {
    if (hasPendingDocuments) {
      // For pending documents, show one at a time
      return renderSingleDocument();
    } else {
      // For verified users, show both documents with tabs
      return renderTabDocuments();
    }
  };

  // Render a single document (for pending flow)
  const renderSingleDocument = () => {
    // Determine current document data
    const documentTitle = currentDocument === 'nationalId' ? 'National ID' : 'Driving License';
    const documentImage = currentDocument === 'nationalId' ? selectedUser?.nationalIdImage : selectedUser?.licenseImage;
    const documentStatus = currentDocument === 'nationalId' ? selectedUser?.nationalIdStatus : selectedUser?.licenseStatus;
    const isPending = documentStatus === 'pending';
    const isProcessed = processedDocuments.has(`${selectedUser?.id}-${currentDocument}`);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          {documentTitle}
        </Typography>
        
        {documentImage ? (
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <CardContent>
              <CardMedia
                component="img"
                image={documentImage}
                alt={documentTitle}
                sx={{ 
                  height: 300, 
                  objectFit: 'contain',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  bgcolor: '#f9f9f9'
                }}
              />
              
              {isPending && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleVerifyDocument('approve')}
                    disabled={loading || isProcessed}
                    sx={{ textTransform: 'none', minWidth: '150px' }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<CancelIcon />}
                    onClick={() => handleVerifyDocument('reject')}
                    disabled={loading || isProcessed}
                    sx={{ textTransform: 'none', minWidth: '150px' }}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            This user has not uploaded a {documentTitle} document.
          </Alert>
        )}
      </Box>
    );
  };

  // Render tabbed documents (for verified users)
  const renderTabDocuments = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="document tabs"
            centered
          >
            <Tab 
              icon={<IdCardIcon />} 
              label="National ID" 
              disabled={!selectedUser?.nationalIdImage}
              iconPosition="start"
            />
            <Tab 
              icon={<DriveEtaIcon />} 
              label="Driving License" 
              disabled={!selectedUser?.licenseImage}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">National ID</Typography>
              <StatusChip status={selectedUser?.nationalIdStatus || 'not_uploaded'} />
            </Box>
            
            {selectedUser?.nationalIdImage ? (
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <CardMedia
                    component="img"
                    image={selectedUser.nationalIdImage}
                    alt="National ID"
                    sx={{ 
                      height: 300, 
                      objectFit: 'contain',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      bgcolor: '#f9f9f9'
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info">
                This user has not uploaded a National ID document.
              </Alert>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Driving License</Typography>
              <StatusChip status={selectedUser?.licenseStatus || 'not_uploaded'} />
            </Box>
            
            {selectedUser?.licenseImage ? (
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <CardMedia
                    component="img"
                    image={selectedUser.licenseImage}
                    alt="Driving License"
                    sx={{ 
                      height: 300, 
                      objectFit: 'contain',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      bgcolor: '#f9f9f9'
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info">
                This user has not uploaded a Driving License document.
              </Alert>
            )}
          </Box>
        )}
      </>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Document Verification
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {selectedUser?.fullName || "User"}
            </Typography>
          </Box>
          {selectedUser && currentDocument && hasPendingDocuments && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatusChip 
                status={currentDocument === 'nationalId' 
                  ? selectedUser.nationalIdStatus 
                  : selectedUser.licenseStatus} 
              />
            </Box>
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {selectedUser && (
          <Box>
            {/* User info section */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: '8px' }}>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {selectedUser.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {selectedUser.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    National ID
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {selectedUser.nationalId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                    {selectedUser.type}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Document Section */}
            {renderDocumentContent()}

            {!currentDocument && !selectedUser.nationalIdImage && !selectedUser.licenseImage && (
              <Alert severity="info">
                No documents available for this user.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentApprovalModal; 