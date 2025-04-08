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
import { setImage } from "../redux/slices/imageSlice";
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

  useEffect(() => {
    if (user?.nationalIdImage) setSelectedNationalIdImage(user.nationalIdImage);
    else if (nationalIdImage) setSelectedNationalIdImage(nationalIdImage);
    if (user?.licenseImage) setSelectedLicenseImage(user.licenseImage);
    else if (licenseImage) setSelectedLicenseImage(licenseImage);
  }, [user, nationalIdImage, licenseImage]);

  const uploadToCloudinary = async (file) => {
    if (!file || typeof file === "string") return file;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "salik-preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfouknww9/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      console.log("Cloudinary response:", data);
      return data.secure_url || null;
    } catch (error) {
      console.error("❌ Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      console.log("🚀 Uploading Images to Cloudinary...");
      console.log("Selected Images:", { selectedNationalIdImage, selectedLicenseImage });

      const nationalIdUrl = selectedNationalIdImage
        ? await uploadToCloudinary(selectedNationalIdImage)
        : user?.nationalIdImage || "";
      const licenseUrl = selectedLicenseImage
        ? await uploadToCloudinary(selectedLicenseImage)
        : user?.licenseImage || "";

      console.log("Uploaded URLs:", { nationalIdUrl, licenseUrl });

      if (!nationalIdUrl && !licenseUrl) {
        setUploading(false);
        alert("❌ No new images selected!");
        return;
      }

      const formData = new FormData();
      if (nationalIdUrl) formData.append("nationalIdImage", nationalIdUrl);
      if (licenseUrl) formData.append("licenseImage", licenseUrl);

      console.log("FormData contents:", Array.from(formData.entries()));

      await dispatch(updateUser(formData));
      await dispatch(getUser());

      setUploading(false);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploading(false);
      alert("❌ Upload failed! Please try again.");
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
        return { color: "success" }; // Green dot
      case "pending":
        return { color: "warning" }; // Yellow dot
      case "rejected":
        return { color: "error" }; // Red dot
      default:
        return { color: null }; // No dot
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
            <Badge
              color={nationalIdBadge.color}
              variant="dot"
              sx={{ mr: 2 }}
            />
          )}
          <Typography fontWeight="bold">National ID</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {canUploadNationalId && (
            <ImageUpload
              type="nationalIdImage"
              label="National ID"
              setImage={(file) => {
                setSelectedNationalIdImage(file);
                dispatch(setImage({ type: "nationalIdImage", url: URL.createObjectURL(file) }));
              }}
              existingImage={user?.nationalIdImage || null} // Only show server image
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
            <Badge
              color={licenseBadge.color}
              variant="dot"
              sx={{ mr: 2 }}
            />
          )}
          <Typography fontWeight="bold">Driving License</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {canUploadLicense && (
            <ImageUpload
              type="licenseImage"
              label="License Photo"
              setImage={(file) => {
                setSelectedLicenseImage(file);
                dispatch(setImage({ type: "licenseImage", url: URL.createObjectURL(file) }));
              }}
              existingImage={user?.licenseImage || null} // Only show server image
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
          uploading || // Disable while uploading
          !canUploadNationalId || // Disable if National ID is already verified
          !canUploadLicense || // Disable if License is already verified
          !(selectedNationalIdImage && selectedLicenseImage) // Disable unless both images are selected
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

export default LicenceForm;
