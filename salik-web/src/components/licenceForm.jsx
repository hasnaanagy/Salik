import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Badge,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { setImage, clearImages } from "../redux/slices/imageSlice";
import { getUser, updateUser } from "../redux/slices/authSlice";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom";

const LicenceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { nationalIdImage, licenseImage } = useSelector((state) => state.images);

  const [selectedNationalIdImage, setSelectedNationalIdImage] = useState(null);
  const [selectedLicenseImage, setSelectedLicenseImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Set initial state from user data (Cloudinary URLs)
  useEffect(() => {
    if (user?.nationalIdImage) setSelectedNationalIdImage(user.nationalIdImage);
    if (user?.licenseImage) setSelectedLicenseImage(user.licenseImage);
  }, [user]);

  const uploadToCloudinary = async (file) => {
    if (!file || typeof file === "string") {
      console.log("Skipping upload: file is", file);
      return file; // Return existing Cloudinary URL or null
    }

    console.log("Uploading file to Cloudinary:", file.name, file.type, file.size);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "salik-preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfouknww9/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
      console.log("Cloudinary success:", data.secure_url);
      return data.secure_url || null;
    } catch (error) {
      console.error("❌ Cloudinary Upload Error:", error.message);
      throw error;
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      console.log("🚀 Starting upload process...");
      console.log("Selected Images:", { selectedNationalIdImage, selectedLicenseImage });

      const nationalIdUrl =
        selectedNationalIdImage && typeof selectedNationalIdImage !== "string"
          ? await uploadToCloudinary(selectedNationalIdImage)
          : user?.nationalIdImage || "";
      const licenseUrl =
        selectedLicenseImage && typeof selectedLicenseImage !== "string"
          ? await uploadToCloudinary(selectedLicenseImage)
          : user?.licenseImage || "";

      console.log("Uploaded URLs:", { nationalIdUrl, licenseUrl });

      if ((!nationalIdUrl && !licenseUrl) && (!selectedNationalIdImage && !selectedLicenseImage)) {
        console.log("No new images to upload");
        setUploading(false);
        alert("❌ No new images selected!");
        return;
      }

      const formData = new FormData();
      if (nationalIdUrl) formData.append("nationalIdImage", nationalIdUrl);
      if (licenseUrl) formData.append("licenseImage", licenseUrl);

      console.log("FormData contents:", Array.from(formData.entries()));

      const result = await dispatch(updateUser(formData)).unwrap();
      console.log("Update result:", result);
      await dispatch(getUser()).unwrap();

      // Clear preview images after successful upload
      dispatch(clearImages());

      setUploading(false);
      alert("✅ Images uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload failed:", error.message || error);
      setUploading(false);
      alert(`❌ Upload failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleNext = () => {
    if (user?.nationalIdStatus === "verified" && user?.licenseStatus === "verified") {
      navigate("/addTrip");
    }
  };

  const isNextDisabled = user?.nationalIdStatus !== "verified" || user?.licenseStatus !== "verified";

  const getBadgeProps = (status) => {
    switch (status) {
      case "verified":
        return { color: "success" };
      case "pending":
        return { color: "warning" };
      case "rejected":
        return { color: "error" };
      default:
        return { color: null };
    }
  };

  const nationalIdBadge = getBadgeProps(user?.nationalIdStatus);
  const licenseBadge = getBadgeProps(user?.licenseStatus);

  const canUploadNationalId = user?.nationalIdStatus !== "verified";
  const canUploadLicense = user?.licenseStatus !== "verified";

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        Welcome, {user?.fullName || "User"}
      </Typography>
      <Typography variant="body2" color="gray" mb={2}>
        Upload your documents to get verified and start offering rides.
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {nationalIdBadge.color && (
            <Badge color={nationalIdBadge.color} variant="dot" sx={{ mr: 2 }} />
          )}
          <Typography fontWeight="bold">National ID</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {canUploadNationalId && (
            <ImageUpload
              type="nationalIdImage"
              label="National ID"
              setImage={(file) => {
                console.log("Setting National ID file:", file);
                setSelectedNationalIdImage(file); // Store File object
                dispatch(setImage({ type: "nationalIdImage", url: file ? URL.createObjectURL(file) : null })); // Store preview URL
              }}
              existingImage={user?.nationalIdImage || nationalIdImage} // Show server URL or preview
            />
          )}
          {user?.nationalIdStatus && (
            <Typography variant="body2" mt={1}>
              Status: {user.nationalIdStatus.charAt(0).toUpperCase() + user.nationalIdStatus.slice(1)}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {licenseBadge.color && (
            <Badge color={licenseBadge.color} variant="dot" sx={{ mr: 2 }} />
          )}
          <Typography fontWeight="bold">Driving License</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {canUploadLicense && (
            <ImageUpload
              type="licenseImage"
              label="License Photo"
              setImage={(file) => {
                console.log("Setting License file:", file);
                setSelectedLicenseImage(file); // Store File object
                dispatch(setImage({ type: "licenseImage", url: file ? URL.createObjectURL(file) : null })); // Store preview URL
              }}
              existingImage={user?.licenseImage || licenseImage} // Show server URL or preview
            />
          )}
          {user?.licenseStatus && (
            <Typography variant="body2" mt={1}>
              Status: {user.licenseStatus.charAt(0).toUpperCase() + user.licenseStatus.slice(1)}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleUpload}
        disabled={
          uploading ||
          (!canUploadNationalId && !canUploadLicense) ||
          !(selectedNationalIdImage || selectedLicenseImage)
        }
      >
        {uploading ? <CircularProgress size={24} /> : "Upload Images"}
      </Button>

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleNext}
        disabled={isNextDisabled}
      >
        Next
      </Button>
    </Box>
  );
};

export default LicenceForm;