import React from "react";
import { Box, Typography, Snackbar } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

const LicensePhotoUpload = ({ setFile }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setFile(file);
        },
    });

    return (
        <Box {...getRootProps()} sx={{ border: "2px dashed gray", padding: 6 }}>
            <input {...getInputProps()} />
            <Typography color="gray">Drop your license image here</Typography>
        </Box>
    );
};


export default LicensePhotoUpload;