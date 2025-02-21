import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { uploadImages } from "../redux/slices/imageSlice";
import ImageUpload from "./ImageUpload";

const LicenceForm = () => {
    const dispatch = useDispatch();
    const [nationalIdImage, setNationalIdImage] = useState(null);
    const [licenseImage, setLicenseImage] = useState(null);

    const handleUpload = () => {
        dispatch(uploadImages({ nationalIdImage, licenseImage }));
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
            <Typography variant="h5" fontWeight="bold">Welcome, Mohamed</Typography>
            <Typography variant="body2" color="gray" mb={2}>
                Here's what you need to do to set up your account.
            </Typography>

            {/* National ID Upload */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">National ID</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ImageUpload type="nationalIdImage" label="National ID" setImage={setNationalIdImage} />
                </AccordionDetails>
            </Accordion>

            {/* License Photo Upload */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Driving License</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ImageUpload type="licenseImage" label="License Photo" setImage={setLicenseImage} />
                </AccordionDetails>
            </Accordion>

            {/* Upload Button */}
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }} 
                onClick={handleUpload}
                disabled={!nationalIdImage || !licenseImage} // Ensure both images are selected
            >
                Upload Images
            </Button>
        </Box>
    );
};

export default LicenceForm;
