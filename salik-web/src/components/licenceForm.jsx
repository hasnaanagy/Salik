import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { uploadImages, setImage } from "../redux/slices/imageSlice";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom";
import { getUser } from "../redux/slices/authSlice";

const LicenceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get data from Redux
  const { nationalIdImage, licenseImage, loading } = useSelector(
    (state) => state.images
  );
  const { user } = useSelector((state) => state.auth);

  // Local state for selected images
  const [selectedNationalIdImage, setSelectedNationalIdImage] = useState(null);
  const [selectedLicenseImage, setSelectedLicenseImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (nationalIdImage?.file) setSelectedNationalIdImage(nationalIdImage.file);
    if (licenseImage?.file) setSelectedLicenseImage(licenseImage.file);
  }, [nationalIdImage, licenseImage]);

  useEffect(() => {
    dispatch(getUser()); // Load user data on mount
  }, [dispatch]);

  // ✅ Function to upload a file to Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "salik-preset"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfouknww9/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error("❌ Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleUpload = async () => {
    setUploading(true); // Show loading while uploading

    try {
      console.log("🚀 Uploading Images to Cloudinary...");

      const nationalIdUrl = await uploadToCloudinary(selectedNationalIdImage);
      const licenseUrl = await uploadToCloudinary(selectedLicenseImage);

      if (!nationalIdUrl || !licenseUrl) {
        setUploading(false);
        alert("❌ Upload failed! Please try again.");
        return;
      }

      console.log("✅ Uploaded Successfully:", { nationalIdUrl, licenseUrl });

      // Dispatch action to store Cloudinary URLs in Redux
      await dispatch(
        uploadImages({
          nationalIdImage: nationalIdUrl,
          licenseImage: licenseUrl,
        })
      );
      dispatch(getUser());

      setUploading(false);
      navigate("/addTrip");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploading(false);
      alert("❌ Upload failed! Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        Welcome, {user?.name || "User"}
      </Typography>
      <Typography variant="body2" color="gray" mb={2}>
        Here's what you need to do to set up your account.
      </Typography>

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
              dispatch(
                setImage({
                  type: "nationalIdImage",
                  url: URL.createObjectURL(file),
                })
              );
            }}
            existingImage={nationalIdImage}
          />
        </AccordionDetails>
      </Accordion>

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
              dispatch(
                setImage({
                  type: "licenseImage",
                  url: URL.createObjectURL(file),
                })
              );
            }}
            existingImage={licenseImage}
          />
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleUpload}
        disabled={
          uploading || !selectedNationalIdImage || !selectedLicenseImage
        }
      >
        {uploading ? <CircularProgress size={24} /> : "Upload Images"}
      </Button>
    </Box>
  );
};

export default LicenceForm;
