import React from "react";
import { Box, Typography, Snackbar } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../redux/slices/imageSlice";

const ProfilePhotoUpload = () => {
    const dispatch = useDispatch();
    const profilePhoto = useSelector((state) => state.images.profilePhoto);
    const [error, setError] = React.useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const validExtensions = ['jpg', 'jpeg', 'png'];

            // Check file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                setError("Invalid file type. Please upload an image (JPG, PNG, JPEG).");
                return;
            }
            // Check file MIME type (for additional validation)
            const validMimeTypes = ['image/jpeg', 'image/png'];
            if (!file.type || !validMimeTypes.includes(file.type)) {
                setError("Invalid file type. Please upload a valid image (JPG, PNG, JPEG).");
                return;
            }

            // If file is valid, dispatch upload action
            dispatch(uploadImage({ file, type: "profilePhoto" }));
            setError(null);  // Clear error if file is valid
        },
    });

    return (
        <Box
            {...getRootProps()}
            sx={{
                height: '5vh',
                border: "2px dashed gray", padding: 6,
                textAlign: "center", bgcolor: "#f5f5f5", borderRadius: 8
            }}
        >
            <input {...getInputProps()} />
            {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" width="100%" style={{ borderRadius: 8 }} />
            ) : (
                <Typography color="gray">Drop your image here</Typography>
            )}
            {error && (
                <Snackbar
                    open={true}
                    autoHideDuration={3000}
                    message={error}
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            )}
        </Box>
    );
};

export default ProfilePhotoUpload;