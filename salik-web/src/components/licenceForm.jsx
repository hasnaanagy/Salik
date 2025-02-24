import React, { useState, useEffect } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { uploadImages, setImage } from "../redux/slices/imageSlice";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom"; // For navigation
import { getUser } from "../redux/slices/authSlice"; // Import getUser action

const LicenceForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch existing images from Redux
    const { nationalIdImage, licenseImage, loading } = useSelector((state) => state.images);
    const { user } = useSelector((state) => state.auth); // Fetch user data from Redux

    // Local state for image selection
    const [selectedNationalIdImage, setSelectedNationalIdImage] = useState(null);
    const [selectedLicenseImage, setSelectedLicenseImage] = useState(null);

    // Load existing images into state if they exist in Redux
    useEffect(() => {
        if (nationalIdImage) setSelectedNationalIdImage(nationalIdImage);
        if (licenseImage) setSelectedLicenseImage(licenseImage);
    }, [nationalIdImage, licenseImage]);

    // Check if images are already uploaded and navigate to addTrip if they are
    useEffect(() => {
        if (nationalIdImage && licenseImage) {
            navigate("/addTrip"); // Navigate directly if both images exist
        }
    }, [nationalIdImage, licenseImage, navigate]);

    // Fetch user data when the component mounts
    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    const handleUpload = async () => {
        await dispatch(uploadImages({
            nationalIdImage: selectedNationalIdImage,
            licenseImage: selectedLicenseImage
        }));
        navigate("/addTrip"); // Automatically navigate after upload
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
            <Typography variant="h5" fontWeight="bold">Welcome, {user?.name || "User"}</Typography>
            <Typography variant="body2" color="gray" mb={2}>
                Here's what you need to do to set up your account.
            </Typography>

            {/* National ID Upload */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">National ID</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ImageUpload
                        type="nationalIdImage"
                        label="National ID"
                        setImage={(file) => {
                            setSelectedNationalIdImage(file);
                            dispatch(setImage({ type: "nationalIdImage", url: file }));
                        }}
                        existingImage={nationalIdImage}
                    />
                </AccordionDetails>
            </Accordion>

            {/* License Photo Upload */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Driving License</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ImageUpload
                        type="licenseImage"
                        label="License Photo"
                        setImage={(file) => {
                            setSelectedLicenseImage(file);
                            dispatch(setImage({ type: "licenseImage", url: file }));
                        }}
                        existingImage={licenseImage}
                    />
                </AccordionDetails>
            </Accordion>

            {/* Upload Button */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleUpload}
                disabled={loading || !selectedNationalIdImage || !selectedLicenseImage} // Ensure both images are selected
            >
                {loading ? "Uploading..." : "Upload Images"}
            </Button>
        </Box>
    );
};

export default LicenceForm;