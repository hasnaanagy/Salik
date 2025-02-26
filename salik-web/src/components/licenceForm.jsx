import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
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

  // جلب البيانات من Redux
  const { nationalIdImage, licenseImage, loading } = useSelector(
    (state) => state.images
  );
  const { user } = useSelector((state) => state.auth);

  // الحالة المحلية لتخزين الملفات المختارة
  const [selectedNationalIdImage, setSelectedNationalIdImage] = useState(null);
  const [selectedLicenseImage, setSelectedLicenseImage] = useState(null);

  // تحميل البيانات الموجودة في Redux عند تشغيل الكومبوننت
  useEffect(() => {
    if (nationalIdImage?.file) setSelectedNationalIdImage(nationalIdImage.file);
    if (licenseImage?.file) setSelectedLicenseImage(licenseImage.file);
  }, [nationalIdImage, licenseImage]);

  useEffect(() => {
    dispatch(getUser()); // تحميل بيانات المستخدم عند التشغيل
  }, [dispatch]);

  const handleUpload = async () => {
    try {
      console.log(
        "🚀 Uploading:",
        selectedNationalIdImage,
        selectedLicenseImage
      );

      const response = await dispatch(
        uploadImages({
          nationalIdImage: selectedNationalIdImage,
          licenseImage: selectedLicenseImage,
        })
      );

      console.log("📌 Upload Response:", response);

      if (response.payload?.nationalIdImage && response.payload?.licenseImage) {
        navigate("/addTrip");
      } else {
        console.error("❌ Upload succeeded but missing image URLs:", response);
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed! Please try again.");
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
              const fileURL = URL.createObjectURL(file);
              setSelectedNationalIdImage(file);
              dispatch(setImage({ type: "nationalIdImage", url: fileURL }));
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
              const objectURL = URL.createObjectURL(file);
              setSelectedLicenseImage(file);
              dispatch(setImage({ type: "licenseImage", url: objectURL }));
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
        disabled={loading || !selectedNationalIdImage || !selectedLicenseImage}
      >
        {loading ? "Uploading..." : "Upload Images"}
      </Button>
    </Box>
  );
};

export default LicenceForm;
